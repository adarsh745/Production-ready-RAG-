from pydantic import BaseModel
from typing import List, Optional


class ChatRequest(BaseModel):
    question: str
    document_ids: Optional[List[str]] = None


class Source(BaseModel):
    document_id: str = ""
    filename: str = ""
    page: int = 0
    chunk_id: int = 0


class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]