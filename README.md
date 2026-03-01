# 🚀 Kai – AI Exam Buddy

Kai is an AI-powered study platform that transforms static notes into interactive, competitive study communities.

Upload your notes → Get AI-generated summary + repeated topics → Attempt quiz → Compete in classroom leaderboard.

Built for hackathon innovation.

---

## 🎯 Problem Statement

Students struggle with:
- What to study before exams
- Information overload
- Last-minute panic
- No structured revision system
- Lack of collaborative study engagement

Kai solves this by converting notes into:
- Exam-focused summaries
- High-weightage topic identification
- Auto-generated quizzes
- Classroom-based competitive study battles

---

## ✨ Core Features

### 📂 Multi-Format Upload
- PDF
- PPT
- Image (OCR)
- Text Paste

### 🧠 AI Academic Intelligence
From uploaded content, Kai generates:
- 📄 1-page exam-focused summary
- 🔁 5 most repeated/high-weightage topics
- ❓ 10–15 quiz questions (MCQs + short answers)
- ✅ Correct answers + explanations

### 🏫 Classroom Mode
- Create classroom with unique class code
- Join via class code
- Attempt same quiz
- View leaderboard

### 🏆 Leaderboard
- Ranked by score
- Top performers highlighted
- Encourages weekly quiz battles

---

## 🏗 Tech Stack

### Backend
- FastAPI
- Python
- OpenAI API
- pdfplumber
- python-pptx
- pytesseract
- Pillow
- python-dotenv

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Database
- In-memory storage (MVP version)
- PostgreSQL integration planned

---

## 🧠 AI Output Structure

The AI returns structured JSON:

```json
{
  "summary": "string",
  "repeated_topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "quiz": [
    {
      "type": "MCQ",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "string",
      "explanation": "string"
    },
    {
      "type": "SHORT",
      "question": "string",
      "correct_answer": "string",
      "explanation": "string"
    }
  ]
}
```
###Project Structure

##Backend

backend/
│
├── main.py
├── routers/
│   ├── upload.py
│   ├── ai.py
│   ├── classroom.py
│   └── quiz.py
│
├── services/
│   ├── ai_service.py
│   └── extraction_service.py
│
├── models/
│   └── schemas.py
│
├── storage/
│   └── memory_store.py
│
├── requirements.txt
└── .env

##Frontend:

frontend/
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── tailwind.config.js

###🔄 Application Flow

Upload notes
AI generates:
   Summary
   Repeated topics
   Quiz
Create classroom
Share class code
Students attempt quiz
Leaderboard updates

###🚀 Future Enhancements

PostgreSQL integration
Weekly auto-generated quiz battles
Performance analytics dashboard
Adaptive difficulty quizzes
Flashcard revision mode
Shareable score card
Real-time multiplayer mode

###📊 Success Metrics

Classrooms Created
Active Participants
Repeat Attempts
Leaderboard Engagement
