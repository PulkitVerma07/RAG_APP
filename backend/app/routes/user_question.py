from pydantic import BaseModel,Field
from fastapi import APIRouter
from backend.app.services.retreival import retreiving_question
from backend.app.services.llm import llm_processing

router =APIRouter()
class IncominQuery(BaseModel):
    question :str=Field(description='Question to be asked')


@router.post('/ask')
async def question(question:IncominQuery):
    retreived_question = retreiving_question(question=question.question)
    final_answer = llm_processing(question=question.question,retreived_text=retreived_question['context'])
    return {
        "question": question.question,
        "answer": final_answer,
        "sources": retreived_question["sources"],
    }
