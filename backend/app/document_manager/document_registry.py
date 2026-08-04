from sqlalchemy import (
    create_engine,
    Column,
    String,
    Integer,
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid
from datetime import datetime

DATABASE_URL = "sqlite:///db/documents.db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


class DocumentMetadata(Base):

    __tablename__ = "documents"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    filename = Column(String, nullable=False)

    filepath = Column(String, nullable=False)

    pages = Column(Integer, nullable=False)

    chunks = Column(Integer, nullable=False)

    uploaded_at = Column(
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )


Base.metadata.create_all(bind=engine)


def add_document(filename, filepath, pages, chunks):

    db = SessionLocal()

    document = DocumentMetadata(
        filename=filename,
        filepath=filepath,
        pages=pages,
        chunks=chunks,
    )

    db.add(document)
    db.commit()
    db.refresh(document)
    db.close()

    return document


def get_all_documents():

    db = SessionLocal()

    documents = db.query(DocumentMetadata).all()

    db.close()

    return documents


def get_document(document_id):

    db = SessionLocal()

    document = (
        db.query(DocumentMetadata)
        .filter(DocumentMetadata.id == document_id)
        .first()
    )

    db.close()

    return document


def delete_document(document_id):

    db = SessionLocal()

    document = (
        db.query(DocumentMetadata)
        .filter(DocumentMetadata.id == document_id)
        .first()
    )

    if document:

        db.delete(document)
        db.commit()

    db.close()

    return document