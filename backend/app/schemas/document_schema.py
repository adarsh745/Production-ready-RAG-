from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel


class DocumentCreate(BaseModel):

    filename: str
    filepath: str
    pages: Optional[int] = 0
    chunks: Optional[int] = 0


class DocumentResponse(BaseModel):

    id: UUID
    filename: str
    filepath: str
    pages: int
    chunks: int
    is_indexed: bool
    uploaded_at: datetime

    class Config:
        from_attributes = True