import os
from fastapi.middleware.cors import CORSMiddleware

def add_cors(app):
    cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
    origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins if origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )