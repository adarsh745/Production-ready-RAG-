from fastapi import APIRouter

from app.api.routes import upload
from app.api.routes import chat
from app.api.routes import document_route
from app.api.routes import evaluation
from app.api.routes import auth
from app.api.routes import chat_history
from app.api.routes import health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router)
api_router.include_router(upload.router)
api_router.include_router(chat.router)
api_router.include_router(document_route.router)
api_router.include_router(evaluation.router)
api_router.include_router(chat_history.router)
