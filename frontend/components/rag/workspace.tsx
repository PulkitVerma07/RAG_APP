'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PanelLeft, X } from 'lucide-react'

import { Logo } from './logo'
import { Sidebar } from './sidebar'
import { QueryPanel } from './query-panel'

import type {
  QueryPhase,
  QueryResult,
  RagDocument,
} from '@/lib/types'

import {
  uploadDocument,
  askQuestionStream, 
} from '@/lib/api'


export function Workspace() {
  const [documents, setDocuments] = useState<RagDocument[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [phase, setPhase] =
    useState<QueryPhase>('idle')

  const [result, setResult] =
    useState<QueryResult | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const [mobileNavOpen, setMobileNavOpen] =
    useState(false)

  const lastQuestion = useRef('')


  // =========================
  // UPLOAD DOCUMENT
  // =========================

  const handleFiles = useCallback(
    async (files: File[]) => {

      for (const file of files) {

        const temporaryId = crypto.randomUUID()

        const temporaryDocument: RagDocument = {
          id: temporaryId,
          name: file.name,
          sizeBytes: file.size,
          pages: 0,
          chunks: 0,
          status: 'uploading',
          progress: 0,
          addedAt: Date.now(),
        }

        setDocuments((docs) => [
          temporaryDocument,
          ...docs,
        ])

        setSelectedId((current) =>
          current ?? temporaryId
        )


        try {

          const uploaded =
            await uploadDocument(file)


          setDocuments((docs) =>
            docs.map((doc) =>
              doc.id === temporaryId
                ? {
                    ...doc,
                    id: uploaded.id,
                    name: uploaded.name,
                    pages: uploaded.pages,
                    chunks: uploaded.chunks,
                    status: 'ready',
                    progress: 100,
                  }
                : doc
            )
          )

          setSelectedId((current) =>
            current === temporaryId
              ? uploaded.id
              : current
          )

        } catch (err) {

          const message =
            err instanceof Error
              ? err.message
              : 'Upload failed'

          setDocuments((docs) =>
            docs.map((doc) =>
              doc.id === temporaryId
                ? {
                    ...doc,
                    status: 'error',
                    errorMessage: message,
                  }
                : doc
            )
          )
        }
      }
    },
    []
  )
 


  

  const handleRemove = useCallback(
    (id: string) => {

      setDocuments((docs) =>
        docs.filter((doc) => doc.id !== id)
      )

      setSelectedId((current) =>
        current === id ? null : current
      )
    },
    []
  )


  // =========================
  // ASK QUESTION (STREAMING)
  // =========================
  const runQuery = useCallback(
    async (question: string) => {
      lastQuestion.current = question
      setError(null)
      setPhase('retrieving')

      setResult({
        question,
        answer: '',
        sources: [],
      })

      try {
        await askQuestionStream(
          question,
          (sources) => {
            setPhase('generating')
            setResult((prev) => (prev ? { ...prev, sources } : null))
          },
          (token) => {
            setPhase('generating')
            setResult((prev) =>
              prev ? { ...prev, answer: prev.answer + token } : null
            )
          }
        )
        setPhase('complete')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong'
        setError(message)
        setPhase('error')
      }
    },
    []
  )

  // =========================
  // RETRY
  // =========================
  const handleRetry = useCallback(() => {
    if (lastQuestion.current) {
      runQuery(lastQuestion.current)
    }
  }, [runQuery])


  const readyCount = documents.filter((doc) => doc.status === 'ready').length

  

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">

      {/* Desktop sidebar */}

      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border md:block">

        <Sidebar
          documents={documents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRemove={handleRemove}
          onFiles={handleFiles}
        />

      </aside>


      {/* Mobile sidebar */}

      <AnimatePresence>

        {mobileNavOpen && (
          <>
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setMobileNavOpen(false)
              }
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
            />

            <motion.aside
              aria-label="Document navigation"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 34,
              }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border md:hidden"
            >

              <button
                type="button"
                onClick={() =>
                  setMobileNavOpen(false)
                }
                aria-label="Close document menu"
                className="absolute right-3 top-3.5 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>


              <Sidebar
                documents={documents}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id)
                  setMobileNavOpen(false)
                }}
                onRemove={handleRemove}
                onFiles={handleFiles}
              />

            </motion.aside>
          </>
        )}

      </AnimatePresence>


      {/* Main */}

      <main className="flex min-w-0 flex-1 flex-col">

        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 md:hidden">

          <button
            type="button"
            onClick={() =>
              setMobileNavOpen(true)
            }
            aria-label="Open document menu"
            className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <PanelLeft className="size-4" />
          </button>

          <Logo />

        </div>


        <div className="min-h-0 flex-1 overflow-y-auto">

          <QueryPanel
            hasReadyDocuments={readyCount > 0}
            readyCount={readyCount}
            phase={phase}
            result={result}
            error={error}
            onAsk={runQuery}
            onRetry={handleRetry}
          />

        </div>

      </main>

    </div>
  )
}