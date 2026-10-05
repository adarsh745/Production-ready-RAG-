import os
import sys
from dotenv import load_dotenv

# Ensure UTF-8 output encoding for Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

load_dotenv()

class Settings:
    APP_NAME = "RAG Backend"
    APP_VERSION = "1.0.0"

    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama").lower()
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-rag-jwt-key-change-in-production-2026")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./db/chroma_db")

settings = Settings()

if not os.getenv("JWT_SECRET_KEY"):
    print("⚠️ WARNING: JWT_SECRET_KEY environment variable is not set! Using local development secret key. Set JWT_SECRET_KEY in production!", file=sys.stderr)