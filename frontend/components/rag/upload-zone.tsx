'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Plus, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  onFiles: (files: File[]) => void
}

export function UploadZone({ onFiles }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    const files = Array.from(fileList).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
    )
    if (files.length) onFiles(files)
  }

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault()
        dragDepth.current += 1
        setDragging(true)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault()
        dragDepth.current -= 1
        if (dragDepth.current <= 0) setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        dragDepth.current = 0
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload PDF document"
        aria-describedby="upload-hint"
        className={cn(
          'group relative flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-5 text-center transition-colors outline-none focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-primary/20',
          dragging
            ? 'border-primary/70 bg-primary/[0.08]'
            : 'border-border bg-card/30 hover:border-primary/40 hover:bg-card/60',
        )}
      >
        <motion.div
          animate={dragging ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn(
            'flex size-9 items-center justify-center rounded-lg border transition-colors',
            dragging
              ? 'border-primary/40 bg-primary/15 text-primary'
              : 'border-border bg-secondary/60 text-muted-foreground group-hover:text-primary',
          )}
        >
          {dragging ? (
            <UploadCloud className="size-4.5" />
          ) : (
            <Plus className="size-4.5" />
          )}
        </motion.div>
        <div className="space-y-0.5">
          <p className="text-[13px] font-medium text-foreground">
            {dragging ? 'Drop to upload' : 'New document'}
          </p>
          <p id="upload-hint" className="font-mono text-[10.5px] text-muted-foreground">
            Drag &amp; drop or click · PDF
          </p>
        </div>
      </button>
    </div>
  )
}
