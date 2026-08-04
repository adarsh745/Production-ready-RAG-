from fastapi import APIRouter

from app.api.routes import upload
from app.api.routes import chat
from app.api.routes import document_route
from app.api.routes import evaluation

api_router = APIRouter()

api_router.include_router(upload.router)
api_router.include_router(chat.router)
api_router.include_router(document_route.router)
api_router.include_router(evaluation.router)
