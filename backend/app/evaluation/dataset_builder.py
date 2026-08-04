from typing import List, Dict, Any


def build_evaluation_sample(
    question: str,
    answer: str,
    retrieved_contexts: List[str]
) -> Dict[str, Any]:
    """
    Build a standardized evaluation sample payload containing
    user input question, generated answer, and list of retrieved context strings.
    """
    return {
        "user_input": question,
        "question": question,
        "response": answer,
        "answer": answer,
        "retrieved_contexts": retrieved_contexts,
        "contexts": retrieved_contexts,
    }
