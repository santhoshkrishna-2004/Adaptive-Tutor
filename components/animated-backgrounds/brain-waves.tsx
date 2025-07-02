"use client"

import { useEffect, useState } from "react"

export function BrainWaves() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.05)
    }, 16)

    return () => clearInterval(interval)
  }, [])

  const generateBrainWave = (frequency: number, amplitude: number, phase: number) => {
    const points = []
    for (let x = 0; x <= 100; x += 1) {
      const y = 50 + amplitude * Math.sin(((x * frequency + phase + time * 10) * Math.PI) / 180)
      points.push(`${x},${y}`)
    }
    return points.join(" ")
  }

  return (
    <div className="brain-waves">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#764ba2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#667eea" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Brain wave patterns */}
        {[
          { frequency: 8, amplitude: 5, phase: 0, strokeWidth: 2 },
          { frequency: 12, amplitude: 3, phase: 45, strokeWidth: 1.5 },
          { frequency: 16, amplitude: 2, phase: 90, strokeWidth: 1 },
          { frequency: 20, amplitude: 1.5, phase: 135, strokeWidth: 0.8 },
        ].map((wave, index) => (
          <polyline
            key={index}
            points={generateBrainWave(wave.frequency, wave.amplitude, wave.phase)}
            fill="none"
            stroke="url(#brainGradient)"
            strokeWidth={wave.strokeWidth}
            opacity={0.7 - index * 0.1}
            style={{
              animation: `brain-pulse ${3 + index}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Neural network nodes */}
        {Array.from({ length: 15 }, (_, i) => (
          <circle
            key={i}
            cx={Math.random() * 100}
            cy={Math.random() * 100}
            r="1"
            fill="#764ba2"
            opacity="0.6"
            style={{
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
