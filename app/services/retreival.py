
from app.core.config import embedding_model,VectroDb


def retreiving_question(question):
    model = embedding_model()
    collection = VectroDb()
    question_embeddings = model.encode(question)
    retrieved_chunks_list=collection.query(query_embeddings=question_embeddings,n_results=10)
    retreived_text = '\n\n'.join(retrieved_chunks_list['documents'][0])
    return retreived_text
    

