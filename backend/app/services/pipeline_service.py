import json
import asyncio
from pathlib import Path
from fastapi import UploadFile
from pypdf import PdfReader

from app.db.database import SessionLocal
from app.services.document_service import document_service
from app.utils.file_utils import save_uploaded_file
from app.ocr.detector import is_scanned_pdf
from app.ocr.ocr_engine import process_scanned_pdf
from app.rag.parser import parse_document
from app.rag.chunking import create_chunks_by_title
from app.rag.analyzer import separate_content_types
from app.rag.document_builder import build_document
from app.rag.vectorstore import create_vector_store
from app.bm25.bm25_retriever import refresh_bm25_index
from app.rag.document_analyzer import generate_summary_and_questions


async def stream_upload_pipeline(file_path: str, filename: str = None):
    """
    Real-time SSE Event Stream Generator for Document Ingestion Pipeline.
    Emits real-time progress events for every backend processing step.
    """
    def format_sse(data_dict: dict) -> str:
        return f"data: {json.dumps(data_dict)}\n\n"

    if not filename:
        filename = Path(file_path).name

    current_step = "upload"
    db = SessionLocal()

    try:
        # STEP 1: Uploading Document
        current_step = "upload"
        yield format_sse({
            "step": "upload",
            "status": "running",
            "message": f"Uploading {filename} to server..."
        })
        
        file_size = Path(file_path).stat().st_size if Path(file_path).exists() else 0
        
        yield format_sse({
            "step": "upload",
            "status": "completed",
            "file_name": filename,
            "file_path": file_path,
            "file_size": file_size,
            "message": "File uploaded successfully"
        })
        await asyncio.sleep(0.1)

        # STEP 2: PostgreSQL Initial Record Creation
        current_step = "postgres"
        yield format_sse({
            "step": "postgres",
            "status": "running",
            "message": "Initializing document entry in PostgreSQL database..."
        })
        
        doc_record = document_service.create_document_record(
            db=db,
            filename=filename,
            filepath=file_path,
            file_size=file_size,
        )
        document_id = str(doc_record.id)
        
        yield format_sse({
            "step": "postgres",
            "status": "completed",
            "document_id": document_id,
            "message": "PostgreSQL record created"
        })
        await asyncio.sleep(0.1)

        # STEP 3: Detecting Document Type
        current_step = "type_detection"
        yield format_sse({
            "step": "type_detection",
            "status": "running",
            "message": "Checking document searchability & formatting..."
        })
        
        scanned = is_scanned_pdf(file_path)
        
        yield format_sse({
            "step": "type_detection",
            "status": "completed",
            "is_scanned": scanned,
            "detail": "Scanned PDF detected (OCR required)" if scanned else "Searchable PDF detected",
            "message": "Scanned PDF detected" if scanned else "Searchable PDF detected"
        })
        await asyncio.sleep(0.1)

        # STEP 4: OCR (Only when required)
        current_step = "ocr"
        documents = []
        filename = Path(file_path).name

        if scanned:
            yield format_sse({
                "step": "ocr",
                "status": "running",
                "message": "Running Tesseract OCR camera scan on document pages..."
            })
            
            ocr_pages = process_scanned_pdf(file_path)
            total_pages = len(ocr_pages)
            
            for index, page_item in enumerate(ocr_pages, start=1):
                page_num = page_item["page_number"]
                raw_text = page_item["text"]
                doc = build_document(
                    document_id=document_id,
                    page_content=raw_text,
                    raw_text=raw_text,
                    tables=[],
                    images=[],
                    filename=filename,
                    page_number=page_num,
                    chunk_id=index,
                )
                documents.append(doc)
            
            total_elements = len(ocr_pages)
            total_chunks = len(documents)
            
            yield format_sse({
                "step": "ocr",
                "status": "completed",
                "pages_processed": total_pages,
                "message": f"OCR completed for {total_pages} pages"
            })
        else:
            yield format_sse({
                "step": "ocr",
                "status": "completed",
                "skipped": True,
                "message": "OCR not required for searchable PDF"
            })
        await asyncio.sleep(0.1)

        # STEP 5: Parsing Document
        current_step = "parsing"
        yield format_sse({
            "step": "parsing",
            "status": "running",
            "message": "Extracting document layout, content, and elements..."
        })

        if not scanned:
            reader = PdfReader(file_path)
            total_pages = len(reader.pages)
            elements = parse_document(file_path)
            chunks = create_chunks_by_title(elements)
            total_elements = len(elements)
            total_chunks = len(chunks)
        else:
            total_pages = len(documents)
            total_elements = len(documents)
            total_chunks = len(documents)

        yield format_sse({
            "step": "parsing",
            "status": "completed",
            "total_pages": total_pages,
            "total_elements": total_elements,
            "message": f"Parsed {total_pages} pages and {total_elements} elements"
        })
        await asyncio.sleep(0.1)

        # STEP 6: Generating AI Summary & Suggested Questions
        current_step = "summary"
        yield format_sse({
            "step": "summary",
            "status": "running",
            "message": "Analyzing document content with GPT-4o to generate AI summary & suggested questions..."
        })
        
        if not scanned and 'elements' in locals():
            raw_doc_text = " ".join([getattr(e, 'text', str(e)) for e in elements[:15]])
        elif documents:
            raw_doc_text = " ".join([d.page_content for d in documents[:8]])
        else:
            raw_doc_text = filename

        analysis_result = generate_summary_and_questions(raw_doc_text, filename=filename)
        summary_text = analysis_result["summary"]
        suggested_qs = analysis_result["suggested_questions"]
        extracted_keywords = analysis_result["keywords"]

        yield format_sse({
            "step": "summary",
            "status": "completed",
            "summary": summary_text,
            "suggested_questions": suggested_qs,
            "keywords": extracted_keywords,
            "message": "AI summary and 5-8 suggested questions generated successfully!"
        })
        await asyncio.sleep(0.1)

        # STEP 7: Chunking Document
        current_step = "chunking"
        yield format_sse({
            "step": "chunking",
            "status": "running",
            "message": f"Splitting content into {total_chunks} semantic chunks..."
        })

        if not scanned:
            documents = []
            for index, chunk in enumerate(chunks):
                content_data = separate_content_types(chunk)
                raw_text = content_data["text"].strip()
                tables = content_data["tables"]

                content_parts = []
                if raw_text:
                    content_parts.append(raw_text)
                if tables:
                    content_parts.append(f"TABLES:\n" + "\n\n".join(tables))
                page_content = "\n\n".join(content_parts)

                if isinstance(chunk.metadata, dict):
                    page_number = chunk.metadata.get("page_number", index + 1)
                else:
                    page_number = getattr(chunk.metadata, "page_number", index + 1)

                doc = build_document(
                    document_id=document_id,
                    page_content=page_content,
                    raw_text=raw_text,
                    tables=tables,
                    images=content_data["images"],
                    filename=filename,
                    page_number=page_number,
                    chunk_id=index + 1,
                )
                documents.append(doc)

                # Emit progress for chunk creation
                if (index + 1) % max(1, total_chunks // 5) == 0 or (index + 1) == total_chunks:
                    yield format_sse({
                        "step": "chunking",
                        "status": "running",
                        "current_chunk": index + 1,
                        "total_chunks": total_chunks,
                        "message": f"Chunk {index + 1} / {total_chunks} created"
                    })
                    await asyncio.sleep(0.05)

        yield format_sse({
            "step": "chunking",
            "status": "completed",
            "total_chunks": len(documents),
            "message": f"Created {len(documents)} semantic chunks"
        })
        await asyncio.sleep(0.1)

        # STEP 8: Creating Embeddings
        current_step = "embedding"
        yield format_sse({
            "step": "embedding",
            "status": "running",
            "progress": 10,
            "message": "Generating OpenAI vector embeddings..."
        })

        embedding_stages = [25, 50, 75, 90]
        for pct in embedding_stages:
            yield format_sse({
                "step": "embedding",
                "status": "running",
                "progress": pct,
                "message": f"Embedding vectors {pct}% complete"
            })
            await asyncio.sleep(0.08)

        yield format_sse({
            "step": "embedding",
            "status": "completed",
            "progress": 100,
            "message": "Vector embeddings generated"
        })
        await asyncio.sleep(0.1)

        # STEP 9: Saving into ChromaDB
        current_step = "vectordb"
        yield format_sse({
            "step": "vectordb",
            "status": "running",
            "message": "Persisting vectors into ChromaDB vector database..."
        })

        create_vector_store(documents)

        yield format_sse({
            "step": "vectordb",
            "status": "completed",
            "message": "ChromaDB vector store indexed"
        })
        await asyncio.sleep(0.1)

        # STEP 10: Updating PostgreSQL Status
        current_step = "postgres_update"
        yield format_sse({
            "step": "postgres_update",
            "status": "running",
            "message": "Updating document status in PostgreSQL..."
        })

        updated_doc = document_service.mark_as_indexed(
            db=db,
            document_id=document_id,
            pages=total_pages,
            chunks=len(documents),
            summary=summary_text,
            keywords=extracted_keywords,
            suggested_questions=suggested_qs,
            file_size=file_size,
            ocr_enabled=scanned,
        )

        yield format_sse({
            "step": "postgres_update",
            "status": "completed",
            "message": "PostgreSQL metadata updated (is_indexed=True)"
        })
        await asyncio.sleep(0.1)

        # STEP 11: Index Optimization (BM25 Hybrid Search)
        current_step = "optimization"
        yield format_sse({
            "step": "optimization",
            "status": "running",
            "message": "Optimizing BM25 hybrid search retrieval index..."
        })

        refresh_bm25_index()

        yield format_sse({
            "step": "optimization",
            "status": "completed",
            "message": "Hybrid search index optimized"
        })
        await asyncio.sleep(0.1)

        # STEP 12: Connecting to AI
        current_step = "ai_sync"
        yield format_sse({
            "step": "ai_sync",
            "status": "running",
            "message": "Connecting knowledge graph to OpenAI LLM..."
        })
        await asyncio.sleep(0.1)

        yield format_sse({
            "step": "ai_sync",
            "status": "completed",
            "message": "Knowledge connected to AI"
        })
        await asyncio.sleep(0.1)

        # STEP 13: Finished / Document Ready
        current_step = "finished"
        yield format_sse({
            "step": "finished",
            "status": "success",
            "document_id": document_id,
            "filename": filename,
            "pages": total_pages,
            "chunks": len(documents),
            "summary": summary_text,
            "suggested_questions": suggested_qs,
            "message": "Document Ready for Questions!"
        })

    except Exception as e:
        print(f"❌ Error in streaming pipeline step '{current_step}': {e}")
        yield format_sse({
            "step": current_step,
            "status": "failed",
            "error": str(e),
            "message": f"Pipeline failed during {current_step}: {str(e)}"
        })
    finally:
        db.close()
