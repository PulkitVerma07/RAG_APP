from fastapi import FastAPI,UploadFile,Query
from typing import Annotated
import chromadb
import io
from pydantic import BaseModel,Field
from PyPDF2 import PdfReader

#AI to give answers
import requests
import os
from dotenv import load_dotenv
load_dotenv()

#Api Key
api_key = os.getenv('GEMINI_API_KEY')
url =  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"
headers= {
    'Content-Type': 'application/json',
    'X-goog-api-key':api_key
}




from sentence_transformers import SentenceTransformer
app = FastAPI()
#Embedding Model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
#Creating database in ChromaDb
client = chromadb.PersistentClient(path='./vector_db')
collection = client.get_or_create_collection(name="vector_db1_document")
    


class IncominQuery(BaseModel):
    question :str=Field(description='Question to be asked')

@app.post('/upload_file')
async def upload_pdf(file : UploadFile):
    file_bytes = await file.read()
    reader = PdfReader(io.BytesIO(file_bytes))
    text=''
    for page in reader.pages:
        text += page.extract_text()
    chunks =[]
    text_list =list(text)
    chunk_Size = 300 
    overlap =100
    step = chunk_Size-overlap
    for i in range(0,len(text_list),step):
        chunk = text_list[i:i+chunk_Size]
        chunks.append("".join(chunk))
        if i+chunk_Size >= len(text_list):
            break
    
    embeddings = model.encode(chunks)
    collection.add(
        ids=[f'{file.filename}_{i} ' for i in range(len(chunks)) ],
        documents=chunks,
        embeddings=embeddings
    )
    result = collection.get()
    return chunks
 
@app.post('/ask')
async def question(question:IncominQuery):
    question_embeddings = model.encode(question.question)
    retrieved_chunks_list=collection.query(query_embeddings=question_embeddings,n_results=10)
    retreived_text = '\n\n'.join(retrieved_chunks_list['documents'][0])
    
    prompt_text = f"""Context:{retreived_text} Question:{question.question} Answer using only the context above. If the answer isn't in the context, say so. """
    payload ={
    "contents": [
        {
            "parts": [
                {
                    "text": prompt_text
                }
            ]}]}
    request = requests.post(url=url,headers=headers,json=payload)
    request.raise_for_status()
    return request.json()
    

       
    

    
