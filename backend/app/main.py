from dotenv import load_dotenv
import os

# Load .env FIRST
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.middleware.cors import add_cors
from app.api.routes.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

add_cors(app)

# Directory for uploads
uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir, exist_ok=True)

# Explicit inline route for PDF viewer rendering
@app.get("/uploads/{filename}")
def serve_upload_inline(filename: str):
    file_path = os.path.join(uploads_dir, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        content_disposition_type="inline",
        headers={
            "Content-Type": "application/pdf",
            "Content-Disposition": f'inline; filename="{filename}"'
        }
    )

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Support both /api/... and root route prefixes
app.include_router(api_router, prefix="/api")
app.include_router(api_router)
