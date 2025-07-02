"use client"

import { useEffect, useState } from "react"

export function AuroraLights() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.01)
    }, 16)

    return () => clearInterval(interval)
  }, [])

  const generateAuroraPath = (baseY: number, amplitude: number, frequency: number) => {
    const points = []
    for (let x = 0; x <= 100; x += 2) {
      const y = baseY + amplitude * Math.sin(((x * frequency + time * 100) * Math.PI) / 180)
      points.push(`${x},${y}`)
    }
    return points.join(" ")
  }

  return (
    <div className="aurora-lights">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#764ba2" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f093fb" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="aurora2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f093fb" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#f5576c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4facfe" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Aurora bands */}
        <polyline
          points={generateAuroraPath(30, 8, 1.5)}
          fill="none"
          stroke="url(#aurora1)"
          strokeWidth="4"
          style={{
            filter: "blur(2px)",
            animation: "aurora-wave 6s ease-in-out infinite",
          }}
        />

        <polyline
          points={generateAuroraPath(50, 6, 2)}
          fill="none"
          stroke="url(#aurora2)"
          strokeWidth="3"
          style={{
            filter: "blur(1px)",
            animation: "aurora-wave 8s ease-in-out infinite reverse",
          }}
        />

        <polyline
          points={generateAuroraPath(70, 4, 2.5)}
          fill="none"
          stroke="url(#aurora1)"
          strokeWidth="2"
          style={{
            filter: "blur(1px)",
            animation: "aurora-wave 10s ease-in-out infinite",
          }}
        />
      </svg>
    </div>
  )
}
