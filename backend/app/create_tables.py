from sqlalchemy import text
from app.db.database import Base, engine

# Import every model here
from app.models.document_model import Document

print("Creating tables...")

Base.metadata.create_all(bind=engine)

# Add missing columns if table already existed prior to model updates
with engine.connect() as conn:
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_indexed BOOLEAN DEFAULT FALSE;"))
    conn.commit()

print("Done - Database schema synchronized!")
