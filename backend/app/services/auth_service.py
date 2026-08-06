from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserLogin, Token, UserResponse
from app.repositories.user_repository import UserRepository
from app.utils.security import hash_password, verify_password, create_access_token


class AuthService:
    @staticmethod
    def signup_user(db: Session, user_data: UserCreate) -> Token:
        # Check if user with this email already exists
        existing_user = UserRepository.get_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )
        
        # Hash password (never store plain text)
        hashed_pwd = hash_password(user_data.password)

        # Create user in DB
        new_user = UserRepository.create_user(
            db=db,
            full_name=user_data.full_name,
            email=user_data.email,
            password_hash=hashed_pwd
        )

        # Generate JWT access token
        access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})

        user_response = UserResponse.model_validate(new_user)
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )

    @staticmethod
    def login_user(db: Session, login_data: UserLogin) -> Token:
        user = UserRepository.get_by_email(db, login_data.email)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated."
            )

        # Generate JWT access token
        access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

        user_response = UserResponse.model_validate(user)
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
