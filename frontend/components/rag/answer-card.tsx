'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Copy, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnswerCardProps {
  question: string
  answer: string
}

export function AnswerCard({ question, answer }: AnswerCardProps) {
  const [copied, setCopied] = useState(false)

  const paragraphs = answer.split('\n\n').filter(Boolean)

  function copy() {
    navigator.clipboard?.writeText(answer)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Answer
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3 text-primary" />
          ) : (
            <Copy className="size-3" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="px-5 py-4">
        <p className="mb-3 text-pretty text-[13px] font-medium text-muted-foreground">
          {question}
        </p>
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
              className={cn(
                'text-pretty leading-relaxed text-foreground',
                i === 0 ? 'text-[15px]' : 'text-[14px] text-foreground/90',
              )}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
