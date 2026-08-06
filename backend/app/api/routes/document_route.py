import os
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.services.document_service import document_service

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


class RenameDocumentRequest(BaseModel):
    filename: str


@router.get("/")
def get_documents(db: Session = Depends(get_db)):
    """Fetch all documents along with aggregate statistics."""
    return document_service.get_documents_with_stats(db)


@router.get("/profile-stats")
def get_profile_stats_endpoint(db: Session = Depends(get_db)):
    """Fetch real-time workspace performance metrics directly from PostgreSQL."""
    return document_service.get_profile_stats(db)


@router.get("/{document_id}")
def get_document(document_id: str, db: Session = Depends(get_db)):
    """Fetch detailed metadata for a specific document."""
    doc = document_service.get_document(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.get("/{document_id}/file")
@router.get("/view/{document_id}")
def view_document_file_inline(document_id: str, db: Session = Depends(get_db)):
    """Stream PDF binary file inline for frontend PDF viewer (Content-Disposition: inline)."""
    doc = document_service.get_document(db, document_id)
    if not doc or not doc.get("filepath") or not os.path.exists(doc["filepath"]):
        raise HTTPException(status_code=404, detail="PDF file not found on server disk")
    
    return FileResponse(
        path=doc["filepath"],
        media_type="application/pdf",
        content_disposition_type="inline",
        headers={
            "Content-Type": "application/pdf",
            "Content-Disposition": f'inline; filename="{doc["filename"]}"'
        }
    )


@router.get("/download/{document_id}")
def download_document_file(document_id: str, db: Session = Depends(get_db)):
    """Download PDF binary file (Content-Disposition: attachment)."""
    doc = document_service.get_document(db, document_id)
    if not doc or not doc.get("filepath") or not os.path.exists(doc["filepath"]):
        raise HTTPException(status_code=404, detail="PDF file not found on server disk")
    
    return FileResponse(
        path=doc["filepath"],
        media_type="application/pdf",
        filename=doc["filename"],
        content_disposition_type="attachment"
    )


@router.put("/{document_id}")
def rename_document(
    document_id: str,
    payload: RenameDocumentRequest,
    db: Session = Depends(get_db)
):
    """Rename a document's filename."""
    updated = document_service.rename_document(db, document_id, payload.filename)
    if not updated:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document renamed successfully", "filename": updated.filename}


@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
):
    """Atomically delete document from PostgreSQL, ChromaDB, and disk storage."""
    deleted = document_service.delete_document(db, document_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}