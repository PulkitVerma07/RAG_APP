'use client'

import { useEffect, useRef } from 'react'

interface ParticleFieldProps { active: boolean; paused?: boolean; className?: string }
interface Dot { x: number; y: number; vx: number; vy: number; r: number }

export function ParticleField({ active, paused = false, className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const pausedRef = useRef(paused)
  const intensityRef = useRef(0)

  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !parent || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const styles = getComputedStyle(document.documentElement)
    const primary = styles.getPropertyValue('--primary').trim() || '#4cc2ff'
    const accent = styles.getPropertyValue('--chart-2').trim() || '#5fd0e0'
    let dots: Dot[] = []
    let width = 0; let height = 0; let dpr = 1; let raf = 0; let visible = true

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      if (rect.width === width && rect.height === height) return
      width = rect.width; height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr)); canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(28, Math.min(96, Math.round((width * height) / 8000)))
      dots = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: 0.8 + Math.random() * 1.4 }))
    }
    const colorWithAlpha = (color: string, alpha: number) => color.startsWith('oklch') ? `oklch(${color.slice(color.indexOf('(') + 1, color.lastIndexOf(')'))} / ${alpha})` : color
    const tick = () => {
      raf = 0
      if (!visible || pausedRef.current) return
      const intensity = intensityRef.current += ((activeRef.current ? 1 : 0) - intensityRef.current) * 0.06
      ctx.clearRect(0, 0, width, height)
      const idleLinkDist = 72
      const linkDist = activeRef.current ? 150 : idleLinkDist
      const linkStrength = activeRef.current ? intensity * 0.52 : 0.16
      const speed = reduced.matches ? 0 : 1 - intensity * 0.55
      for (const dot of dots) { dot.x += dot.vx * speed; dot.y += dot.vy * speed; if (dot.x < 0 || dot.x > width) dot.vx *= -1; if (dot.y < 0 || dot.y > height) dot.vy *= -1; dot.x = Math.max(0, Math.min(width, dot.x)); dot.y = Math.max(0, Math.min(height, dot.y)) }
      for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) { const a = dots[i]; const b = dots[j]; const dist = Math.hypot(a.x - b.x, a.y - b.y); if (dist > linkDist) continue; const alpha = (1 - dist / linkDist) * linkStrength; ctx.strokeStyle = colorWithAlpha(accent, alpha); ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() }
      for (const dot of dots) { const glow = 0.24 + intensity * 0.46; ctx.fillStyle = colorWithAlpha(primary, glow); ctx.shadowBlur = intensity > 0.15 ? 8 * intensity : 0; ctx.shadowColor = colorWithAlpha(primary, 0.8); ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r + intensity * 0.8, 0, Math.PI * 2); ctx.fill() }
      ctx.shadowBlur = 0; raf = requestAnimationFrame(tick)
    }
    const start = () => { if (!raf && visible) raf = requestAnimationFrame(tick) }
    resize(); start()
    const observer = new ResizeObserver(resize); observer.observe(parent)
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else if (raf) { cancelAnimationFrame(raf); raf = 0 } })
    visibility.observe(canvas)
    const motionChange = () => start()
    reduced.addEventListener('change', motionChange)
    return () => { if (raf) cancelAnimationFrame(raf); observer.disconnect(); visibility.disconnect(); reduced.removeEventListener('change', motionChange) }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
