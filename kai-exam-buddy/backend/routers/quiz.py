from fastapi import APIRouter, HTTPException
from models.schemas import QuizAttemptRequest, QuizAttemptResponse, LeaderboardEntry
from storage.memory_store import quizzes, quiz_attempts
import uuid
from typing import List

router = APIRouter()

@router.post("/{quiz_id}/attempt", response_model=QuizAttemptResponse)
async def submit_quiz_attempt(quiz_id: str, attempt: QuizAttemptRequest):
    if quiz_id not in quizzes:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    quiz_data = quizzes[quiz_id]["data"]
    score = 0
    total = len(quiz_data["mcqs"])
    
    # Very basic grading for MVP: Just check MCQs
    for i, mcq in enumerate(quiz_data["mcqs"]):
        # Assuming the frontend sends answers matching the exact question or index
        # For simplicity, let's assume `attempt.answers` uses the question text as key
        user_answer = attempt.answers.get(mcq["question"])
        if user_answer and user_answer == mcq["correct_answer"]:
            score += 1
            
    attempt_id = str(uuid.uuid4())
    attempt_record = {
        "id": attempt_id,
        "quiz_id": quiz_id,
        "user_name": attempt.user_name,
        "score": score,
        "total": total
    }
    
    if quiz_id not in quiz_attempts:
        quiz_attempts[quiz_id] = []
    quiz_attempts[quiz_id].append(attempt_record)
    
    return attempt_record

@router.get("/{quiz_id}/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(quiz_id: str):
    if quiz_id not in quiz_attempts:
        return []
        
    attempts = quiz_attempts[quiz_id]
    # Sort descending by score
    sorted_attempts = sorted(attempts, key=lambda x: x["score"], reverse=True)
    
    # Return top 10
    leaderboard = []
    for a in sorted_attempts[:10]:
        leaderboard.append(LeaderboardEntry(user_name=a["user_name"], score=a["score"]))
        
    return leaderboard
