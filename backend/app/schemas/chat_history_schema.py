from typing import List, Optional, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class ChatMessageCreate(BaseModel):
    role: str = Field(..., description="Role of the message sender: 'user' or 'assistant'")
    content: str = Field(..., description="Message text content")
    sources: Optional[List[Any]] = Field(default=[], description="List of source document metadata")
    evaluation: Optional[dict] = Field(default=None, description="Optional RAG evaluation metrics")


class ChatMessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    sources: Optional[List[Any]] = []
    evaluation: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ChatSessionCreate(BaseModel):
    title: Optional[str] = Field(default="New Chat", description="Title of the chat session")


class ChatSessionUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Updated session title")


class ChatSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True


class ChatSessionSummaryResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    last_message: Optional[str] = None

    class Config:
        from_attributes = True
