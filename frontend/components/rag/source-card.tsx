'use client'

import { motion } from 'motion/react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RetrievedSource } from '@/lib/types'

interface SourceCardProps {
  source: RetrievedSource
  index: number
}

function scoreTone(score: number) {
  if (score >= 0.8) return 'text-primary border-primary/30 bg-primary/10'
  if (score >= 0.6) return 'text-chart-2 border-chart-2/30 bg-chart-2/10'
  return 'text-muted-foreground border-border bg-secondary/60'
}

export function SourceCard({ source, index }: SourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: 'easeOut' }}
      className="group rounded-lg border border-border bg-card/60 p-3.5 transition-colors hover:border-border/90 hover:bg-card"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/60 font-mono text-[10px] text-muted-foreground">
            {index + 1}
          </span>
          <FileText className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-[12.5px] font-medium text-foreground">
            {source.documentName}
          </span>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10px] tabular-nums',
            scoreTone(source.score),
          )}
        >
          {source.score.toFixed(2)}
        </span>
      </div>

      <p className="mt-2.5 line-clamp-3 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
        {source.chunk}
      </p>

      <div className="mt-2.5 flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground/80">
        <span>Page {source.page}</span>
        <span className="text-border">·</span>
        <span>relevance {Math.round(source.score * 100)}%</span>
      </div>
    </motion.div>
  )
}
