from typing import List, Optional
from app.rag.question_rewriter import rewrite_question
from app.rag.multi_query_retriever import retrieve_documents
from app.rag.prompt_builder import build_prompt
from app.rag.answer_generator import generate_answer
from app.evaluation.dataset_builder import build_evaluation_sample
from app.evaluation.evaluator import evaluate_rag_sample
from app.schemas.evaluation_schema import EvaluationResponse, EvaluationScores


def run_rag_evaluation(question: str, document_ids: Optional[List[str]] = None) -> EvaluationResponse:
    """
    Run full RAG pipeline and evaluate sample across 4 RAGAS metrics:
    Faithfulness, Answer Relevancy, Context Precision, and Context Recall.
    """
    print("\n" + "=" * 80)
    print("DEBUG: Question")
    print("=" * 80)
    print(question)

    # Step 1: Run RAG Retrieval Pipeline (Question Rewriter + Multi-Query + Hybrid Search + RRF + Cross Encoder)
    standalone_question = rewrite_question(question)
    documents = retrieve_documents(standalone_question, document_ids=document_ids)

    # Extract retrieved context page_content strings
    retrieved_contexts = [doc.page_content for doc in documents]

    print("\n" + "=" * 80)
    print("DEBUG: Retrieved Context")
    print("=" * 80)
    for idx, ctx in enumerate(retrieved_contexts, start=1):
        print(f"Context Chunk {idx}:")
        print(ctx[:300].replace("\n", " "))
        print("-" * 40)

    # Step 2: Generate GPT Answer
    prompt = build_prompt(question, documents)
    answer = generate_answer(prompt)

    print("\n" + "=" * 80)
    print("DEBUG: Answer")
    print("=" * 80)
    print(answer)

    # Step 3: Collect Sources
    sources = []
    seen = set()
    for doc in documents:
        doc_id = str(doc.metadata.get("document_id") or "")
        filename = str(doc.metadata.get("filename") or "")
        page = int(doc.metadata.get("page") or 0)
        chunk_id = int(doc.metadata.get("chunk_id") or 0)

        source = {
            "document_id": doc_id,
            "filename": filename,
            "page": page,
            "chunk_id": chunk_id,
        }
        key = (doc_id, page, chunk_id)
        if key not in seen:
            seen.add(key)
            sources.append(source)

    sources = sources[:3]

    # Step 4: Pass Question, Retrieved Context, and Answer into RAGAS Evaluator
    evaluation_sample = build_evaluation_sample(question, answer, retrieved_contexts)
    metrics_result = evaluate_rag_sample(
        question=evaluation_sample["question"],
        answer=evaluation_sample["answer"],
        contexts=evaluation_sample["contexts"],
    )

    eval_scores = EvaluationScores(
        faithfulness=metrics_result.faithfulness,
        answer_relevancy=metrics_result.answer_relevancy,
        context_precision=metrics_result.context_precision,
        context_recall=metrics_result.context_recall,
        average_score=metrics_result.average_score,
    )

    print("\n" + "=" * 80)
    print("DEBUG: Evaluation Scores")
    print("=" * 80)
    print(f"Faithfulness:       {eval_scores.faithfulness:.4f}")
    print(f"Answer Relevancy:   {eval_scores.answer_relevancy:.4f}")
    print(f"Context Precision:  {eval_scores.context_precision:.4f}")
    print(f"Context Recall:     {eval_scores.context_recall:.4f}")
    print(f"Average Score:      {eval_scores.average_score:.4f}")
    print("=" * 80)

    return EvaluationResponse(
        answer=answer,
        sources=sources,
        evaluation=eval_scores,
    )
