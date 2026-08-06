from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import AuthService
from app.services.cloudinary_service import upload_avatar_to_cloudinary
from app.models.user_model import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    Returns access token and user info upon successful creation.
    """
    return AuthService.signup_user(db=db, user_data=user_data)


@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password.
    Returns access_token, token_type, and user profile.
    """
    return AuthService.login_user(db=db, login_data=login_data)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current logged in user details.
    Protected route - requires valid JWT Bearer Token.
    """
    return current_user


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload user profile picture to Cloudinary and update PostgreSQL record.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, WEBP).")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    # Upload to Cloudinary CDN
    secure_url = upload_avatar_to_cloudinary(content, file.filename or "profile.png")

    # Update current user avatar_url in PostgreSQL
    current_user.avatar_url = secure_url
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "avatar_url": secure_url,
        "message": "Profile picture updated successfully on Cloudinary"
    }
