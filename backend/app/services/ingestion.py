import io
import random
import re
from PyPDF2 import PdfReader
from backend.app.core.config import get_embedding, get_vectordb

model = get_embedding()
collection = get_vectordb()

def file_ingestion(file_bytes: bytes, file_name: str):
    reader = PdfReader(io.BytesIO(file_bytes))
    raw_text = " ".join([page.extract_text() or "" for page in reader.pages])
    
    clean_text = re.sub(r'\s+', ' ', raw_text).strip()
    words = clean_text.split()
    
    if not words:
        return {"id": "", "name": file_name, "pages": len(reader.pages), "chunks": 0, "status": "error"}

    chunk_size = 200
    overlap = 40
    step = chunk_size - overlap
    
    chunks = []
    for i in range(0, len(words), step):
        chunk_str = " ".join(words[i:i + chunk_size])
        if chunk_str:
            chunks.append(chunk_str)

    embeddings = [e.tolist() for e in model.embed(chunks)]
    doc_id = f"{file_name}_{random.randint(10000, 99999)}"
    
    collection.add(
        ids=[f"{doc_id}_{idx}" for idx in range(len(chunks))],
        documents=chunks,
        embeddings=embeddings,
        metadatas=[{"document_name": file_name, "document_id": doc_id} for _ in chunks]
    )

    return {
        "id": doc_id,
        "name": file_name,
        "pages": len(reader.pages),
        "chunks": len(chunks),
        "status": "ready",
    }