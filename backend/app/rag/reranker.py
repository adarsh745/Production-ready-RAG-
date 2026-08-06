from sentence_transformers import CrossEncoder

# Load model once
model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


def rerank_documents(question: str, documents: list, top_k: int = 8):
    """
    Rerank retrieved documents using a Cross-Encoder on doc.page_content.
    Prints explicit debug logging for chunk scores and re-ranked order.
    """
    if not documents:
        return []

    print("\n" + "=" * 80)
    print("🏆 CROSS-ENCODER RERANKING STARTED")
    print("=" * 80)

    pairs = [(question, doc.page_content) for doc in documents]
    scores = model.predict(pairs)

    scored_docs = list(zip(documents, scores))

    # Sort by relevance score descending
    scored_docs.sort(key=lambda x: x[1], reverse=True)

    print("\n---------------- Cross-Encoder Re-ranked Order & Scores ----------------")
    for rank, (doc, score) in enumerate(scored_docs[:top_k], start=1):
        doc_id = doc.metadata.get("document_id", "N/A")
        chunk_id = doc.metadata.get("chunk_id", "N/A")
        page = doc.metadata.get("page") or doc.metadata.get("page_number", "N/A")
        filename = doc.metadata.get("filename", "N/A")

        print(f"Rank {rank} | Score: {float(score):.4f}")
        print(f"Metadata: Page {page} | Chunk {chunk_id} | DocID {doc_id} | File: {filename}")
        print("Snippet:", doc.page_content[:180].replace("\n", " "))
        print("-" * 80)

    return [doc for doc, score in scored_docs[:top_k]]