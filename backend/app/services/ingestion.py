from PyPDF2 import PdfReader
import io
import random 
from backend.app.core.config import embedding_model,VectroDb

def file_ingestion(file_bytes,file_name):
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
    model = embedding_model()
    collection = VectroDb()
    embeddings = model.encode(chunks)
    document_id = f'{file_name}'+str(random.randint(11111,99999))
    collection.add(
        ids=[f'{file_name}_{i}' for i in range(len(chunks)) ],
        documents=chunks,
        embeddings=embeddings,
        metadatas=[{'document_name':file_name,'document_id':document_id} for _ in chunks]
    )
    result = collection.get()
    return { "id": document_id, "name": file_name, "pages": len(reader.pages), "chunks": len(chunks), "status": "ready", }