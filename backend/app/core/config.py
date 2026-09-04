import os
from dotenv import load_dotenv
import chromadb
from fastembed import TextEmbedding

load_dotenv()

_embedding_model = None
_client = None
_collection = None

def LLm():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing! Check your .env file.")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse&key={api_key}"
    headers = {"Content-Type": "application/json",'X-goog-api-key':api_key}
    return url, headers

def get_vectordb():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path="./vector_db")
        _collection = _client.get_or_create_collection(name="vector_db")
    return _collection

def get_embedding():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return _embedding_model