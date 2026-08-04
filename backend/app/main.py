from dotenv import load_dotenv

# Load .env FIRST
load_dotenv()

from fastapi import FastAPI

from app.core.config import settings
from app.middleware.cors import add_cors
from app.api.routes.router import api_router
from app.rag.retriever import retrieve_documents

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)



add_cors(app)

app.include_router(api_router)


