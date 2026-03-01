from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, ai, classroom, quiz

app = FastAPI(title="Kai - AI Exam Buddy", version="1.0.0")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In MVP, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Integration"])
app.include_router(classroom.router, prefix="/api/classroom", tags=["Classroom"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Kai - AI Exam Buddy API"}
