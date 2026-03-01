import os
import json
import logging
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize OpenAI Client securely from environment using Gemini Compatibility layer
client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY", ""),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

async def generate_study_material(text: str, retries=1) -> dict:
    if not client.api_key:
        raise ValueError("OPENAI_API_KEY is missing from environment variables.")
        
    text_snippet = text[:15000]
    
    prompt = f"""
You are an expert university exam preparation assistant. 
Analyze the provided academic content carefully.

Generate:
1. A concise 1-page exam-focused summary.
2. Exactly 5 most repeated or high-weightage topics.
3. 10–15 exam-relevant questions (mix of MCQs and short answer).
4. Provide correct answers and explanations for each question.

Rules:
- Questions must be strictly based on provided content.
- Do not invent external information.
- Ensure questions are exam-oriented.
- Return structured JSON only.

EXPECTED JSON FORMAT:
{{
  "summary": "string",
  "repeated_topics": [
    "topic1",
    "topic2",
    "topic3",
    "topic4",
    "topic5"
  ],
  "quiz": [
    {{
      "type": "MCQ",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "string",
      "explanation": "string"
    }},
    {{
      "type": "SHORT",
      "question": "string",
      "correct_answer": "string",
      "explanation": "string"
    }}
  ]
}}

Document text:
{text_snippet}
"""

    for attempt in range(retries + 1):
        try:
            response = await client.chat.completions.create(
                model="gemini-2.5-flash", # Changed to Gemini model
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            
            content = response.choices[0].message.content
            parsed_json = json.loads(content)
            
            # Simple validation block
            if "summary" not in parsed_json or "quiz" not in parsed_json:
                raise ValueError("Missing required keys in JSON response")
                
            return parsed_json
        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: {e}")
            if attempt == retries:
                raise Exception("Failed to generate structured JSON from OpenAI after retries.") from e

# Legacy stub for backward compatibility in case they are imported strictly elsewhere
async def generate_summary_and_questions(text: str) -> dict:
    res = await generate_study_material(text)
    return {
        "summary": res.get("summary", ""),
        "repeated_concepts": res.get("repeated_topics", []),
        "likely_questions": [q["question"] for q in res.get("quiz", [])[:5]]
    }

async def generate_quiz(text: str) -> dict:
    res = await generate_study_material(text)
    mcqs = []
    shorts = []
    for q in res.get("quiz", []):
        if q.get("type") == "MCQ":
            mcqs.append({
                "question": q.get("question", ""),
                "options": q.get("options", []),
                "correct_answer": q.get("correct_answer", ""),
                "explanation": q.get("explanation", "")
            })
        else:
            shorts.append({
                "question": q.get("question", ""),
                "answer": q.get("correct_answer", "")
            })
    return {
        "mcqs": mcqs,
        "short_questions": shorts
    }
