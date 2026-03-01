from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
from storage.memory_store import documents
from services.extraction_service import extract_text

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    # Validate file type
    allowed_types = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "image/png", "image/jpeg", "image/jpg",
        "text/plain"
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")
        
    doc_id = str(uuid.uuid4())
    content = await file.read()
    
    # Extract text based on file type
    try:
        text = extract_text(content, file.filename, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")
        
    documents[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "text": text,
        "classroom_id": None
    }
    
    return {"id": doc_id, "filename": file.filename, "message": "File uploaded and processed successfully"}
