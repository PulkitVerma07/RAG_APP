'use client'

import { AnimatePresence, motion } from 'motion/react'
import { FolderOpen } from 'lucide-react'
import { Logo } from './logo'
import { UploadZone } from './upload-zone'
import { DocumentListItem } from './document-list-item'
import type { RagDocument } from '@/lib/types'

interface SidebarProps {
  documents: RagDocument[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onFiles: (files: File[]) => void
}

export function Sidebar({
  documents,
  selectedId,
  onSelect,
  onRemove,
  onFiles,
}: SidebarProps) {
  const readyCount = documents.filter((d) => d.status === 'ready').length

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
        <Logo />
      </div>

      <div className="shrink-0 p-3">
        <UploadZone onFiles={onFiles} />
      </div>

      <div className="flex items-center justify-between px-4 pb-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          Documents
        </span>
        {documents.length > 0 && (
          <span className="font-mono text-[10.5px] text-muted-foreground">
            {readyCount}/{documents.length} ready
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {documents.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-dashed border-sidebar-border/70 px-4 py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg border border-sidebar-border bg-secondary/40 text-muted-foreground">
              <FolderOpen className="size-4.5" />
            </div>
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-foreground">
                No documents yet
              </p>
              <p className="text-pretty text-[11.5px] leading-relaxed text-muted-foreground">
                Upload a PDF to start asking questions about its contents.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {documents.map((doc) => (
                <DocumentListItem
                  key={doc.id}
                  document={doc}
                  selected={doc.id === selectedId}
                  onSelect={onSelect}
                  onRemove={onRemove}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Frontend preview · no backend connected
        </div>
      </div>
    </div>
  )
}
