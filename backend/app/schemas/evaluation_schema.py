from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.chat_schema import Source


class EvaluationRequest(BaseModel):
    question: str
    document_ids: Optional[List[str]] = None


class EvaluationScores(BaseModel):
    faithfulness: float = Field(..., description="Measures if the answer is grounded in retrieved context.")
    answer_relevancy: float = Field(..., description="Measures how relevant the answer is to the question.")
    context_precision: float = Field(..., description="Measures precision of top retrieved context chunks.")
    context_recall: float = Field(..., description="Measures if retrieved context covers facts needed.")
    average_score: float = Field(..., description="Average score across all 4 metrics.")


class EvaluationResponse(BaseModel):
    answer: str
    sources: List[Source]
    evaluation: EvaluationScores
