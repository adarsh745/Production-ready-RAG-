from typing import List, Optional
from langchain_core.documents import Document
from langchain_chroma import Chroma
from app.rag.embeddings import get_embedding_model
from app.bm25.bm25_index import bm25_manager


def refresh_bm25_index(persist_directory: str = "./db/chroma_db"):
    """
    Refresh the BM25 index by reading all current documents from ChromaDB.
    Called whenever a document is uploaded, deleted, or replaced.
    """
    print("\n🔄 Refreshing BM25 Index from ChromaDB...")
    try:
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=get_embedding_model(),
        )
        data = vectorstore.get()
        contents = data.get("documents", [])
        metadatas = data.get("metadatas", [])

        docs = []
        if contents and metadatas:
            for content, meta in zip(contents, metadatas):
                docs.append(Document(page_content=content, metadata=meta or {}))

        bm25_manager.build_index(docs)
    except Exception as e:
        print(f"⚠️ Warning during BM25 index refresh: {e}")
        bm25_manager.build_index([])


def ensure_bm25_initialized(persist_directory: str = "./db/chroma_db"):
    """
    Ensure BM25 index is built on boot or first search request.
    """
    if not bm25_manager.is_initialized:
        refresh_bm25_index(persist_directory=persist_directory)


def search_bm25(
    query: str,
    top_k: int = 20,
    document_ids: Optional[List[str]] = None,
    persist_directory: str = "./db/chroma_db",
) -> List[Document]:
    """
    Search BM25 keyword index for top_k results matching query,
    applying optional metadata filtering by document_ids.
    """
    ensure_bm25_initialized(persist_directory=persist_directory)
    return bm25_manager.search(
        query=query,
        top_k=top_k,
        document_ids=document_ids,
    )
