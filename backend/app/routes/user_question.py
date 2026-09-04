import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from backend.app.services.retreival import retreiving_question
from backend.app.services.llm import stream_rag_pipeline

router = APIRouter()

class IncomingQuery(BaseModel):
    question: str = Field(description="Question to be asked")

@router.post("/ask")
async def ask_endpoint(payload: IncomingQuery):
    retrieved = await asyncio.to_thread(retreiving_question, payload.question)
    return StreamingResponse(
        stream_rag_pipeline(payload.question, retrieved),
        media_type="text/event-stream"
    )