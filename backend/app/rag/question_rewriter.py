# from app.utils.llm_utils import check_llm_connection
from app.rag.conversation_memory import get_chat_history

from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
# Create one LLM instance
llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0
        )


def rewrite_question(question: str):

    history = get_chat_history()

    # First question
    if len(history) == 0:
        print("The hestory is empty so  returinig original question...")
        return question

    print("\n🧠 Rewriting Question...")

    messages = [
        SystemMessage(
            content="""
You are an expert search assistant.

Rewrite the user's latest question into a standalone question.

Do NOT answer it.

Only rewrite it using previous conversation context.
"""
        )
    ]

    messages.extend(history)

    messages.append(
        HumanMessage(content=question)
    )

    response = llm.invoke(messages)

    standalone_question = response.content.strip()

    print(f"Standalone Question is...: {standalone_question}")

    return standalone_question