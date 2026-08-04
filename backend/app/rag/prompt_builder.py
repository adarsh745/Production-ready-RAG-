# def build_prompt(question: str, documents: list) -> str:
#     """
#     Build the prompt using the retrieved documents.
#     """

#     context = ""

#     for i, doc in enumerate(documents):
#         context += f"\n\nDocument {i+1}\n"
#         context += doc.page_content

#     prompt = f"""
# You are an AI assistant.

# Answer ONLY using the provided context.

# If the answer is not present in the context, reply:

# "I couldn't find the answer in the uploaded documents."

# ======================
# CONTEXT
# ======================

# {context}

# ======================
# QUESTION
# ======================

# {question}

# ======================
# ANSWER
# ======================
# """

#     return prompt





def build_prompt(question: str, documents: list):

    context_blocks = []

    for i, doc in enumerate(documents, start=1):
        filename = doc.metadata.get("filename", "Document")
        page = doc.metadata.get("page", "N/A")
        chunk_id = doc.metadata.get("chunk_id", i)

        header = f"--- Document {i} (Source: {filename}, Page: {page}, Chunk: {chunk_id}) ---"
        content = f"{header}\n{doc.page_content}"
        context_blocks.append(content)

    context = "\n\n".join(context_blocks)

    prompt = f"""You are a precise, production-grade RAG assistant.

IMPORTANT INSTRUCTIONS:
1. Answer the user's question completely and accurately using ONLY the information provided in the CONTEXT section below.
2. Rely strictly on the explicit facts, features, lists, and tables mentioned in the context.
3. If the context does NOT contain enough information to answer the question, respond with:
"I couldn't find the answer in the uploaded documents."

=========================
CONTEXT
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