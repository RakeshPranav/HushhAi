from fastapi import APIRouter, HTTPException
from models.schemas import SummaryResponse, QuizGenerateResponse
from storage.memory_store import documents, ai_results, quizzes
from services.ai_service import generate_study_material
import uuid

router = APIRouter()

@router.post("/{doc_id}/generate-summary", response_model=SummaryResponse)
async def create_summary(doc_id: str):
    if doc_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Check if we already generated the big payload to save tokens
    if doc_id in ai_results and "quiz" in ai_results[doc_id]:
        result = ai_results[doc_id]
    else:
        text = documents[doc_id]["text"]
        try:
            result = await generate_study_material(text)
            ai_results[doc_id] = result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Map to frontend expected summary
    summary_data = {
        "summary": result.get("summary", ""),
        "repeated_concepts": result.get("repeated_topics", []),
        "likely_questions": [q["question"] for q in result.get("quiz", [])[:5]]
    }
    return summary_data

@router.post("/{doc_id}/generate-quiz", response_model=QuizGenerateResponse)
async def create_quiz(doc_id: str, classroom_code: str = None):
    if doc_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Reuse payload if it already exists
    if doc_id not in ai_results or "quiz" not in ai_results[doc_id]:
        text = documents[doc_id]["text"]
        try:
            result = await generate_study_material(text)
            ai_results[doc_id] = result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    result = ai_results[doc_id]
    
    # Map back to Quiz frontend schema
    mcqs = []
    shorts = []
    for q in result.get("quiz", []):
        if q.get("type", "").upper() == "MCQ":
            mcqs.append({
                "question": q.get("question", ""),
                "options": q.get("options", []),
                "correct_answer": q.get("correct_answer", ""),
                "explanation": q.get("explanation", "")
            })
        else:
            shorts.append({
                "question": q.get("question", ""),
                "answer": q.get("correct_answer", "") # Map from correct_answer -> answer
            })
            
    quiz_data = {
        "mcqs": mcqs,
        "short_questions": shorts
    }
    
    quiz_id = str(uuid.uuid4())
    quizzes[quiz_id] = {
        "id": quiz_id,
        "doc_id": doc_id,
        "classroom_code": classroom_code,
        "data": quiz_data
    }
    
    return quiz_data
