import type { RetrievedSource } from './types'

const API_URL = "https://rag-app-dtsi.onrender.com" 

export interface UploadResponse {
  id: string
  name: string
  pages: number
  chunks: number
  status: "ready"
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("file", file)
  const response = await fetch(`${API_URL}/upload_file`, {
    method: "POST",
    body: formData,
  })
  if (!response.ok) {
    const msg = await response.text()
    throw new Error(`Upload failed: ${msg || response.statusText}`)
  }
  return response.json()
}

export async function askQuestionStream(
  question: string,
  onSources: (sources: RetrievedSource[]) => void,
  onToken: (token: string) => void
): Promise<void> {
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  })

  if (!response.ok) {
    const errorMsg = await response.text()
    throw new Error(errorMsg || "Failed to process query")
  }
  if (!response.body) throw new Error("No response body received")

  const reader = response.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const payload = JSON.parse(line.slice(6).trim())
          if (payload.type === "sources") {
            onSources(payload.data)
          } else if (payload.type === "token") {
            onToken(payload.data)
          }
        } catch {
          
        }
      }
    }
  }
}