'use client'

import { useEffect, useRef } from 'react'

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 创建粒子
    const particleCount = 30
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.animationDelay = `${Math.random() * 10}s`
      particle.style.animationDuration = `${8 + Math.random() * 6}s`
      particle.style.width = `${2 + Math.random() * 4}px`
      particle.style.height = particle.style.width
      container.appendChild(particle)
    }

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return <div ref={containerRef} className="particles-container" />
}
