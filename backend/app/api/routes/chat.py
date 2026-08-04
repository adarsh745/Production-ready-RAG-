from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.chat_service import chat, chat_stream
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.rag.conversation_memory import clear_chat_history
from langchain_openai import ChatOpenAI

# Create one LLM instance
llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0
)
router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        answer = chat(
            question=request.question,
            document_ids=request.document_ids
        )
        return ChatResponse(
            answer=answer["answer"],
            sources=answer["sources"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest):
    try:
        generator = chat_stream(
            question=request.question,
            document_ids=request.document_ids
        )
        return StreamingResponse(
            generator,
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clear-memory")
def clear_memory():

    clear_chat_history()

    return {
        "message": "Conversation history cleared."
    }