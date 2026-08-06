from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user_model import User
from app.utils.security import get_current_user
from app.schemas.chat_history_schema import (
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatSessionResponse,
    ChatSessionSummaryResponse,
    ChatMessageCreate,
    ChatMessageResponse,
)
from app.services.chat_history_service import ChatHistoryService

router = APIRouter(prefix="/chats", tags=["Chat History"])


@router.get("", response_model=List[ChatSessionSummaryResponse])
def get_user_chat_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch all chat sessions for the authenticated user."""
    return ChatHistoryService.get_user_sessions(db, current_user.id)


@router.post("", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
def create_chat_session(
    payload: ChatSessionCreate = ChatSessionCreate(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new chat session for the authenticated user."""
    return ChatHistoryService.create_chat_session(db, current_user.id, payload.title or "New Chat")


@router.get("/{session_id}", response_model=ChatSessionResponse)
def get_chat_session_details(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get complete details and messages for a specific chat session."""
    return ChatHistoryService.get_session_details(db, session_id, current_user.id)


@router.put("/{session_id}", response_model=ChatSessionResponse)
def rename_chat_session(
    session_id: UUID,
    payload: ChatSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Rename a specific chat session."""
    return ChatHistoryService.update_session_title(db, session_id, current_user.id, payload.title)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a chat session and all associated messages."""
    ChatHistoryService.delete_session(db, session_id, current_user.id)
    return None


@router.post("/{session_id}/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
def add_chat_message(
    session_id: UUID,
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a message (user or assistant) to a chat session."""
    return ChatHistoryService.add_message(
        db,
        session_id=session_id,
        user_id=current_user.id,
        role=payload.role,
        content=payload.content,
        sources=payload.sources,
        evaluation=payload.evaluation,
    )
