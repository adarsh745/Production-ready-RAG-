from langchain_openai import ChatOpenAI


def check_llm_connection():
    try:
        llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0
        )

        response = llm.invoke("Reply with only the word 'Connected'.")

        print("=" * 60)
        print("✅ OpenAI LLM Connected Successfully")
        print(f"Response: {response.content}")
        print("=" * 60)

        return llm

    except Exception as e:
        print("=" * 60)
        print("❌ Failed to Connect to OpenAI LLM")
        print(f"Error: {e}")
        print("=" * 60)
        raise