from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models import DocumentShare, User
from app.schemas.common import ShareCreate, ShareOut
from app.services.document_service import accessible_document

router = APIRouter(prefix="/documents/{document_id}/shares", tags=["sharing"])
def owner_document(document_id: int, db: Session, user: User):
    document, access = accessible_document(db, document_id, user)
    if access != "owner":
        raise HTTPException(403, "Only the owner can manage access")
    return document
@router.post("", response_model=ShareOut, status_code=201)
def grant(document_id: int, payload: ShareCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    document = owner_document(document_id, db, user)
    target = db.scalar(select(User).where(User.email == payload.email))
    if not target:
        raise HTTPException(404, "No user exists with that email")
    if target.id == document.owner_id:
        raise HTTPException(400, "A document is already available to its owner")
    share = DocumentShare(document_id=document.id, user_id=target.id)
    db.add(share)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "This user already has access")
    db.refresh(share)
    return share
@router.get("", response_model=list[ShareOut])
def list_shares(document_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return owner_document(document_id, db, user).shares
@router.delete("/{user_id}", status_code=204)
def revoke(document_id: int, user_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    owner_document(document_id, db, user)
    share = db.scalar(select(DocumentShare).where(DocumentShare.document_id == document_id, DocumentShare.user_id == user_id))
    if not share:
        raise HTTPException(404, "Shared access not found")
    db.delete(share); db.commit()
    return Response(status_code=204)
