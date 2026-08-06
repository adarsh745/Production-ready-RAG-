from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    APP_NAME = "RAG Backend"
    APP_VERSION = "1.0.0"

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-rag-jwt-key-change-in-production-2026")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

settings = Settings()