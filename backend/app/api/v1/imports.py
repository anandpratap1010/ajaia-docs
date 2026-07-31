from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models import Document, User
from app.schemas.common import DocumentOut
from app.services.document_service import accessible_document, serialize_document
from app.services.import_service import parse_upload

router = APIRouter(prefix="/documents", tags=["imports"])
@router.post("/import", response_model=DocumentOut, status_code=201)
async def import_document(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    title, content = await parse_upload(file)
    document = Document(title=title, content=content, owner_id=user.id)
    db.add(document); db.commit(); db.refresh(document)
    document, access = accessible_document(db, document.id, user)
    return serialize_document(document, access)
