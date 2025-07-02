"use client"

import { useEffect, useState } from "react"

interface Shape {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  type: "triangle" | "square" | "circle" | "hexagon"
  color: string
}

export function GeometricShapes() {
  const [shapes, setShapes] = useState<Shape[]>([])

  useEffect(() => {
    const colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"]
    const shapeTypes: Shape["type"][] = ["triangle", "square", "circle", "hexagon"]

    const newShapes: Shape[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      rotation: Math.random() * 360,
      speed: Math.random() * 2 + 0.5,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setShapes(newShapes)
  }, [])

  const getShapePath = (shape: Shape) => {
    const { size, type } = shape
    switch (type) {
      case "triangle":
        return `M ${size / 2} 0 L ${size} ${size} L 0 ${size} Z`
      case "square":
        return `M 0 0 L ${size} 0 L ${size} ${size} L 0 ${size} Z`
      case "circle":
        return `M ${size / 2} 0 A ${size / 2} ${size / 2} 0 1 1 ${size / 2} ${size} A ${size / 2} ${size / 2} 0 1 1 ${size / 2} 0`
      case "hexagon":
        const points = []
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const x = size / 2 + (size / 2) * Math.cos(angle)
          const y = size / 2 + (size / 2) * Math.sin(angle)
          points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`)
        }
        return points.join(" ") + " Z"
      default:
        return ""
    }
  }

  return (
    <div className="geometric-shapes">
      <svg className="absolute inset-0 w-full h-full">
        {shapes.map((shape) => (
          <g key={shape.id}>
            <path
              d={getShapePath(shape)}
              fill={shape.color}
              fillOpacity="0.1"
              transform={`translate(${shape.x}%, ${shape.y}%) rotate(${shape.rotation})`}
              style={{
                animation: `rotate ${20 / shape.speed}s linear infinite, float ${30 / shape.speed}s ease-in-out infinite`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
