from sqlalchemy.orm import Session

from app.models.document_model import Document
from app.repositories.document_repository import DocumentRepository
import os
from app.rag.vectorstore import delete_vectors
repository = DocumentRepository()


class DocumentService:

    def create_document_record(
        self,
        db: Session,
        filename: str,
        filepath: str,
    ):
        """Create an initial document record in PostgreSQL with is_indexed=False."""
        document = Document(
            filename=filename,
            filepath=filepath,
            pages=0,
            chunks=0,
            is_indexed=False,
        )
        return repository.create(db, document)

    def mark_as_indexed(
        self,
        db: Session,
        document_id,
        pages: int,
        chunks: int,
    ):
        """Update pages and chunks counts and set is_indexed=True."""
        return repository.update_indexing_status(
            db=db,
            document_id=document_id,
            pages=pages,
            chunks=chunks,
            is_indexed=True,
        )

    def register_document(
        self,
        db: Session,
        filename: str,
        filepath: str,
        pages: int,
        chunks: int,
    ):
        document = Document(
            filename=filename,
            filepath=filepath,
            pages=pages,
            chunks=chunks,
            is_indexed=True,
        )
        return repository.create(db, document)

    def get_documents(self, db: Session):
        return repository.get_all(db)

    def get_document(self, db: Session, document_id):
        return repository.get_by_id(db, document_id)

    def delete_document(self, db: Session, document_id: str):

        document = repository.get_by_id(db, document_id)

        if document is None:
            print(f"❌ Delete Failed: Document ID {document_id} not found in PostgreSQL.")
            return None

        doc_id_str = str(document.id)

        print("\n" + "=" * 80)
        print(f"DEBUG: Before delete: Target document_id for deletion: {doc_id_str}")
        print("=" * 80)

        # Step 1: Delete vectors from ChromaDB first
        delete_vectors(doc_id_str)

        # Step 2: Delete uploaded PDF from disk
        if document.filepath and os.path.exists(document.filepath):
            os.remove(document.filepath)
            print(f"✅ PDF File Deleted: {document.filepath}")

        # Step 3: Delete PostgreSQL row
        repository.delete(db, document)
        print("✅ PostgreSQL Metadata Row Deleted")

        return True


document_service = DocumentService()

