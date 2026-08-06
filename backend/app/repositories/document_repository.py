from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.document_model import Document


class DocumentRepository:
    def create(self, db: Session, document: Document):
        db.add(document)
        db.commit()
        db.refresh(document)
        return document

    def update_indexing_status(
        self,
        db: Session,
        document_id,
        pages: int,
        chunks: int,
        is_indexed: bool = True,
        summary: str = None,
        keywords: list = None,
        suggested_questions: list = None,
        status: str = "indexed",
        file_size: int = None,
        ocr_enabled: bool = None
    ):
        document = self.get_by_id(db, document_id)
        if document:
            document.pages = pages
            document.chunks = chunks
            document.is_indexed = is_indexed
            document.status = status
            if summary is not None:
                document.summary = summary
            if keywords is not None:
                document.keywords = keywords
            if suggested_questions is not None:
                document.suggested_questions = suggested_questions
            if file_size is not None:
                document.file_size = file_size
            if ocr_enabled is not None:
                document.ocr_enabled = ocr_enabled
            db.commit()
            db.refresh(document)
        return document

    def update_filename(self, db: Session, document_id, new_filename: str):
        document = self.get_by_id(db, document_id)
        if document:
            document.filename = new_filename
            db.commit()
            db.refresh(document)
        return document

    def get_all(self, db: Session):
        return db.query(Document).order_by(desc(Document.uploaded_at)).all()

    def get_by_id(self, db: Session, document_id):
        return (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

    def delete(self, db: Session, document: Document):
        db.delete(document)
        db.commit()


repository = DocumentRepository()