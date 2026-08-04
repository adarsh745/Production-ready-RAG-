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

    # ----------------------------------
    # Step 1 : Rewrite Question
    # ----------------------------------
    standalone_question = rewrite_question(question)

    # ----------------------------------
    # Step 2 : Retrieve Documents
    # ----------------------------------
    documents = retrieve_documents(
        standalone_question,
        document_ids=document_ids
    )

    # ----------------------------------
    # Debug : Print Retrieved Metadata
    # ----------------------------------
    print("\n" + "=" * 80)
    print("DEBUG: Before Retrieval: Printing Every Retrieved Metadata")
    print("=" * 80)
    for i, doc in enumerate(documents, start=1):
        print(f"Document {i}")
        doc_meta = {
            "document_id": str(doc.metadata.get("document_id") or ""),
            "filename": str(doc.metadata.get("filename") or ""),
            "page": int(doc.metadata.get("page") or 0),
            "chunk_id": int(doc.metadata.get("chunk_id") or 0),
        }
        print(json.dumps(doc_meta, indent=4))

    # ----------------------------------
    # Step 3 : Collect Sources
    # ----------------------------------
    sources = []

    seen = set()

    for doc in documents:

        doc_id = str(doc.metadata.get("document_id") or "")
        filename = str(doc.metadata.get("filename") or "")
        page = int(doc.metadata.get("page") or 0)
        chunk_id = int(doc.metadata.get("chunk_id") or 0)

        source = {
            "document_id": doc_id,
            "filename": filename,
            "page": page,
            "chunk_id": chunk_id,
        }

        # Remove duplicates based on document_id + page + chunk_id
        key = (
            doc_id,
            page,
            chunk_id,
        )

        if key not in seen:
            seen.add(key)
            sources.append(source)

    # Return only top 3 sources
    sources = sources[:3]

    # ----------------------------------
    # Step 4 : Build Prompt
    # ----------------------------------
    prompt = build_prompt(question, documents)

    # ----------------------------------
    # Step 5 : Generate Answer
    # ----------------------------------
    answer = generate_answer(prompt)

    # ----------------------------------
    # Step 6 : Save Conversation
    # ----------------------------------
    add_user_message(question)
    add_ai_message(answer)

    # ----------------------------------
    # Step 7 : Return Answer + Sources
    # ----------------------------------
    return {
        "answer": answer,
        "sources": sources
    }


async def chat_stream(question: str, document_ids: Optional[List[str]] = None):

    print("\n" + "=" * 80)
    print("Retrieval Started")
    print("=" * 80)

    # ----------------------------------
    # Step 1 : Rewrite Question
    # ----------------------------------
    standalone_question = rewrite_question(question)

    # ----------------------------------
    # Step 2 : Retrieve Documents
    # ----------------------------------
    documents = retrieve_documents(
        standalone_question,
        document_ids=document_ids
    )

    print("Hybrid Search Completed")
    print("Cross Encoder Completed")

    # ----------------------------------
    # Step 3 : Collect Sources
    # ----------------------------------
    sources = []
    seen = set()

    for doc in documents:
        doc_id = str(doc.metadata.get("document_id") or "")
        filename = str(doc.metadata.get("filename") or "")
        page = int(doc.metadata.get("page") or 0)
        chunk_id = int(doc.metadata.get("chunk_id") or 0)

        source = {
            "document_id": doc_id,
            "filename": filename,
            "page": page,
            "chunk_id": chunk_id,
        }

        key = (doc_id, page, chunk_id)
        if key not in seen:
            seen.add(key)
            sources.append(source)

    sources = sources[:3]

    # ----------------------------------
    # Step 4 : Build Prompt & Save User Message
    # ----------------------------------
    prompt = build_prompt(question, documents)
    add_user_message(question)

    # ----------------------------------
    # Step 5 : Stream LLM Tokens
    # ----------------------------------
    print("\n" + "=" * 80)
    print("Streaming Started")
    print("=" * 80)

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

    print("\n" + "=" * 80)
    print("Streaming Finished")
    print(f"Total Tokens Generated: {total_tokens}")
    print("=" * 80)

    # ----------------------------------
    # Step 6 : Send Final Metadata Event
    # ----------------------------------
    metadata_json = json.dumps({"sources": sources})
    yield f"event: metadata\ndata: {metadata_json}\n\n"