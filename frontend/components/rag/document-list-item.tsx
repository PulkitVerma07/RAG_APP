'use client'

import { motion } from 'motion/react'
import { AlertCircle, FileText, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBytes, formatRelativeTime } from '@/lib/mock'
import type { RagDocument } from '@/lib/types'

interface DocumentListItemProps {
  document: RagDocument
  selected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

const statusLabel: Record<RagDocument['status'], string> = {
  uploading: 'Uploading',
  processing: 'Processing',
  ready: 'Ready',
  error: 'Failed',
}

export function DocumentListItem({
  document,
  selected,
  onSelect,
  onRemove,
}: DocumentListItemProps) {
  const busy = document.status === 'uploading' || document.status === 'processing'
  const isError = document.status === 'error'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <button
        type="button"
        onClick={() => onSelect(document.id)}
        aria-current={selected}
        className={cn(
          'group relative w-full overflow-hidden rounded-lg border px-3 py-2.5 text-left transition-colors',
          selected
            ? 'border-primary/40 bg-primary/[0.07]'
            : 'border-border bg-card/40 hover:border-border/80 hover:bg-card',
        )}
      >
        {/* Gemini-style traveling glow border on hover */}
        <span
          aria-hidden
          className="doc-glow-border pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-px rounded-[7px] transition-opacity duration-300',
            selected ? 'bg-card' : 'bg-card/95',
            'opacity-0 group-hover:opacity-100',
          )}
        />

        {selected && (
          <motion.span
            layoutId="doc-active-rail"
            className="absolute inset-y-1.5 left-0 z-10 w-0.5 rounded-full bg-primary"
          />
        )}
        <div className="relative z-10 flex items-start gap-2.5">
          <div
            className={cn(
              'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border',
              isError
                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                : 'border-border bg-secondary/60 text-muted-foreground',
            )}
          >
            {isError ? (
              <AlertCircle className="size-3.5" />
            ) : (
              <FileText className="size-3.5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">
              {document.name}
            </p>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
              {busy ? (
                <span className="flex items-center gap-1 text-primary">
                  <Loader2 className="size-2.5 animate-spin" />
                  {statusLabel[document.status]}
                </span>
              ) : isError ? (
                <span className="text-destructive">
                  {document.errorMessage ?? 'Failed'}
                </span>
              ) : (
                <>
                  <span>{formatBytes(document.sizeBytes)}</span>
                  <span className="text-border">·</span>
                  <span>{document.pages}p</span>
                  <span className="text-border">·</span>
                  <span>{document.chunks} chunks</span>
                </>
              )}
            </div>
          </div>

          {!busy && (
            <span
              role="button"
              tabIndex={0}
              aria-label={`Remove ${document.name}`}
              onClick={(e) => {
                e.stopPropagation()
                onRemove(document.id)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemove(document.id)
                }
              }}
              className="flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
            >
              <X className="size-3" />
            </span>
          )}
        </div>

        {busy && (
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${document.progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        )}

        {!busy && !isError && (
          <span className="mt-1.5 block font-mono text-[10px] text-muted-foreground/70">
            {formatRelativeTime(document.addedAt)}
          </span>
        )}
      </button>
    </motion.div>
  )
}
