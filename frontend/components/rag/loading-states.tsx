'use client'

import { motion } from 'motion/react'
import { Loader2, Search, Sparkles } from 'lucide-react'
import type { QueryPhase } from '@/lib/types'

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-secondary/70 ${className ?? ''}`}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
      />
    </div>
  )
}

const phaseCopy: Record<'retrieving' | 'generating', { label: string; icon: typeof Search }> = {
  retrieving: { label: 'Retrieving relevant passages', icon: Search },
  generating: { label: 'Generating grounded answer', icon: Sparkles },
}

export function QueryLoadingState({
  phase,
}: {
  phase: Extract<QueryPhase, 'retrieving' | 'generating'>
}) {
  const { label, icon: Icon } = phaseCopy[phase]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card/50 px-4 py-3">
        <span className="flex size-6 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
          <Icon className="size-3.5" />
        </span>
        <span className="text-[13px] font-medium text-foreground">{label}</span>
        <Loader2 className="ml-auto size-3.5 animate-spin text-muted-foreground" />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <Shimmer className="h-3.5 w-1/3" />
        <div className="space-y-2 pt-1">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-[92%]" />
          <Shimmer className="h-4 w-[97%]" />
          <Shimmer className="h-4 w-3/4" />
        </div>
      </div>

      {phase === 'generating' && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2.5 rounded-lg border border-border bg-card/60 p-3.5">
              <Shimmer className="h-3 w-2/3" />
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
