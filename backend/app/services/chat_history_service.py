from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.chat_repository import ChatRepository
from app.models.chat_model import ChatSession, ChatMessage
from app.schemas.chat_history_schema import ChatSessionResponse, ChatMessageResponse, ChatSessionSummaryResponse


class ChatHistoryService:
    @staticmethod
    def create_chat_session(db: Session, user_id: UUID, title: str = "New Chat") -> ChatSessionResponse:
        session = ChatRepository.create_session(db, user_id, title)
        return ChatSessionResponse.model_validate(session)

    @staticmethod
    def get_user_sessions(db: Session, user_id: UUID) -> List[ChatSessionSummaryResponse]:
        sessions = ChatRepository.get_user_sessions(db, user_id)
        summaries = []
        for s in sessions:
            messages = s.messages
            last_msg = messages[-1].content if messages else None
            summaries.append(
                ChatSessionSummaryResponse(
                    id=s.id,
                    user_id=s.user_id,
                    title=s.title,
                    created_at=s.created_at,
                    updated_at=s.updated_at,
                    message_count=len(messages),
                    last_message=last_msg
                )
            )
        return summaries

    @staticmethod
    def get_session_details(db: Session, session_id: UUID, user_id: UUID) -> ChatSessionResponse:
        session = ChatRepository.get_session_by_id(db, session_id, user_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
        return ChatSessionResponse.model_validate(session)

    @staticmethod
    def update_session_title(db: Session, session_id: UUID, user_id: UUID, title: str) -> ChatSessionResponse:
        session = ChatRepository.update_session_title(db, session_id, user_id, title.strip())
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
        return ChatSessionResponse.model_validate(session)

    @staticmethod
    def delete_session(db: Session, session_id: UUID, user_id: UUID) -> bool:
        success = ChatRepository.delete_session(db, session_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
        return True

    @staticmethod
    def add_message(
        db: Session,
        session_id: UUID,
        user_id: UUID,
        role: str,
        content: str,
        sources: Optional[list] = None,
        evaluation: Optional[dict] = None
    ) -> ChatMessageResponse:
        session = ChatRepository.get_session_by_id(db, session_id, user_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )

        # Auto-generate title if this is the first question and title is default "New Chat"
        if session.title == "New Chat" and role == "user":
            auto_title = content.strip()
            if len(auto_title) > 30:
                auto_title = auto_title[:30].rsplit(' ', 1)[0] + "..."
            ChatRepository.update_session_title(db, session_id, user_id, auto_title)

        msg = ChatRepository.create_message(
            db,
            session_id=session_id,
            role=role,
            content=content,
            sources=sources,
            evaluation=evaluation
        )
        return ChatMessageResponse.model_validate(msg)
