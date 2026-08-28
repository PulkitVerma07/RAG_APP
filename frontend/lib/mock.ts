import type { QueryResult, RagDocument, RetrievedSource } from './types'

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const SAMPLE_CHUNKS = [
  'The system architecture relies on a retrieval layer that indexes document embeddings into a vector store, enabling semantic search over the ingested corpus rather than exact keyword matching.',
  'During ingestion, each document is split into overlapping chunks of approximately 500 tokens. Overlap preserves context across boundaries so that answers spanning multiple passages remain coherent.',
  'Relevance is scored using cosine similarity between the query embedding and each stored chunk embedding. Only the top-ranked passages are passed to the generation model as grounding context.',
  'To reduce hallucination, the model is instructed to answer strictly from the retrieved context and to explicitly state when the provided evidence is insufficient to produce a confident answer.',
  'Latency is dominated by the embedding and retrieval steps for large corpora. Caching frequent queries and pre-warming the index materially improves the perceived response time for end users.',
  'Access control is enforced at the document level. A user can only retrieve passages from documents they have been granted permission to read, and scoping is applied before retrieval executes.',
]

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const out: T[] = []
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

/** Simulates a RAG answer + retrieved sources for a given question. */
export function generateMockResult(
  question: string,
  documents: RagDocument[],
): QueryResult {
  const ready = documents.filter((d) => d.status === 'ready')
  const chunkCount = Math.min(4, Math.max(2, ready.length + 1))
  const chunks = pick(SAMPLE_CHUNKS, chunkCount)

  const sources: RetrievedSource[] = chunks.map((chunk, i) => {
    const doc = ready[i % ready.length] ?? ready[0]
    return {
      id: `src-${Date.now()}-${i}`,
      documentId: doc.id,
      documentName: doc.name,
      page: 1 + Math.floor(Math.random() * Math.max(1, doc.pages)),
      chunk,
      score: Number.parseFloat((0.92 - i * 0.11 - Math.random() * 0.03).toFixed(2)),
    }
  })

  const answer = [
    `Based on the retrieved passages, ${question.trim().replace(/\?+$/, '')} can be addressed as follows.`,
    chunks[0],
    chunks[1]
      ? `Additionally, ${chunks[1].charAt(0).toLowerCase()}${chunks[1].slice(1)}`
      : '',
    'These conclusions are drawn directly from the source evidence listed below.',
  ]
    .filter(Boolean)
    .join('\n\n')

  return { question, answer, sources }
}

export const SUGGESTED_QUESTIONS = [
  'Summarize the key findings in this document',
  'What are the main risks mentioned?',
  'How does the retrieval pipeline work?',
  'What conclusions can be drawn from the data?',
]
