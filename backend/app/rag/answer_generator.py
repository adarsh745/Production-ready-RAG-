from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI

# Create one LLM instance
llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0
)


def generate_answer(prompt: str) -> str:
    """
    Generate answer using GPT-4o.
    """
    print("\n" + "=" * 100)
    print("PROMPT SENT TO GPT")
    print("=" * 100)
    print(prompt)
    print("=" * 100)

    print("🤖 Sending Prompt to GPT...")
    response = llm.invoke(prompt)

    print("✅ Answer Generated Successfully")
    return response.content


async def generate_answer_stream(prompt: str):
    """
    Generate answer stream using GPT-4o async iterator.
    """
    print("\n" + "=" * 100)
    print("PROMPT SENT TO GPT (STREAMING)")
    print("=" * 100)
    print(prompt)
    print("=" * 100)

    print("🤖 Streaming Prompt to GPT...")
    async for chunk in llm.astream(prompt):
        if chunk.content:
            yield chunk.content