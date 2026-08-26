from sentence_transformers import SentenceTransformer,util

model  = SentenceTransformer('all-MiniLM-L6-v2')

sentences = [
    'hi',
    'hi'
]

embeddings = model.encode(sentences)
similarity = util.cos_sim(embeddings[0],embeddings[1])
print(f"Similarity score: {similarity.item():.4f}")