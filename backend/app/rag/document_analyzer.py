import json
from dotenv import load_dotenv
load_dotenv()

from app.utils.llm_utils import get_llm


def generate_summary_and_questions(text_content: str, filename: str = "Document.pdf") -> dict:
    """
    Analyzes document text to generate:
    1. A concise summary (100–150 words).
    2. 5–8 useful questions based strictly on the uploaded document.
    """
    if not text_content or len(text_content.strip()) < 50:
        return {
            "summary": f"Document '{filename}' uploaded and indexed into production RAG database.",
            "suggested_questions": [
                f"What is the main topic of {filename}?",
                "What key information is provided in this document?",
                "Summarize the main sections.",
                "What are the key takeaways?"
            ],
            "keywords": ["RAG", "Document", "Knowledge"]
        }

    sample_text = text_content[:4000]

    prompt = f"""You are an AI assistant.

Based ONLY on the uploaded document, generate:
1. A concise summary (100–150 words).
2. 5–8 useful questions that a user is likely to ask.

Rules:
- Questions must come only from the document.
- Do not invent information.
- Questions should cover different sections of the document.
- Return the response strictly in JSON format.

{{
    "summary": "...",
    "suggested_questions": [
        "...",
        "...",
        "...",
        "...",
        "..."
    ]
}}

Document Content Sample:
\"\"\"
{sample_text}
\"\"\"
"""

    try:
        llm = get_llm()
        response = llm.invoke(prompt)
        raw_output = (response.content if hasattr(response, 'content') else str(response)).strip()

        # Clean markdown code blocks if present
        if raw_output.startswith("```"):
            raw_output = raw_output.split("```")[1]
            if raw_output.startswith("json"):
                raw_output = raw_output[4:]
            raw_output = raw_output.strip()

        parsed = json.loads(raw_output)

        summary = parsed.get("summary", f"Summary of {filename}.")
        questions = parsed.get("suggested_questions", [])

        if not questions or len(questions) < 3:
            questions = [
                f"What is the main topic of {filename}?",
                "What key concepts are explained?",
                "Summarize the important sections.",
                "What action items or conclusions are highlighted?",
                "Explain the primary purpose of this document."
            ]

        # Extract keywords from summary if not returned
        words = [w.strip(",.") for w in summary.split() if len(w) > 4 and w.isalpha()]
        keywords = list(dict.fromkeys(words))[:6]

        return {
            "summary": summary,
            "suggested_questions": questions[:8],
            "keywords": keywords
        }
    except Exception as e:
        print(f"⚠️ Document analyzer LLM call fallback: {e}")
        return {
            "summary": f"Document '{filename}' contains key structured information indexed for RAG contextual search.",
            "suggested_questions": [
                f"What is the main topic of {filename}?",
                "What key information is provided in this document?",
                "Summarize the primary points.",
                "Which technologies or concepts are mentioned?",
                "What are the main conclusions?"
            ],
            "keywords": ["RAG", "Document", "PDF"]
        }
