import uuid
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    filename = Column(
        String,
        nullable=False
    )

    filepath = Column(
        String,
        nullable=False
    )

    pages = Column(
        Integer,
        default=0,
        nullable=False
    )

    chunks = Column(
        Integer,
        default=0,
        nullable=False
    )

    file_size = Column(
        BigInteger,
        default=0,
        nullable=False
    )

    is_indexed = Column(
        Boolean,
        default=False,
        nullable=False
    )

    ocr_enabled = Column(
        Boolean,
        default=False,
        nullable=False
    )

    status = Column(
        String,
        default="indexed",
        nullable=False
    )

    summary = Column(
        Text,
        nullable=True
    )

    keywords = Column(
        JSON,
        nullable=True,
        default=list
    )

    suggested_questions = Column(
        JSON,
        nullable=True,
        default=list
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )