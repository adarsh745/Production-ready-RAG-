from pydantic import BaseModel, Field


class RAGASMetricsResult(BaseModel):
    faithfulness: float = Field(default=0.0, ge=0.0, le=1.0)
    answer_relevancy: float = Field(default=0.0, ge=0.0, le=1.0)
    context_precision: float = Field(default=0.0, ge=0.0, le=1.0)
    context_recall: float = Field(default=0.0, ge=0.0, le=1.0)

    @property
    def average_score(self) -> float:
        scores = [self.faithfulness, self.answer_relevancy, self.context_precision, self.context_recall]
        return round(sum(scores) / len(scores), 4)
