from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from app.core.config import settings


def get_llm():
    """
    Returns the configured LLM instance based on LLM_PROVIDER setting ('ollama' or 'openai').
    """
    if settings.LLM_PROVIDER == "ollama":
        return ChatOllama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL,
            temperature=0
        )
    else:
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=0,
            api_key=settings.OPENAI_API_KEY
        )


def check_llm_connection():
    try:
        llm = get_llm()
        response = llm.invoke("Reply with only the word 'Connected'.")
        content = response.content if hasattr(response, 'content') else str(response)

        model_name = settings.OLLAMA_MODEL if settings.LLM_PROVIDER == "ollama" else settings.OPENAI_MODEL
        print("=" * 60)
        print(f"[SUCCESS] {settings.LLM_PROVIDER.upper()} LLM ({model_name}) Connected Successfully")
        print(f"Response: {content.strip()}")
        print("=" * 60)

        return llm

    except Exception as e:
        print("=" * 60)
        print(f"[ERROR] Failed to Connect to {settings.LLM_PROVIDER.upper()} LLM")
        print(f"Error: {e}")
        print("=" * 60)
        raise