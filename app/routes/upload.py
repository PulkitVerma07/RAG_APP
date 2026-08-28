from fastapi import APIRouter, UploadFile
from app.services.ingestion import file_ingestion

router =APIRouter()
@router.post("/upload_file")
async def upload_pdf(file: UploadFile):
    file_bytes = await file.read()
    result = file_ingestion(file_bytes, file.filename)
    return result
