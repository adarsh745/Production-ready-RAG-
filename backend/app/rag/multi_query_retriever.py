# This file manages Hybrid Multi-Query Retrieval:
# 1. Query Expansion / Multi-Query Generation
# 2. Dense Vector Search (ChromaDB) + Sparse Keyword Search (BM25)
# 3. Candidate Merging & Deduplication by (document_id, chunk_id)
# 4. Reciprocal Rank Fusion (RRF)
# 5. Cross Encoder Reranking


from typing import List, Optional
from pydantic import BaseModel
from collections import defaultdict
from app.rag.reranker import rerank_documents
from langchain_chroma import Chroma
from app.rag.embeddings import get_embedding_model
from langchain_openai import ChatOpenAI
from app.bm25.bm25_retriever import search_bm25

# Create one LLM instance
llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0
)


class QueryVariations(BaseModel):
    queries: List[str]


def generate_query_variations(question: str):

    print("\n🧠 Generating Query Variations...")

    structured_llm = llm.with_structured_output(QueryVariations)
    prompt = f"""
You are an expert information retrieval assistant optimizing vector search recall.

Generate 3 semantically different search queries for the user's question.

Rules:
- Include specific domain terms, exact technical keywords, and synonyms (e.g., UPI, Cards, Net Banking, Wallets, EMI, BNPL, Payment Options).
- Focus on extracting factual tables, lists, and direct feature specifications.
- Keep each query under 15 words.
- Do not repeat the exact original wording.
- Focus on improving vector search recall.

User Question:
{question}
"""

    response = structured_llm.invoke(prompt)

    queries = [question] + response.queries

    print("\n" + "=" * 80)
    print("DEBUG: Generated Queries")
    print("=" * 80)

    for i, query in enumerate(queries, start=1):
        print(f"Query {i}: • {query}")

    return queries


def execute_hybrid_search_for_queries(vector_retriever, queries, document_ids=None, persist_directory="./db/chroma_db"):

    all_merged_results = []

    for i, query in enumerate(queries, start=1):

        print("\n" + "=" * 80)
        print(f"SEARCHING FOR QUERY {i}: {query}")
        print("=" * 80)

        # ---------------------------------------
        # 1. Dense Vector Search (ChromaDB)
        # ---------------------------------------
        vector_docs = vector_retriever.invoke(query)

        print("\n---------------- Vector Results ----------------")
        print(f"Retrieved {len(vector_docs)} vector documents:")
        for idx, doc in enumerate(vector_docs, start=1):
            doc_id = doc.metadata.get("document_id")
            chunk_id = doc.metadata.get("chunk_id")
            filename = doc.metadata.get("filename")
            print(f"V{idx}. [Doc: {doc_id} | Chunk: {chunk_id} | File: {filename}] {doc.page_content[:120].replace('\n', ' ')}")

        # ---------------------------------------
        # 2. Sparse Keyword Search (BM25)
        # ---------------------------------------
        bm25_docs = search_bm25(
            query=query,
            top_k=20,
            document_ids=document_ids,
            persist_directory=persist_directory,
        )

        print("\n---------------- BM25 Results ----------------")
        print(f"Retrieved {len(bm25_docs)} BM25 keyword documents:")
        for idx, doc in enumerate(bm25_docs, start=1):
            doc_id = doc.metadata.get("document_id")
            chunk_id = doc.metadata.get("chunk_id")
            filename = doc.metadata.get("filename")
            print(f"B{idx}. [Doc: {doc_id} | Chunk: {chunk_id} | File: {filename}] {doc.page_content[:120].replace('\n', ' ')}")

        # ---------------------------------------
        # 3. Merge Vector + BM25 & Deduplicate by (document_id, chunk_id)
        # ---------------------------------------
        merged_docs = []
        seen_keys = set()

        for doc in vector_docs + bm25_docs:
            d_id = str(doc.metadata.get("document_id") or "").strip()
            c_id = int(doc.metadata.get("chunk_id") or 0)
            key = (d_id, c_id)

            if key not in seen_keys:
                seen_keys.add(key)
                merged_docs.append(doc)

        print("\n---------------- Merged Results ----------------")
        print(f"Merged {len(merged_docs)} unique candidate chunks:")
        for idx, doc in enumerate(merged_docs, start=1):
            doc_id = doc.metadata.get("document_id")
            chunk_id = doc.metadata.get("chunk_id")
            print(f"M{idx}. [Doc: {doc_id} | Chunk: {chunk_id}] {doc.page_content[:120].replace('\n', ' ')}")

        all_merged_results.append(merged_docs)

    return all_merged_results


