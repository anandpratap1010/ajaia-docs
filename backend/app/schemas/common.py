from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()
class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
class DocumentCreate(BaseModel):
    title: str = Field(default="Untitled Document", max_length=150)
    @field_validator("title", mode="before")
    @classmethod
    def title_or_default(cls, value):
        return (value or "Untitled Document").strip() or "Untitled Document"
class DocumentUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=150)
    content: dict | None = None
    @field_validator("title")
    @classmethod
    def valid_title(cls, value):
        if value is not None and not value.strip():
            raise ValueError("Title cannot be blank")
        return value.strip() if value else value
    @field_validator("content")
    @classmethod
    def valid_content(cls, value):
        if value is not None and (value.get("type") != "doc" or not isinstance(value.get("content", []), list)):
            raise ValueError("Content must be a valid TipTap document")
        return value
class DocumentSummary(BaseModel):
    id: int
    title: str
    owner: UserOut
    updated_at: datetime
    access_type: str
class ShareOut(BaseModel):
    id: int
    user: UserOut
    permission: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
class DocumentOut(BaseModel):
    id: int
    title: str
    content: dict
    owner: UserOut
    current_user_access: str
    shared_users: list[ShareOut]
    created_at: datetime
    updated_at: datetime
class DocumentList(BaseModel):
    owned: list[DocumentSummary]
    shared: list[DocumentSummary]
class ShareCreate(BaseModel):
    email: EmailStr
    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()
