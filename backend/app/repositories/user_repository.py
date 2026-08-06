from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.user_model import User


class UserRepository:
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email.ilike(email.strip())).first()

    @staticmethod
    def get_by_id(db: Session, user_id: UUID) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(db: Session, full_name: str, email: str, password_hash: str) -> User:
        user = User(
            full_name=full_name.strip(),
            email=email.strip().lower(),
            password_hash=password_hash,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
