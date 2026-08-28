import os
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


def embedding_model():
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer(
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    return model