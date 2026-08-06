from sqlalchemy import text
from app.db.database import Base, engine

# Import all models to register metadata
from app.models.document_model import Document
from app.models.user_model import User
from app.models.chat_model import ChatSession, ChatMessage

print("Creating PostgreSQL database tables...")

Base.metadata.create_all(bind=engine)

# Add missing columns if table already existed prior to model updates
with engine.connect() as conn:
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_indexed BOOLEAN DEFAULT FALSE;"))
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;"))
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_enabled BOOLEAN DEFAULT FALSE;"))
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'indexed';"))
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS summary TEXT;"))
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS keywords JSON DEFAULT '[]';"))
    conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS suggested_questions JSON DEFAULT '[]';"))
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR;"))
    conn.commit()

print("Done - Database schema synchronized!")