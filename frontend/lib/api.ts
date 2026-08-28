const API_URL = "http://127.0.0.1:8000"

export interface UploadResponse {
  id: string
  name: string
  pages: number
  chunks: number
  status: "ready"
}

export interface RetrievedSource {
  id: string
  documentName: string
  chunk: string
  page: number
  score: number
}

export interface QueryResponse {
  question: string
  answer: string
  sources: RetrievedSource[]
}

export async function uploadDocument(
  file: File
): Promise<UploadResponse> {
  const formData = new FormData()

  formData.append("file", file)

  const response = await fetch(
    `${API_URL}/upload_file`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      `Upload failed: ${message || response.statusText}`
    )
  }

  return response.json()
}

export async function askQuestion(
  question: string
): Promise<QueryResponse> {
  const response = await fetch(
    `${API_URL}/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  )

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      `Question failed: ${message || response.statusText}`
    )
  }

  return response.json()
}