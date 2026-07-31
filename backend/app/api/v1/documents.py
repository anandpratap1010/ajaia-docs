from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models import Document, User
from app.schemas.common import DocumentCreate, DocumentList, DocumentOut, DocumentUpdate
from app.services.document_service import accessible_document, list_documents, serialize_document

router = APIRouter(prefix="/documents", tags=["documents"])
@router.get("", response_model=DocumentList)
def index(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return list_documents(db, user)
@router.post("", response_model=DocumentOut, status_code=201)
def create(payload: DocumentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    document = Document(title=payload.title, owner_id=user.id)
    db.add(document); db.commit(); db.refresh(document)
    document, access = accessible_document(db, document.id, user)
    return serialize_document(document, access)
@router.get("/{document_id}", response_model=DocumentOut)
def show(document_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    document, access = accessible_document(db, document_id, user)
    return serialize_document(document, access)
@router.patch("/{document_id}", response_model=DocumentOut)
def update(document_id: int, payload: DocumentUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    document, access = accessible_document(db, document_id, user)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(document, key, value)
    db.commit(); db.refresh(document)
    document, access = accessible_document(db, document.id, user)
    return serialize_document(document, access)
@router.delete("/{document_id}", status_code=204)
def destroy(document_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    document, access = accessible_document(db, document_id, user)
    if access != "owner":
        raise HTTPException(403, "Only the owner can delete this document")
    db.delete(document); db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
