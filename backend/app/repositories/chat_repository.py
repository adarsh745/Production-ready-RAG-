from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.models.chat_model import ChatSession, ChatMessage


class ChatRepository:
    @staticmethod
    def create_session(db: Session, user_id: UUID, title: str = "New Chat") -> ChatSession:
        session = ChatSession(
            user_id=user_id,
            title=title
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_user_sessions(db: Session, user_id: UUID) -> List[ChatSession]:
        return (
            db.query(ChatSession)
            .filter(ChatSession.user_id == user_id)
            .order_by(desc(ChatSession.updated_at))
            .all()
        )

    @staticmethod
    def get_session_by_id(db: Session, session_id: UUID, user_id: UUID) -> Optional[ChatSession]:
        return (
            db.query(ChatSession)
            .filter(ChatSession.id == session_id, ChatSession.user_id == user_id)
            .first()
        )

    @staticmethod
    def update_session_title(db: Session, session_id: UUID, user_id: UUID, title: str) -> Optional[ChatSession]:
        session = ChatRepository.get_session_by_id(db, session_id, user_id)
        if session:
            session.title = title
            session.updated_at = func.now()
            db.commit()
            db.refresh(session)
        return session

    @staticmethod
    def delete_session(db: Session, session_id: UUID, user_id: UUID) -> bool:
        session = ChatRepository.get_session_by_id(db, session_id, user_id)
        if session:
            db.delete(session)
            db.commit()
            return True
        return False

    @staticmethod
    def create_message(
        db: Session,
        session_id: UUID,
        role: str,
        content: str,
        sources: Optional[list] = None,
        evaluation: Optional[dict] = None
    ) -> ChatMessage:
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            sources=sources or [],
            evaluation=evaluation
        )
        db.add(message)
        
        # Touch session updated_at timestamp with func.now()
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            session.updated_at = func.now()
            
        db.commit()
        db.refresh(message)
        return message

    @staticmethod
    def get_session_messages(db: Session, session_id: UUID) -> List[ChatMessage]:
        return (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
            .all()
        )
