from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.models import Document, DocumentShare, User
from app.schemas.common import DocumentOut, DocumentSummary, ShareOut

def accessible_document(db: Session, document_id: int, user: User) -> tuple[Document, str]:
    statement = select(Document).options(
        joinedload(Document.owner),
        joinedload(Document.shares).joinedload(DocumentShare.user),
    ).where(Document.id == document_id)
    document = db.execute(statement).unique().scalar_one_or_none()
    if not document:
        raise HTTPException(404, "Document not found")
    if document.owner_id == user.id:
        return document, "owner"
    if any(share.user_id == user.id for share in document.shares):
        return document, "shared"
    raise HTTPException(403, "You do not have access to this document")
def serialize_document(document: Document, access: str) -> DocumentOut:
    shares = [ShareOut.model_validate(share) for share in document.shares] if access == "owner" else []
    return DocumentOut(id=document.id, title=document.title, content=document.content, owner=document.owner, current_user_access=access, shared_users=shares, created_at=document.created_at, updated_at=document.updated_at)
def list_documents(db: Session, user: User):
    owned = db.scalars(select(Document).options(joinedload(Document.owner)).where(Document.owner_id == user.id).order_by(Document.updated_at.desc())).all()
    shared = db.scalars(select(Document).join(DocumentShare).options(joinedload(Document.owner)).where(DocumentShare.user_id == user.id).order_by(Document.updated_at.desc())).all()
    make = lambda d, access: DocumentSummary(id=d.id, title=d.title, owner=d.owner, updated_at=d.updated_at, access_type=access)
    return {"owned": [make(d, "owner") for d in owned], "shared": [make(d, "shared") for d in shared]}
