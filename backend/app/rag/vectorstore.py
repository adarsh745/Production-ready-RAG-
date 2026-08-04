from langchain_chroma import Chroma

from app.rag.embeddings import get_embedding_model


def create_vector_store(
    documents,
    persist_directory="./db/chroma_db"
):
    """
    Add documents into existing ChromaDB.

    If database doesn't exist,
    create it.

    If it exists,
    append new documents.
    """

    print("🔮 Creating embeddings...")

    embedding_model = get_embedding_model()

    print("📦 Connecting to ChromaDB...")

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_model,
        collection_metadata={
            "hnsw:space": "cosine"
        }
    )

    print("📥 Adding documents...")

    vectorstore.add_documents(documents)

    print(f"✅ Added {len(documents)} documents")

    print(f"📁 Database Location : {persist_directory}")

    return vectorstore



def delete_vectors(
    document_id,
    persist_directory="./db/chroma_db"
):
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

    print("✅ ChromaDB vector deletion command executed.")

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
        print("✅ Verification Successful: ZERO vectors exist for this document_id in ChromaDB.")
    else:
        print(f"⚠️ Warning: {remaining_count} vectors still remain in ChromaDB for document_id: {doc_id_str}")

    return remaining_count