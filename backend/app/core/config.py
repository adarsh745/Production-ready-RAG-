from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    APP_NAME = "RAG Backend"
    APP_VERSION = "1.0.0"

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

settings = Settings()