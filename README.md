# 🚀 Production-Ready Hybrid RAG System

A state-of-the-art **Retrieval-Augmented Generation (RAG)** application built with **FastAPI**, **PostgreSQL**, **ChromaDB**, **BM25**, **LangChain**, and **OpenAI**. 

Includes **Table-Aware OCR**, **Hybrid Search (Dense Vector + Sparse BM25)**, **Reciprocal Rank Fusion (RRF)**, **Cross-Encoder Reranking**, **Metadata Filtering**, **SSE Token Streaming**, and **RAGAS Evaluation**.

---

## 🏗️ Architectural Flow

```
[ PDF Upload ] ──> [ PostgreSQL Metadata & UUID ]
      │
      ├──> [ Automatic OCR Detector (Searchable vs. Scanned) ]
      │         │
      │         ├──> Searchable PDF ──> Unstructured / PyPDF Parser
      │         └──> Scanned PDF    ──> pypdfium2 Image Rendering ──> PyTesseract OCR ──> Table-Aware Markdown Engine
      │
      └──> [ Unified LangChain Chunks ] ──> [ ChromaDB Vector Store ] + [ In-Memory BM25 Index ]

─────────────────────────────────────────────────────────────────────────────────────────────

[ User Question ] ──> [ Standalone Question Rewriter ] ──> [ Multi-Query Expansion ]
                                                                    │
┌───────────────────────────────────────────────────────────────────┘
│ For Each Query Variation:
├── 1. Dense Vector Search (ChromaDB)
├── 2. Sparse Keyword Search (BM25)
└── 3. Candidate Merging & Deduplication by (document_id, chunk_id)
                                                                    │
┌───────────────────────────────────────────────────────────────────┘
↓
[ Reciprocal Rank Fusion (RRF k=60) ] ──> [ Cross-Encoder Reranking (MiniLM) ]
                                                       │
                                                       ├──> [ POST /chat ] ──> Full JSON Response
                                                       ├──> [ POST /chat/stream ] ──> SSE Progressive Token Streaming
                                                       └──> [ POST /evaluation ] ──> RAGAS Metrics Report
```

---

## ✨ Key Features

- **📄 Document Upload & Ingestion:** PostgreSQL document tracking with cascading deletion (DB row + local PDF file + ChromaDB vectors + BM25 index refresh).
- **⚡ Automatic OCR & Table Extraction:** Automatically detects scanned / image-only PDFs, renders pages into high-DPI images, runs OCR, and reconstructs table layouts into structured Markdown tables (`| Subject | Grade | Credits | Result |`).
- **🔀 Hybrid Search Engine:** Combines **Dense Vector Search (ChromaDB)** with **Sparse Keyword Search (BM25)** for optimal semantic and exact-keyword recall.
- **🧠 Multi-Query Expansion & RRF:** Generates 3 domain-specific search query variations and merges candidate chunks using **Reciprocal Rank Fusion** ($k = 60$).
- **🏆 Cross-Encoder Reranking:** Re-scores merged candidate chunks using `cross-encoder/ms-marco-MiniLM-L-6-v2` for precise context ordering.
- **🎯 Metadata Filtering:** Filter search retrieval across **ALL documents**, a **SINGLE document**, or a **SELECTED SUBSET** of documents via `document_ids`.
- **⚡ Server-Sent Events (SSE) Streaming:** Progressive token streaming (`POST /chat/stream`) with final source citations payload.
- **📊 RAGAS Evaluation Module:** Evaluates system accuracy across 4 standard RAGAS metrics:
  - **Faithfulness:** Measures if claims in the answer are grounded in retrieved context.
  - **Answer Relevancy:** Measures how directly the answer addresses the question.
  - **Context Precision:** Measures if top retrieved chunks contain relevant information.
  - **Context Recall:** Measures if all necessary facts were retrieved.
- **💬 Conversation Memory:** Tracks chat history and rewrites follow-up questions into standalone queries.

---

## 🛠️ Tech Stack

