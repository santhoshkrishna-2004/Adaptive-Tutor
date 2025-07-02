"use client"

import { useEffect, useState } from "react"

export function OceanWaves() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.02)
    }, 16)

    return () => clearInterval(interval)
  }, [])

  const generateWave = (amplitude: number, frequency: number, phase: number) => {
    const points = []
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + amplitude * Math.sin(((x * frequency + phase + time * 50) * Math.PI) / 180)
      points.push(`${x},${y}`)
    }
    return points.join(" ")
  }

  return (
    <div className="ocean-waves">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Multiple wave layers */}
        {[
          { amplitude: 5, frequency: 2, phase: 0, opacity: 0.6 },
          { amplitude: 3, frequency: 3, phase: 60, opacity: 0.4 },
          { amplitude: 2, frequency: 4, phase: 120, opacity: 0.3 },
        ].map((wave, index) => (
          <polyline
            key={index}
            points={generateWave(wave.amplitude, wave.frequency, wave.phase)}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            opacity={wave.opacity}
          />
        ))}
      </svg>
    </div>
  )
}
