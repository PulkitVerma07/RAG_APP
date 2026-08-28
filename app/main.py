from fastapi import FastAPI
from app.routes.user_question import router as question_ask

from app.routes.upload import router as upload
from fastapi.middleware.cors import CORSMiddleware

app =FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(question_ask)
app.include_router(upload)

    





 
