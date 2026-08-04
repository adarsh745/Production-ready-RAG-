from sqlalchemy.orm import Session

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
        is_indexed: bool = True
    ):
        document = self.get_by_id(db, document_id)
        if document:
            document.pages = pages
            document.chunks = chunks
            document.is_indexed = is_indexed
            db.commit()
            db.refresh(document)
        return document

    def get_all(self, db: Session):

        return db.query(Document).all()

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