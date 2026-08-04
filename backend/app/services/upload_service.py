import json
from fastapi import UploadFile

from app.db.database import SessionLocal
from app.services.ingestion_service import process_document
from app.services.document_service import document_service
from app.utils.file_utils import save_uploaded_file


async def upload_document(file: UploadFile):

    # Step 1: Save uploaded PDF file locally
    file_path = await save_uploaded_file(file)
    print("\n🚀 File Saved Successfully")

    # Open database session
    db = SessionLocal()

    try:
        # Step 2: Insert initial metadata into PostgreSQL to generate UUID (is_indexed=False)
        doc_record = document_service.create_document_record(
            db=db,
            filename=file.filename,
            filepath=file_path,
        )
        document_id = str(doc_record.id)
        print(f"🆔 Document Record Created in PostgreSQL - ID: {document_id}")

        # Step 3: Process PDF, build LangChain documents with document_id, and store vectors in ChromaDB
        result = await process_document(file_path, document_id=document_id)

        # Step 4: Update PostgreSQL status (pages, chunks, is_indexed=True)
        updated_doc = document_service.mark_as_indexed(
            db=db,
            document_id=document_id,
            pages=result["pages"],
            chunks=result["chunks"],
        )

        # Debugging: Print every metadata before returning
        print("\n" + "=" * 80)
        print("DEBUG: Final Upload Metadata Before Returning Response:")
        print("=" * 80)
        for i, doc in enumerate(result.get("documents", []), start=1):
            print(f"Chunk {i} Metadata:")
            print(json.dumps(doc.metadata, indent=4))

        return {
            "status": "success",
            "document_id": document_id,
            "filename": updated_doc.filename,
            "filepath": updated_doc.filepath,
            "pages": updated_doc.pages,
            "chunks": updated_doc.chunks,
            "is_indexed": updated_doc.is_indexed,
            "message": "Document successfully indexed into PostgreSQL and ChromaDB",
        }

    finally:
        db.close()