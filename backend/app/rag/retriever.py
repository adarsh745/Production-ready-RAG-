import os
from typing import List, Optional
from langchain_chroma import Chroma
from app.rag.embeddings import get_embedding_model
from app.core.config import settings


def retrieve_documents(
    query: str,
    persist_directory: Optional[str] = None,
    document_ids: Optional[List[str]] = None,
):
    if persist_directory is None:
        persist_directory = os.getenv("CHROMA_PERSIST_DIR", settings.CHROMA_PERSIST_DIR)

    print("\n Searching ChromaDB using Similarity Search...\n")

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=get_embedding_model()
    )

    search_kwargs = {
        "k": 10
    }

    if document_ids:
        valid_ids = list(dict.fromkeys([str(d).strip() for d in document_ids if d and str(d).strip()]))
        if valid_ids:
            if len(valid_ids) == 1:
                search_kwargs["filter"] = {"document_id": valid_ids[0]}
                print(f" Metadata Filter Applied for Single Document: {valid_ids[0]}")
            else:
                search_kwargs["filter"] = {"document_id": {"$in": valid_ids}}
                print(f" Metadata Filter Applied for {len(valid_ids)} Documents: {valid_ids}")

    results = vectorstore.similarity_search_with_score(
        query=query,
        **search_kwargs
    )

    print(f"\n✅ Retrieved {len(results)} documents\n")

    documents = []

    for i, (doc, score) in enumerate(results, start=1):

        print("=" * 100)
        print(f"Rank {i}")
        print(f"Similarity Score : {score}")
        print(f"Doc ID: {doc.metadata.get('document_id')} | File: {doc.metadata.get('filename')}")
        print("-" * 100)
        print(doc.page_content[:700])
        print("=" * 100)

        documents.append(doc)

    return documents