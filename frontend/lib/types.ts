export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error'

export interface RagDocument {
  id: string
  name: string
  sizeBytes: number
  pages: number
  chunks: number
  status: DocumentStatus
  progress: number // 0 - 100, used during uploading / processing
  addedAt: number
  errorMessage?: string
}

export interface RetrievedSource {
  id: string
  documentId?: string
  documentName: string
  page: number
  chunk: string
  score: number // 0 - 1 relevance
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
