from backend.app.core.config import get_embedding, VectroDb


def retreiving_question(question):
    model = get_embedding()
    collection = VectroDb()
    question_embedding = list(model.embed([question]))[0].tolist()

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=10,
        include=["documents", "metadatas", "distances"],
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    sources = []

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances,
    ):
        sources.append(
            {
                "id": metadata["document_id"],
                "documentName": metadata["document_name"],
                "chunk": document,
                "page": 1,
                "score": 1 / (1 + distance),
            }
        )

    context = "\n\n".join(documents)

    return {
        "context": context,
        "sources": sources,
    }