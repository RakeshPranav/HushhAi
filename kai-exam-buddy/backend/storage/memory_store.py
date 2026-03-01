from typing import Dict, List

# In-memory stores
classrooms: Dict[str, dict] = {} # code -> classroom_data
documents: Dict[str, dict] = {} # id -> doc_data
ai_results: Dict[str, dict] = {} # doc_id -> result_data
quizzes: Dict[str, dict] = {} # classroom_code/id -> quiz_data
quiz_attempts: Dict[str, List[dict]] = {} # classroom_code/id -> list of attempts

def get_classrooms():
    return classrooms

def get_documents():
    return documents

def get_ai_results():
    return ai_results

def get_quizzes():
    return quizzes

def get_quiz_attempts():
    return quiz_attempts
