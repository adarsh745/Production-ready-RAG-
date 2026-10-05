from dotenv import load_dotenv
load_dotenv()

from app.utils.llm_utils import get_llm


def generate_answer(prompt: str) -> str:
    """
    Generate answer using configured LLM.
    """
    print("\n" + "=" * 100)
    print("PROMPT SENT TO LLM")
    print("=" * 100)
    print(prompt)
    print("=" * 100)

    print("[INFO] Sending Prompt to LLM...")
    llm = get_llm()
    response = llm.invoke(prompt)

    print("[SUCCESS] Answer Generated Successfully")
    return response.content if hasattr(response, 'content') else str(response)


async def generate_answer_stream(prompt: str):
    """
    Generate answer stream using LLM async iterator.
    """
    print("\n" + "=" * 100)
    print("PROMPT SENT TO LLM (STREAMING)")
    print("=" * 100)
    print(prompt)
    print("=" * 100)

    print("[INFO] Streaming Prompt to LLM...")
    llm = get_llm()
    async for chunk in llm.astream(prompt):
        content = chunk.content if hasattr(chunk, 'content') else str(chunk)
        if content:
            yield content