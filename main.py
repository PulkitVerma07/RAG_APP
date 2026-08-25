from fastapi import FastAPI
import chromadb
import anthropic
import sentence_transformers
app = FastAPI()
app.post('/')
async def upload_pdf():
    return True
app.post('/q')
async def question():
    return False
app.get('/docs_uploaded')
async def docs_uploaded():
    return True
