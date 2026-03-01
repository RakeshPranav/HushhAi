from pydantic import BaseModel
from typing import List, Optional

# Classroom Models
class ClassroomCreate(BaseModel):
    name: str

class ClassroomResponse(BaseModel):
    id: str
    code: str
    name: str

# Document Models
class DocumentResponse(BaseModel):
    id: str
    filename: str
    classroom_id: Optional[str] = None

# AI Models
class SummaryResponse(BaseModel):
    summary: str
    repeated_concepts: List[str]
    likely_questions: List[str]

class MCQ(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None

class ShortQuestion(BaseModel):
    question: str
    answer: str

class QuizGenerateResponse(BaseModel):
    mcqs: List[MCQ]
    short_questions: List[ShortQuestion]

# Quiz Attempt Models
class QuizAttemptRequest(BaseModel):
    user_name: str
    answers: dict # user's answers mapped by question format

class QuizAttemptResponse(BaseModel):
    id: str
    user_name: str
    score: int
    total: int

class LeaderboardEntry(BaseModel):
    user_name: str
    score: int
