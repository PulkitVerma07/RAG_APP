'use client'

import { useEffect, useRef, useState } from 'react'

interface TypingTextProps {
  lines: string[]
  className?: string
}

const WORD_MS = 300
const HOLD_MS = 5200
const BETWEEN_LINES_MS = 1300

/**
 * Cycles through several lines with a typewriter effect: types a line,
 * holds it, deletes it, then advances to the next.
 */
export function TypingText({ lines, className }: TypingTextProps) {
  const [display, setDisplay] = useState('')
  const [index, setIndex] = useState(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReduced) {
      setDisplay(lines[index % lines.length])
      timeout.current = setTimeout(
        () => setIndex((i) => (i + 1) % lines.length),
        HOLD_MS + 800,
      )
      return () => {
        if (timeout.current) clearTimeout(timeout.current)
      }
    }

    const words = lines[index % lines.length].trim().split(/\s+/)
    let phase: 'typing' | 'holding' | 'deleting' = 'typing'
    let wordCount = 0

    function step() {
      if (phase === 'typing') {
        wordCount += 1
        setDisplay(words.slice(0, wordCount).join(' '))
        if (wordCount < words.length) {
          timeout.current = setTimeout(step, WORD_MS)
        } else {
          phase = 'holding'
          timeout.current = setTimeout(step, HOLD_MS)
        }
        return
      }

      if (phase === 'holding') {
        phase = 'deleting'
        timeout.current = setTimeout(step, WORD_MS)
        return
      }

      wordCount -= 1
      setDisplay(words.slice(0, wordCount).join(' '))
      if (wordCount > 0) {
        timeout.current = setTimeout(step, WORD_MS)
      } else {
        timeout.current = setTimeout(
          () => setIndex((i) => (i + 1) % lines.length),
          BETWEEN_LINES_MS,
        )
      }
    }

    timeout.current = setTimeout(step, WORD_MS)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [index, lines])

  return (
    <span className={className}>
      {display}
      <span className="type-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-primary align-middle" />
    </span>
  )
}