- **Backend Framework:** FastAPI
- **Relational Database:** PostgreSQL (SQLAlchemy ORM)
- **Vector Database:** ChromaDB (`hnsw:space: cosine`)
- **Sparse Keyword Search:** `rank_bm25` (BM25Okapi)
- **Reranker:** SentenceTransformers (`ms-marco-MiniLM-L-6-v2`)
- **LLM & Embeddings:** OpenAI GPT-4o & `text-embedding-3-small` / OpenAI Embeddings
- **PDF & Image Processing:** `pypdf`, `pypdfium2`, `pytesseract`, `Pillow`
- **Evaluation:** RAGAS metrics using structured LLM validation

---

## 📁 Repository Structure

```
RagUi/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/         # API Route Handlers (upload, chat, documents, evaluation)
│   │   ├── bm25/               # BM25 Index Manager & Keyword Retriever
│   │   ├── evaluation/         # RAGAS Metrics, Dataset Builder & Evaluator Engine
│   │   ├── ocr/                # OCR Detector, Page Renderer, OCR Engine & Table Extractor
│   │   ├── rag/                # Hybrid Retriever, Reranker, Parser, Prompts & Memory
│   │   ├── repositories/       # SQLAlchemy Repositories
│   │   ├── schemas/            # Pydantic Schemas for Requests and Responses
│   │   ├── services/           # Application Service Layer
│   │   └── main.py             # FastAPI App Entrypoint
│   ├── db/                     # Local ChromaDB Persistence Directory
│   ├── uploads/                # Uploaded PDF Storage
│   └── requirements.txt        # Python Dependencies
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Python 3.10+ / 3.11+ / 3.14
- PostgreSQL installed and running
- Tesseract OCR (optional, for local scanned PDF OCR fallback)

### 2. Environment Setup

Clone the repository and create a virtual environment:

```bash
cd backend
python -m venv mvenv

# Activate Virtual Environment
# Windows PowerShell:
.\mvenv\Scripts\Activate.ps1
# Linux/macOS:
source mvenv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Variables (`.env`)

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rag_db
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Database Migration / Tables Initialization

Ensure your PostgreSQL server is running and create database `rag_db`:

```sql
CREATE DATABASE rag_db;
```

### 5. Running the Application

Start the FastAPI backend with Uvicorn:

```bash
uvicorn app.main:app --reload
```

Server will start at: `http://127.0.0.1:8000`  
Interactive API Docs (Swagger UI): `http://127.0.0.1:8000/docs`

---

## 📡 API Reference

### 📤 Document Management & Ingestion

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload/` | Upload & index PDF (Auto-detects OCR, stores to Postgres + ChromaDB + BM25) |
| `GET` | `/documents/` | List all indexed documents |
| `DELETE` | `/documents/{id}` | Delete document by UUID (Removes Postgres row, local PDF, ChromaDB vectors & refreshes BM25) |

### 💬 Chat & Retrieval

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/chat/` | Standard RAG chat response with source citations |
| `POST` | `/chat/stream` | Server-Sent Events (SSE) progressive token streaming with final source metadata |
| `POST` | `/chat/clear-memory` | Clear conversation memory history |

#### Example Chat Request Body (`POST /chat/stream`):
```json
{
  "question": "What is AWS Cloud?",
  "document_ids": [
    "c29bbaa5-0e86-43de-b5a0-9334f7e4b847"
  ]
}
```

### 📊 RAGAS Evaluation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/evaluation/` | Evaluates question against RAG pipeline returning Faithfulness, Answer Relevancy, Context Precision, and Context Recall scores |

#### Example Evaluation Response (`POST /evaluation/`):
```json
{
  "answer": "AWS Cloud is a secure cloud platform offering compute, storage, and database services...",
  "sources": [
    {
      "document_id": "c29bbaa5-0e86-43de-b5a0-9334f7e4b847",
      "filename": "AWS.pdf",
      "page": 1,
      "chunk_id": 1
    }
  ],
  "evaluation": {
    "faithfulness": 1.0,
    "answer_relevancy": 1.0,
    "context_precision": 0.9,
    "context_recall": 1.0,
    "average_score": 0.975
  }
}
```

---

## 🧪 Testing

### Test Streaming from Terminal

```bash
curl -N -X POST "http://127.0.0.1:8000/chat/stream" \
     -H "Content-Type: application/json" \
     -d '{"question": "Explain AWS services"}'
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
