from fastapi import FastAPI
from backend.app.routes.user_question import router as question_ask
from backend.app.routes.upload import router as upload_docs
from backend.app.routes.healthcheck   import router as health_check
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(question_ask)
app.include_router(upload_docs)
app.include_router(health_check)