def reciprocal_rank_fusion(results, k=60, user_query: str = ""):

    print("\n" + "=" * 80)
    print("🏆 Applying Reciprocal Rank Fusion (RRF)...")
    print("=" * 80)

    rrf_scores = defaultdict(float)
    document_map = {}

    # Standard Reciprocal Rank Fusion: Score(d) = sum(1 / (k + rank))
    for docs in results:
        for rank, doc in enumerate(docs, start=1):
            d_id = str(doc.metadata.get("document_id") or "").strip()
            c_id = int(doc.metadata.get("chunk_id") or 0)
            key = (d_id, c_id)

            document_map[key] = doc
            rrf_scores[key] += 1.0 / (k + rank)

    # Sort documents by total score (Highest first)
    ranked_items = sorted(
        rrf_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    print("\n---------------- RRF Ranking ----------------")
    for index, (key, score) in enumerate(ranked_items[:10], start=1):
        doc = document_map[key]
        print(f"{index}. Score = {score:.5f} | Doc: {key[0]} | Chunk: {key[1]}")
        print(doc.page_content[:150].replace("\n", " "))
        print("-" * 80)

    rrf_documents = [document_map[key] for key, score in ranked_items]
    return rrf_documents


def retrieve_documents(
    query: str,
    persist_directory: str = "./db/chroma_db",
    k: int = 5,
    document_ids: Optional[List[str]] = None
):
    """
    Hybrid Retrieval Pipeline combining Dense Vector Search + Sparse BM25 Keyword Search,
    Candidate Merging & Deduplication, Reciprocal Rank Fusion (RRF), and Cross Encoder Reranking.
    """

    print("\n" + "=" * 80)
    print("🚀 HYBRID MULTI-QUERY RETRIEVAL STARTED")
    print("=" * 80)

    search_kwargs = {
        "k": 20
    }

    # Build Metadata Filter if document_ids provided
    if document_ids:
        valid_ids = list(dict.fromkeys([str(d).strip() for d in document_ids if d and str(d).strip()]))
        if valid_ids:
            if len(valid_ids) == 1:
                search_kwargs["filter"] = {"document_id": valid_ids[0]}
                print(f"🎯 Metadata Filter Applied for Single Document: {valid_ids[0]}")
            else:
                search_kwargs["filter"] = {"document_id": {"$in": valid_ids}}
                print(f"🎯 Metadata Filter Applied for {len(valid_ids)} Documents: {valid_ids}")
        else:
            print("🌍 No valid document_ids provided. Searching Across ALL Indexed Documents.")
    else:
        print("🌍 Searching Across ALL Indexed Documents (No Metadata Filter)")

    # ---------------------------------------
    # Load ChromaDB VectorStore
    # ---------------------------------------
    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=get_embedding_model()
    )

    vector_retriever = vectorstore.as_retriever(
        search_kwargs=search_kwargs
    )

    # ---------------------------------------
    # Step 1 : Generate Query Variations
    # ---------------------------------------
    queries = generate_query_variations(query)

    # ---------------------------------------
    # Step 2 : Hybrid Search (Vector + BM25) & Candidate Merging
    # ---------------------------------------
    hybrid_results = execute_hybrid_search_for_queries(
        vector_retriever=vector_retriever,
        queries=queries,
        document_ids=document_ids,
        persist_directory=persist_directory,
    )

    # ---------------------------------------
    # Step 3 : Reciprocal Rank Fusion (RRF)
    # ---------------------------------------
    rrf_documents = reciprocal_rank_fusion(
        hybrid_results,
        k=60,
        user_query=query
    )

    # ---------------------------------------
    # Step 4 : Cross Encoder Reranking
    # ---------------------------------------
    print("\n" + "=" * 80)
    print("---------------- Cross Encoder Ranking ----------------")
    print("=" * 80)

    final_documents = rerank_documents(
        question=query,
        documents=rrf_documents,
        top_k=k
    )

    print("\n" + "=" * 100)
    print("FINAL HYBRID DOCUMENTS SENT TO GPT")
    print("=" * 100)

    for i, doc in enumerate(final_documents, start=1):
        print(f"\nRank {i}")
        print("-" * 80)
        print(f"Doc ID: {doc.metadata.get('document_id')} | Chunk: {doc.metadata.get('chunk_id')} | File: {doc.metadata.get('filename')}")
        print(doc.page_content[:700])

    print(f"\n✅ Returning Top {len(final_documents)} Hybrid Documents")

    return final_documents