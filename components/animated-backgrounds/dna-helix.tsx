"use client"

import { useEffect, useState } from "react"

export function DNAHelix() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.02)
    }, 16)

    return () => clearInterval(interval)
  }, [])

  const generateHelixPoints = (strand: number) => {
    const points = []
    const radius = 50
    const height = 400
    const turns = 3

    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const angle = t * turns * 2 * Math.PI + strand * Math.PI + time
      const x = 50 + radius * Math.cos(angle)
      const y = t * height
      points.push(`${x},${y}`)
    }

    return points.join(" ")
  }

  return (
    <div className="dna-helix">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 400">
        {/* DNA Strand 1 */}
        <polyline points={generateHelixPoints(0)} fill="none" stroke="#667eea" strokeWidth="2" opacity="0.6" />

        {/* DNA Strand 2 */}
        <polyline points={generateHelixPoints(1)} fill="none" stroke="#764ba2" strokeWidth="2" opacity="0.6" />

        {/* Base pairs */}
        {Array.from({ length: 20 }, (_, i) => {
          const t = i / 19
          const angle1 = t * 3 * 2 * Math.PI + time
          const angle2 = t * 3 * 2 * Math.PI + Math.PI + time
          const x1 = 50 + 50 * Math.cos(angle1)
          const x2 = 50 + 50 * Math.cos(angle2)
          const y = t * 400

          return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="#f093fb" strokeWidth="1" opacity="0.4" />
        })}
      </svg>
    </div>
  )
}
