import os
from langchain_chroma import Chroma
from app.core.config import settings

from app.rag.embeddings import get_embedding_model


def create_vector_store(
    documents,
    persist_directory=None
):
    if persist_directory is None:
        persist_directory = os.getenv("CHROMA_PERSIST_DIR", settings.CHROMA_PERSIST_DIR)
    """
    Add documents into existing ChromaDB.

    If database doesn't exist,
    create it.

    If it exists,
    append new documents.
    """

    print("[Embeddings] Creating embeddings...")

    embedding_model = get_embedding_model()

    print("[ChromaDB] Connecting to ChromaDB...")

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_model,
        collection_metadata={
            "hnsw:space": "cosine"
        }
    )

    print("[ChromaDB] Adding documents...")

    try:
        vectorstore.add_documents(documents)
    except Exception as e:
        if "dimension" in str(e).lower() or "expecting embedding" in str(e).lower():
            print("[ChromaDB] Dimension mismatch detected. Re-initializing collection for new embedding model...")
            import shutil
            shutil.rmtree(persist_directory, ignore_errors=True)
            os.makedirs(persist_directory, exist_ok=True)
            vectorstore = Chroma(
                persist_directory=persist_directory,
                embedding_function=embedding_model,
                collection_metadata={
                    "hnsw:space": "cosine"
                }
            )
            vectorstore.add_documents(documents)
        else:
            raise e

    print(f"[ChromaDB] Added {len(documents)} documents")

    print(f"[ChromaDB] Database Location : {persist_directory}")

    return vectorstore



def delete_vectors(
    document_id,
    persist_directory=None
):
    if persist_directory is None:
        persist_directory = os.getenv("CHROMA_PERSIST_DIR", settings.CHROMA_PERSIST_DIR)
    """
    Delete all vectors belonging to one uploaded document from ChromaDB using document_id.
    """
    doc_id_str = str(document_id)

    print("\n" + "=" * 80)
    print(f"DEBUG: Before delete: Deleting vectors from ChromaDB for document_id: {doc_id_str}")
    print("=" * 80)

    embedding_model = get_embedding_model()

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_model,
    )

    # Perform metadata-filtered deletion
    vectorstore.delete(
        where={
            "document_id": doc_id_str
        }
    )

    print("[ChromaDB] Vector deletion command executed.")

    # Refresh BM25 index after vector deletion
    from app.bm25.bm25_retriever import refresh_bm25_index
    refresh_bm25_index()

    # Verification: Query ChromaDB to verify zero vectors exist for that document_id
    remaining = vectorstore.get(where={"document_id": doc_id_str})
    remaining_ids = remaining.get("ids", []) if remaining else []
    remaining_count = len(remaining_ids)

    print("\n" + "=" * 80)
    print(f"DEBUG: After delete: Verification check for document_id '{doc_id_str}'")
    print(f"Found {remaining_count} remaining vectors in ChromaDB.")
    print("=" * 80)

    if remaining_count == 0:
        print("[ChromaDB] Verification Successful: ZERO vectors exist for this document_id in ChromaDB.")
    else:
        print(f"[ChromaDB] Warning: {remaining_count} vectors still remain in ChromaDB for document_id: {doc_id_str}")

    return remaining_count