"use client"

import { useEffect, useState } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  twinkleDelay: number
  brightness: number
}

export function SpaceStars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const newStars: Star[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      twinkleDelay: Math.random() * 5,
      brightness: Math.random() * 0.8 + 0.2,
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="space-stars">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="white"
            opacity={star.brightness}
            style={{
              animation: `twinkle 3s ease-in-out infinite`,
              animationDelay: `${star.twinkleDelay}s`,
            }}
          />
        ))}

        {/* Shooting stars */}
        <line
          x1="10"
          y1="10"
          x2="30"
          y2="30"
          stroke="white"
          strokeWidth="1"
          opacity="0.8"
          style={{
            animation: "float 8s linear infinite",
          }}
        />
      </svg>
    </div>
  )
}
