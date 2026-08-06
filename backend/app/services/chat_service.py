import json
from typing import List, Optional
from app.rag.prompt_builder import build_prompt
from app.rag.answer_generator import generate_answer
from app.rag.multi_query_retriever import retrieve_documents
from app.rag.question_rewriter import rewrite_question

from app.rag.conversation_memory import (
    add_ai_message,
    add_user_message,
)


def chat(question: str, document_ids: Optional[List[str]] = None):
    print("\n" + "=" * 100)
    print(f"DEBUG LOG: QUESTION RECEIVED -> {question}")
    print("=" * 100)

    # Step 1 : Rewrite Question
    standalone_question = rewrite_question(question)
    print(f"\nDEBUG LOG: STANDALONE QUESTION -> {standalone_question}")

    # Step 2 : Retrieve Documents
    documents = retrieve_documents(
        standalone_question,
        document_ids=document_ids,
        k=8
    )

    # Step 1 & 5 DEBUG LOGGING: Print every retrieved chunk with exact format
    print("\n" + "=" * 100)
    print("DEBUG LOG: RETRIEVED CHUNKS BEFORE LLM PROMPT")
    print("=" * 100)

    for idx, doc in enumerate(documents, start=1):
        print(f"\nRetrieved Chunk {idx}")
        print("-" * 50)
        print(doc.page_content)
        print("-" * 50)
        print("Metadata")
        print(f"page: {doc.metadata.get('page') or doc.metadata.get('page_number', 'N/A')}")
        print(f"chunk_id: {doc.metadata.get('chunk_id', idx)}")
        print(f"document_id: {doc.metadata.get('document_id', 'N/A')}")
        print(f"filename: {doc.metadata.get('filename', 'N/A')}")
        print("=" * 100)

    # Step 3 : Collect Sources with full chunk text content & URL
    sources = []
    seen = set()

    for doc in documents:
        doc_id = str(doc.metadata.get("document_id") or "")
        filename = str(doc.metadata.get("filename") or "")
        filepath = str(doc.metadata.get("filepath") or "")
        raw_page = int(doc.metadata.get("page") or doc.metadata.get("page_number") or 1)
        page = raw_page if raw_page > 0 else 1
        chunk_id = int(doc.metadata.get("chunk_id") or 0)

        url = f"/uploads/{filename}" if filename else (f"/api/documents/{doc_id}/file" if doc_id else "")

        source = {
            "document_id": doc_id,
            "filename": filename,
            "filepath": filepath,
            "url": url,
            "page": page,
            "chunk_id": chunk_id,
            "chunk_text": doc.page_content,
            "content": doc.page_content,
        }

        key = (doc_id, page, chunk_id)
        if key not in seen:
            seen.add(key)
            sources.append(source)

    sources = sources[:3]

    # Step 4 : Build Prompt & Print Final Context & Prompt
    prompt = build_prompt(question, documents)

    print("\n" + "=" * 100)
    print("DEBUG LOG: FINAL PROMPT SENT TO LLM")
    print("=" * 100)
    print(prompt)
    print("=" * 100)

    # Step 5 : Generate Answer
    answer = generate_answer(prompt)

    print("\n" + "=" * 100)
    print("DEBUG LOG: LLM RESPONSE GENERATED")
    print("=" * 100)
    print(answer)
    print("=" * 100)

    # Step 6 : Save Conversation
    add_user_message(question)
    add_ai_message(answer)

    return {
        "answer": answer,
        "sources": sources
    }


async def chat_stream(question: str, document_ids: Optional[List[str]] = None):
    print("\n" + "=" * 100)
    print(f"DEBUG LOG STREAM: QUESTION RECEIVED -> {question}")
    print("=" * 100)

    standalone_question = rewrite_question(question)

    documents = retrieve_documents(
        standalone_question,
        document_ids=document_ids,
        k=8
    )

    print("\n" + "=" * 100)
    print("DEBUG LOG STREAM: RETRIEVED CHUNKS BEFORE LLM PROMPT")
    print("=" * 100)

    for idx, doc in enumerate(documents, start=1):
        print(f"\nRetrieved Chunk {idx}")
        print("-" * 50)
        print(doc.page_content)
        print("-" * 50)
        print("Metadata")
        print(f"page: {doc.metadata.get('page') or doc.metadata.get('page_number', 'N/A')}")
        print(f"chunk_id: {doc.metadata.get('chunk_id', idx)}")
        print(f"document_id: {doc.metadata.get('document_id', 'N/A')}")
        print(f"filename: {doc.metadata.get('filename', 'N/A')}")
        print("=" * 100)

    sources = []
    seen = set()

    for doc in documents:
        doc_id = str(doc.metadata.get("document_id") or "")
        filename = str(doc.metadata.get("filename") or "")
        filepath = str(doc.metadata.get("filepath") or "")
        raw_page = int(doc.metadata.get("page") or doc.metadata.get("page_number") or 1)
        page = raw_page if raw_page > 0 else 1
        chunk_id = int(doc.metadata.get("chunk_id") or 0)

        url = f"/uploads/{filename}" if filename else (f"/api/documents/{doc_id}/file" if doc_id else "")

        source = {
            "document_id": doc_id,
            "filename": filename,
            "filepath": filepath,
            "url": url,
            "page": page,
            "chunk_id": chunk_id,
            "chunk_text": doc.page_content,
            "content": doc.page_content,
        }

        key = (doc_id, page, chunk_id)
        if key not in seen:
            seen.add(key)
            sources.append(source)

    sources = sources[:3]

    prompt = build_prompt(question, documents)

    print("\n" + "=" * 100)
    print("DEBUG LOG STREAM: FINAL PROMPT SENT TO LLM")
    print("=" * 100)
    print(prompt)
    print("=" * 100)

    add_user_message(question)

    full_answer_tokens = []
    total_tokens = 0

    from app.rag.answer_generator import generate_answer_stream

    async for token in generate_answer_stream(prompt):
        total_tokens += 1
        full_answer_tokens.append(token)

        lines = token.split("\n")
        data_str = "\n".join(f"data: {line}" for line in lines)
        yield f"event: token\n{data_str}\n\n"

    complete_answer = "".join(full_answer_tokens)
    add_ai_message(complete_answer)

    print("\n" + "=" * 100)
    print("DEBUG LOG STREAM: LLM RESPONSE GENERATED")
    print("=" * 100)
    print(complete_answer)
    print(f"Total Tokens Generated: {total_tokens}")
    print("=" * 100)

    metadata_json = json.dumps({"sources": sources})
    yield f"event: metadata\ndata: {metadata_json}\n\n"