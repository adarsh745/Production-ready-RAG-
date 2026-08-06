from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from app.services.upload_service import upload_document
from app.services.pipeline_service import stream_upload_pipeline

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/")
async def upload(file: UploadFile = File(...)):
    """Standard synchronous upload endpoint"""
    return await upload_document(file)


@router.post("/stream")
@router.post("/pipeline")
async def upload_stream(file: UploadFile = File(...)):
    """
    Real-time SSE Streaming Document Ingestion Pipeline endpoint.
    Emits live events for every step of processing.
    """
    return StreamingResponse(
        stream_upload_pipeline(file),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )