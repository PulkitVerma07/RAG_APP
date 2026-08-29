import os
from fastembed import TextEmbedding
import chromadb


# LLM
def LLm():
    api_key = os.getenv("GEMINI_API_KEY")

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": api_key
    }

    return url, headers


def VectroDb():
    client = chromadb.PersistentClient(path="./vector_db")
    collection = client.get_or_create_collection(name="vector_db")
    return collection


def get_embedding():
    model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return model