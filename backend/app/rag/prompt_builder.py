def build_prompt(question: str, documents: list) -> str:
    """
    Build structured, context-rich prompt for GPT answer generation.
    """
    context_blocks = []

    for i, doc in enumerate(documents, start=1):
        filename = doc.metadata.get("filename", "Document")
        page = doc.metadata.get("page", doc.metadata.get("page_number", "N/A"))
        chunk_id = doc.metadata.get("chunk_id", i)
        doc_id = doc.metadata.get("document_id", "N/A")

        header = f"--- Document {i} (Source: {filename}, Page: {page}, Chunk: {chunk_id}, DocID: {doc_id}) ---"
        content = f"{header}\n{doc.page_content}"
        context_blocks.append(content)

    context = "\n\n".join(context_blocks)

    prompt = f"""You are a precise, production-grade RAG AI assistant.

CRITICAL SYSTEM INSTRUCTIONS:
1. Read ALL retrieved context below carefully and thoroughly before answering.
2. Infer answers ONLY from the retrieved context. Look closely through all logical sections (e.g. Education, Experience, Projects, Skills, Certificates, Marksheet, Payment specifications).
3. If the answer or relevant details exist ANYWHERE in the context, answer the user's question completely, accurately, and clearly.
4. Only reply "I couldn't find the answer in the uploaded documents." if the required information is TRULY ABSENT from every retrieved context chunk.

=========================
RETRIEVED CONTEXT
=========================

{context}

=========================
QUESTION
=========================

{question}

=========================
ANSWER
=========================
"""

    return prompt