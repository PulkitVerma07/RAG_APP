export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error'

export interface RagDocument {
  id: string
  name: string
  sizeBytes: number
  pages: number
  chunks: number
  status: DocumentStatus
  progress: number
  addedAt: number
  errorMessage?: string
}

export interface RetrievedSource {
  id: string
  documentId?: string
  documentName: string
  page: number
  chunk: string
  score: number
}

export type QueryPhase =
  | 'idle'
  | 'retrieving'
  | 'generating'
  | 'complete'
  | 'error'

export interface QueryResult {
  question: string
  answer: string
  sources: RetrievedSource[]
}
