from backend.app.core.config import get_embedding, get_vectordb

model = get_embedding()
collection = get_vectordb()

def retreiving_question(question: str, top_k: int = 4):
    question_embedding = list(model.embed([question]))[0].tolist()
    
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )
    
    docs = results["documents"][0] if results["documents"] else []
    metas = results["metadatas"][0] if results["metadatas"] else []
    dists = results["distances"][0] if results["distances"] else []
    
    sources = []
    for doc, meta, dist in zip(docs, metas, dists):
        sources.append({
            "id": meta.get("document_id"),
            "documentName": meta.get("document_name", "Unknown"),
            "chunk": doc,
            "page": 1,
            "score": round(1 / (1 + dist), 4),
        })
        
    context = "\n\n".join(docs)
    return {"context": context, "sources": sources}