from fastapi import APIRouter, HTTPException
from app.schemas.evaluation_schema import EvaluationRequest, EvaluationResponse
from app.services.evaluation_service import run_rag_evaluation

router = APIRouter(prefix="/evaluation", tags=["Evaluation"])


@router.post("/", response_model=EvaluationResponse)
def evaluate_endpoint(request: EvaluationRequest):
    try:
        return run_rag_evaluation(
            question=request.question,
            document_ids=request.document_ids
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
