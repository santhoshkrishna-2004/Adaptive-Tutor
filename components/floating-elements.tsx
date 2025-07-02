"use client"

import { useEffect, useState } from "react"
import { MatrixRain } from "./animated-backgrounds/matrix-rain"
import { GeometricShapes } from "./animated-backgrounds/geometric-shapes"
import { ParticleSystem } from "./animated-backgrounds/particle-system"
import { DNAHelix } from "./animated-backgrounds/dna-helix"
import { CircuitBoard } from "./animated-backgrounds/circuit-board"
import { OceanWaves } from "./animated-backgrounds/ocean-waves"
import { SpaceStars } from "./animated-backgrounds/space-stars"
import { AuroraLights } from "./animated-backgrounds/aurora-lights"
import { BrainWaves } from "./animated-backgrounds/brain-waves"

const educationalIcons = [
  "📚",
  "🎓",
  "📖",
  "✏️",
  "📝",
  "🔬",
  "🧪",
  "⚗️",
  "🔬",
  "📐",
  "📏",
  "🧮",
  "💡",
  "🎯",
  "🏆",
  "⭐",
  "✨",
  "🌟",
  "💫",
  "🔥",
]

interface FloatingElementsProps {
  backgroundType?: string
}

export function FloatingElements({ backgroundType = "learning-bg-animated" }: FloatingElementsProps) {
  const [elements, setElements] = useState<Array<{ id: number; icon: string; delay: number; duration: number }>>([])

  useEffect(() => {
    const newElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: educationalIcons[Math.floor(Math.random() * educationalIcons.length)],
      delay: Math.random() * 20,
      duration: 20 + Math.random() * 15,
    }))
    setElements(newElements)
  }, [])

  // Render specific animated background based on type
  const renderAnimatedBackground = () => {
    switch (backgroundType) {
      case "learning-bg-matrix":
        return <MatrixRain />
      case "learning-bg-geometric":
        return <GeometricShapes />
      case "learning-bg-particles":
        return <ParticleSystem />
      case "learning-bg-dna":
        return <DNAHelix />
      case "learning-bg-circuit":
        return <CircuitBoard />
      case "learning-bg-waves":
        return <OceanWaves />
      case "learning-bg-space":
        return <SpaceStars />
      case "learning-bg-aurora":
        return <AuroraLights />
      case "learning-bg-brainwaves":
        return <BrainWaves />
      case "learning-bg-animated":
      default:
        return (
          <div className="floating-elements">
            {elements.map((element) => (
              <div
                key={element.id}
                className="floating-element text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${element.delay}s`,
                  animationDuration: `${element.duration}s`,
                }}
              >
                {element.icon}
              </div>
            ))}
          </div>
        )
    }
  }

  return renderAnimatedBackground()
}
