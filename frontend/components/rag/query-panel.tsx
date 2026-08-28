'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  AlertTriangle,
  ArrowUp,
  FileQuestion,
  Layers,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SUGGESTED_QUESTIONS } from '@/lib/mock'
import type { QueryPhase, QueryResult } from '@/lib/types'
import { AnswerCard } from './answer-card'
import { SourceCard } from './source-card'
import { QueryLoadingState } from './loading-states'
import { ParticleField } from './particle-field'
import { TypingText } from './typing-text'

const ROTATING_LINES = [
  'Retrieves the most relevant passages from your corpus.',
  'Generates grounded answers with cited source evidence.',
  'Semantic search across every chunk, in milliseconds.',
  'No hallucinations — every claim traces back to a page.',
]

interface QueryPanelProps {
  hasReadyDocuments: boolean
  readyCount: number
  phase: QueryPhase
  result: QueryResult | null
  error: string | null
  onAsk: (question: string) => void
  onRetry: () => void
}

export function QueryPanel({
  hasReadyDocuments,
  readyCount,
  phase,
  result,
  error,
  onAsk,
  onRetry,
}: QueryPanelProps) {
  const [question, setQuestion] = useState('')
  const busy = phase === 'retrieving' || phase === 'generating'
  const canAsk = hasReadyDocuments && question.trim().length > 0 && !busy

  function submit() {
    if (!canAsk) return
    onAsk(question.trim())
  }

  return (
    <div className="relative isolate mx-auto flex w-full max-w-3xl flex-col gap-6 overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <ParticleField
        active={busy}
        paused={question.trim().length > 0}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-80"
      />
      <header className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
          <Layers className="size-3.5" />
          Retrieval-Augmented Generation
        </div>
        <h1 className="text-balance font-mono text-2xl font-semibold uppercase tracking-tight text-foreground sm:text-[32px]">
          Ask your documents anything
        </h1>
        <p className="min-h-[2.9rem] max-w-xl text-pretty font-mono text-[13.5px] leading-relaxed text-muted-foreground">
          <TypingText lines={ROTATING_LINES} />
        </p>
      </header>

      {/* Input — continuously running glow border + moving particle field */}
      <div className="relative rounded-2xl p-[3px]">
        {/* A restrained traveling color band stays on the outer edge only. */}
        <div
          aria-hidden="true"
          data-busy={busy}
          className="ask-glow-border pointer-events-none absolute inset-0 rounded-2xl opacity-90"
        />
        <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-background">
          <div className="relative z-10">
            <label htmlFor="document-question" className="sr-only">
              Ask a question about your documents
            </label>
            <textarea
          id="document-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              submit()
            }
          }}
          disabled={!hasReadyDocuments}
          rows={3}
          placeholder={
            hasReadyDocuments
              ? 'e.g. What are the key findings and how were they measured?'
              : 'Upload and process a document to begin…'
          }
          className="w-full resize-none bg-transparent px-4 pt-4 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-3 px-3 pb-3">
          <span className="pl-1 font-mono text-[10.5px] text-muted-foreground">
            {hasReadyDocuments ? (
              <>
                {readyCount} document{readyCount === 1 ? '' : 's'} in context ·{' '}
                <kbd className="rounded border border-border bg-secondary/60 px-1">
                  ⏎
                </kbd>{' '}
                to ask
              </>
            ) : (
              'No documents ready'
            )}
          </span>
          <Button
            size="sm"
            onClick={submit}
            disabled={!canAsk}
            className="gap-1.5"
          >
            Ask
            <ArrowUp className="size-3.5" />
          </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {hasReadyDocuments && phase === 'idle' && !result && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuestion(q)}
              className="rounded-full border border-border bg-card/50 px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Result area */}
      <div className="min-h-0">
        <AnimatePresence mode="wait">
          {phase === 'error' && error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/[0.06] p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-4" />
                </span>
                <div>
                  <p className="text-[14px] font-medium text-foreground">
                    Something went wrong
                  </p>
                  <p className="text-[12.5px] text-muted-foreground">{error}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={onRetry} className="gap-1.5">
                <RotateCcw className="size-3.5" />
                Try again
              </Button>
            </motion.div>
          ) : busy ? (
            <QueryLoadingState key={phase} phase={phase} />
          ) : phase === 'complete' && result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <AnswerCard question={result.question} answer={result.answer} />

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Retrieved sources
                  </h2>
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    {result.sources.length} passages
                  </span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {result.sources.map((source, i) => (
                    <SourceCard key={`${source.id}-${i}`} source={source} index={i} />
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            !hasReadyDocuments && (
              <EmptyState key="empty" />
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-background px-6 py-12 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-secondary/50 text-muted-foreground">
        <FileQuestion className="size-5" />
      </div>
      <div className="max-w-sm space-y-1.5">
        <p className="text-[15px] font-medium text-foreground">
          Start by uploading a document
        </p>
        <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
          Add a PDF from the sidebar. Once it&apos;s processed, ask a question and
          Lumen will retrieve the relevant passages and answer from them.
        </p>
      </div>
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <span className="rounded-md border border-border bg-secondary/50 px-2 py-1">
          1 · Upload
        </span>
        <span className="text-border">→</span>
        <span className="rounded-md border border-border bg-secondary/50 px-2 py-1">
          2 · Process
        </span>
        <span className="text-border">→</span>
        <span className="rounded-md border border-border bg-secondary/50 px-2 py-1">
          3 · Ask
        </span>
      </div>
    </motion.div>
  )
}
