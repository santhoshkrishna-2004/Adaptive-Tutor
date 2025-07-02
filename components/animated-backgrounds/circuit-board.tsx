"use client"

import { useEffect, useState } from "react"

export function CircuitBoard() {
  const [pulses, setPulses] = useState<Array<{ id: number; delay: number }>>([])

  useEffect(() => {
    const newPulses = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
    }))
    setPulses(newPulses)
  }, [])

  return (
    <div className="circuit-board">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Circuit paths */}
        <defs>
          <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 0 10 L 10 10 L 10 0 M 10 10 L 20 10 M 10 10 L 10 20"
              stroke="#00ff00"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
            <circle cx="10" cy="10" r="1" fill="#00ff00" opacity="0.5" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuit)" />

        {/* Pulsing nodes */}
        {pulses.map((pulse) => (
          <circle
            key={pulse.id}
            cx={Math.random() * 100}
            cy={Math.random() * 100}
            r="2"
            fill="#00ff00"
            style={{
              animation: `circuit-pulse 2s ease-in-out infinite`,
              animationDelay: `${pulse.delay}s`,
            }}
          />
        ))}

        {/* Data flow lines */}
        <path
          d="M 0 25 Q 25 25 50 50 T 100 75"
          stroke="#00ff00"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          strokeDasharray="5,5"
          style={{
            animation: "circuit-pulse 3s linear infinite",
          }}
        />
      </svg>
    </div>
  )
}
