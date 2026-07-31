from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, documents, imports, shares
from app.core.config import get_settings
from app.db.base import Document, DocumentShare, User
from app.db.seed import seed
from app.db.session import Base, engine

@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    seed()
    yield

app = FastAPI(title="Ajaia Docs API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=get_settings().cors_origin_list, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router, prefix="/api/v1")
app.include_router(imports.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")
app.include_router(shares.router, prefix="/api/v1")
@app.get("/health")
def health():
    return {"status": "ok", "service": "ajaia-docs-api"}
