# Production Dockerfile for FastAPI RAG Backend
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install system dependencies (Tesseract OCR, Poppler for PDF rendering, OpenCV runtime, PostgreSQL client)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libtesseract-dev \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    libmagic1 \
    libpq-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt /app/requirements.txt

# Install Python dependencies in a single layer without pip cache and without bytecode compilation to save disk space
RUN pip install --no-cache-dir --no-compile --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Copy application source code
COPY . /app

# Create persistent directories for uploads and db if not exist
RUN mkdir -p /app/uploads /app/db

# Expose port 8000
EXPOSE 8000

CMD ["sh", "-c", "python -m app.create_tables && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
