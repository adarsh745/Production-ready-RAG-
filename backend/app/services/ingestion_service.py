import json
from pathlib import Path
from pypdf import PdfReader
from app.rag.parser import parse_document
from app.rag.chunking import create_chunks_by_title
from app.rag.analyzer import separate_content_types
from app.rag.document_builder import build_document
from app.rag.vectorstore import create_vector_store
from app.ocr.detector import is_scanned_pdf
from app.ocr.ocr_engine import process_scanned_pdf


async def process_document(file_path: str, document_id: str):

    print(f"\n🚀 Starting Document Processing for Document ID: {document_id}")

    # Check if PDF is scanned or searchable
    scanned = is_scanned_pdf(file_path)

    documents = []

    if scanned:
        # Scanned / Image-Only PDF Branch: Run Automatic OCR Pipeline
        ocr_pages = process_scanned_pdf(file_path)
        total_pages = len(ocr_pages)
        filename = Path(file_path).name

        print("Chunking...")
        for index, page_item in enumerate(ocr_pages, start=1):
            page_num = page_item["page_number"]
            raw_text = page_item["text"]

            document = build_document(
                document_id=document_id,
                page_content=raw_text,
                raw_text=raw_text,
                tables=[],
                images=[],
                filename=filename,
                page_number=page_num,
                chunk_id=index,
            )
            documents.append(document)

        print("\n▶️ Continuing Existing RAG Pipeline...")
        total_elements = len(ocr_pages)
        total_chunks = len(documents)

    else:
        # Searchable PDF Branch: Use Existing Parser & Chunking Pipeline
        reader = PdfReader(file_path)
        total_pages = len(reader.pages)

        # Step 1 : Parse Document
        elements = parse_document(file_path)
        print(f"✅ Partition Completed - {len(elements)} elements")

        # Step 2 : Chunking
        chunks = create_chunks_by_title(elements)
        print(f"✅ Chunking Completed - {len(chunks)} chunks")

        # Step 3 : Process Every Chunk into Unified Document Representation
        for index, chunk in enumerate(chunks):

            content_data = separate_content_types(chunk)
            raw_text = content_data["text"].strip()
            tables = content_data["tables"]

            # Build clean unified page_content combining text and formatted tables
            content_parts = []
            if raw_text:
                content_parts.append(raw_text)

            if tables:
                formatted_tables = "\n\n".join(tables)
                content_parts.append(f"TABLES:\n{formatted_tables}")

            page_content = "\n\n".join(content_parts)

            # Actual PDF Page Number
            if isinstance(chunk.metadata, dict):
                page_number = chunk.metadata.get("page_number", index + 1)
            else:
                page_number = getattr(chunk.metadata, "page_number", index + 1)

            filename = Path(file_path).name

            document = build_document(
                document_id=document_id,
                page_content=page_content,
                raw_text=raw_text,
                tables=tables,
                images=content_data["images"],
                filename=filename,
                page_number=page_number,
                chunk_id=index + 1,
            )

            documents.append(document)

        total_elements = len(elements)
        total_chunks = len(chunks)

        print("\n▶️ Continuing Existing RAG Pipeline...")

    print(f"\n✅ Successfully Created {len(documents)} LangChain Documents")

    # Store ALL documents into ChromaDB with preserved document_id metadata
    create_vector_store(documents)

    # Refresh BM25 index with newly uploaded documents
    from app.bm25.bm25_retriever import refresh_bm25_index
    refresh_bm25_index()

    print("\n" + "=" * 80)
    print("VERIFY METADATA AFTER STORING INTO CHROMADB:")
    print("=" * 80)
    for i, doc in enumerate(documents, start=1):
        print(f"Chunk {i} Metadata:")
        print(json.dumps(doc.metadata, indent=4))

    print("🎉 Ingestion Pipeline & ChromaDB Completed Successfully")

    return {
        "status": "success",
        "document_id": str(document_id),
        "pages": total_pages,
        "elements": total_elements,
        "chunks": total_chunks,
        "documents": documents,
        "message": "Document successfully stored into ChromaDB",
    }

