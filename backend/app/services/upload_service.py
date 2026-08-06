import json
from pathlib import Path
from fastapi import UploadFile

from app.db.database import SessionLocal
from app.services.ingestion_service import process_document
from app.services.document_service import document_service
from app.utils.file_utils import save_uploaded_file
from app.rag.document_analyzer import generate_summary_and_questions


async def upload_document(file: UploadFile):

    # Step 1: Save uploaded PDF file locally
    file_path = await save_uploaded_file(file)
    file_size = Path(file_path).stat().st_size if Path(file_path).exists() else 0
    print("\n🚀 File Saved Successfully")

    # Open database session
    db = SessionLocal()

    try:
        # Step 2: Insert initial metadata into PostgreSQL to generate UUID (is_indexed=False)
        doc_record = document_service.create_document_record(
            db=db,
            filename=file.filename,
            filepath=file_path,
            file_size=file_size,
        )
        document_id = str(doc_record.id)
        print(f"🆔 Document Record Created in PostgreSQL - ID: {document_id}")

        # Step 3: Process PDF, build LangChain documents with document_id, and store vectors in ChromaDB
        result = await process_document(file_path, document_id=document_id)

        # Extract text sample for AI summary and suggested questions
        docs = result.get("documents", [])
        sample_text = " ".join([d.page_content for d in docs[:8]]) if docs else file.filename

        # Generate AI Summary (100-150 words) and 5-8 Suggested Questions
        analysis = generate_summary_and_questions(sample_text, filename=file.filename)
        summary_text = analysis["summary"]
        suggested_qs = analysis["suggested_questions"]
        keywords = analysis["keywords"]

        # Step 4: Update PostgreSQL status (pages, chunks, summary, suggested_questions, is_indexed=True)
        updated_doc = document_service.mark_as_indexed(
            db=db,
            document_id=document_id,
            pages=result["pages"],
            chunks=result["chunks"],
            summary=summary_text,
            keywords=keywords,
            suggested_questions=suggested_qs,
            file_size=file_size,
        )

        print("\n" + "=" * 80)
        print(f"✅ AI Summary & Suggested Questions Saved for Document {document_id}")
        print("=" * 80)

        return {
            "status": "success",
            "document_id": document_id,
            "filename": updated_doc.filename,
            "filepath": updated_doc.filepath,
            "pages": updated_doc.pages,
            "chunks": updated_doc.chunks,
            "is_indexed": updated_doc.is_indexed,
            "summary": summary_text,
            "suggested_questions": suggested_qs,
            "message": "Document successfully indexed into PostgreSQL and ChromaDB",
        }

    finally:
        db.close()