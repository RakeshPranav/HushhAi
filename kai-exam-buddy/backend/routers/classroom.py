from fastapi import APIRouter, HTTPException
import uuid
import random
import string
from models.schemas import ClassroomCreate, ClassroomResponse
from storage.memory_store import classrooms, quizzes

router = APIRouter()

def generate_class_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@router.post("/", response_model=ClassroomResponse)
async def create_classroom(classroom: ClassroomCreate):
    class_id = str(uuid.uuid4())
    code = generate_class_code()
    
    # Ensure unique code
    while any(c["code"] == code for c in classrooms.values()):
        code = generate_class_code()
        
    classrooms[code] = {
        "id": class_id,
        "code": code,
        "name": classroom.name
    }
    
    return classrooms[code]

@router.get("/{code}", response_model=ClassroomResponse)
async def get_classroom(code: str):
    if code not in classrooms:
        raise HTTPException(status_code=404, detail="Classroom not found")
    return classrooms[code]

@router.get("/{code}/quizzes")
async def get_classroom_quizzes(code: str):
    if code not in classrooms:
        raise HTTPException(status_code=404, detail="Classroom not found")
        
    class_quizzes = [q for q in quizzes.values() if q.get("classroom_code") == code]
    return {"quizzes": class_quizzes}
