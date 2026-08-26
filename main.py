from fastapi import FastAPI,UploadFile
import chromadb
import io
from PyPDF2 import PdfReader
import anthropic
from sentence_transformers import SentenceTransformer
app = FastAPI()
@app.post('/upload_file')
async def upload_pdf(file : UploadFile):
    file_bytes = await file.read()
    reader = PdfReader(io.BytesIO(file_bytes))
    text=''
    for page in reader.pages:
        text += page.extract_text()
    chunks =[]
    text_list =list(text.replace('\n',''))
    chunk_Size = 300 
    overlap =2
    step = chunk_Size-overlap
    for i in range(0,len(text_list),step):
        chunk = text_list[i:i+chunk_Size]
        chunks.append("".join(chunk))
        if i+chunk_Size >= len(text_list):
            break
    id = []
    for i in range(len(chunks)):
        id.append(i)
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    embedddings = model.encode(chunks)
    client = chromadb.PersistentClient(path='./vector_db')
    collection = client.create_collection(name="vector_db_document")
    collection.add(
        ids=id,
        documents=chunks,
        embeddings=embedddings
    )
    return collection
 
@app.post('/q')
async def question():
    return False
@app.get('/docs_uploaded')
async def docs_uploaded():
    return True

