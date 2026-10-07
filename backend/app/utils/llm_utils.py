from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings


def get_llm():
    """
    Returns the configured LLM instance based on LLM_PROVIDER setting ('gemini', 'openai', or 'ollama').
    """
    if settings.LLM_PROVIDER == "gemini":
        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0
        )
    elif settings.LLM_PROVIDER == "ollama":
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL,
            temperature=0
        )
    else:
        from langchain_openai import ChatOpenAI
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

        if settings.LLM_PROVIDER == "gemini":
            model_name = settings.GEMINI_MODEL
        elif settings.LLM_PROVIDER == "ollama":
            model_name = settings.OLLAMA_MODEL
        else:
            model_name = settings.OPENAI_MODEL

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