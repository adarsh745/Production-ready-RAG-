from sentence_transformers import CrossEncoder

# Load model once
model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


def rerank_documents(question, documents, top_k=5):
    """
    Rerank retrieved documents using a Cross Encoder on doc.page_content.
    """

    if not documents:
        return []

    print("\n🏆 Cross Encoder Reranking...")

    pairs = [(question, doc.page_content) for doc in documents]

    # Predict relevance scores
    scores = model.predict(pairs)

    # Combine docs with scores
    scored_docs = list(zip(documents, scores))

    # Sort by score descending
    scored_docs.sort(
        key=lambda x: x[1],
        reverse=True
    )

    print("\n🏆 Top Ranked Documents\n")

    for rank, (doc, score) in enumerate(scored_docs[:top_k], start=1):
        print(f"{rank}. Score = {score:.4f}")
        preview = doc.page_content[:150].replace("\n", " ")
        print(preview)
        print("-" * 80)

    return [doc for doc, score in scored_docs[:top_k]]