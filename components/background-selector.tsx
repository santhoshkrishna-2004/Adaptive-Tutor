"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Palette, Check, Sparkles } from "lucide-react"

interface BackgroundSelectorProps {
  currentBackground: string
  onBackgroundChange: (background: string) => void
}

const backgrounds = [
  // Featured Custom Background
  {
    id: "learning-bg-custom",
    name: "🎨 Adaptive AI Tutor",
    description: "Beautiful collaborative learning environment with diverse students",
    preview: "bg-gradient-to-br from-blue-500 via-orange-400 to-green-500",
    category: "featured",
  },
  // Static Educational Backgrounds
  {
    id: "learning-bg-books",
    name: "Books Pattern",
    description: "Classic educational books pattern",
    preview: "bg-blue-100",
    category: "static",
  },
  {
    id: "learning-bg-graduation",
    name: "Graduation",
    description: "Academic achievement theme",
    preview: "bg-cyan-100",
    category: "static",
  },
  {
    id: "learning-bg-science",
    name: "Science Lab",
    description: "Scientific research environment",
    preview: "bg-green-100",
    category: "static",
  },
  {
    id: "learning-bg-math",
    name: "Mathematics",
    description: "Mathematical formulas and equations",
    preview: "bg-amber-100",
    category: "static",
  },
  {
    id: "learning-bg-computer",
    name: "Computer Science",
    description: "Technology and programming theme",
    preview: "bg-indigo-100",
    category: "static",
  },
  {
    id: "learning-bg-engineering",
    name: "Engineering",
    description: "Technical engineering design",
    preview: "bg-red-100",
    category: "static",
  },
  {
    id: "learning-bg-library",
    name: "Library",
    description: "Quiet study environment",
    preview: "bg-emerald-100",
    category: "static",
  },
  {
    id: "learning-bg-classroom",
    name: "Classroom",
    description: "Interactive learning space",
    preview: "bg-purple-100",
    category: "static",
  },
  {
    id: "learning-bg-study",
    name: "Study Room",
    description: "Personal study space",
    preview: "bg-pink-100",
    category: "static",
  },

  // Animated Backgrounds
  {
    id: "learning-bg-animated",
    name: "Rainbow Gradient",
    description: "Dynamic color-changing background with floating icons",
    preview: "bg-gradient-to-r from-purple-400 to-pink-400",
    category: "animated",
  },
  {
    id: "learning-bg-matrix",
    name: "Matrix Code Rain",
    description: "Falling code like in The Matrix - perfect for programming",
    preview: "bg-gradient-to-b from-green-900 to-black",
    category: "animated",
  },
  {
    id: "learning-bg-geometric",
    name: "Floating Geometry",
    description: "Animated geometric shapes for mathematics and design",
    preview: "bg-gradient-to-br from-purple-500 to-blue-500",
    category: "animated",
  },
  {
    id: "learning-bg-particles",
    name: "Particle Network",
    description: "Connected particles showing data relationships",
    preview: "bg-gradient-to-b from-blue-900 to-black",
    category: "animated",
  },
  {
    id: "learning-bg-dna",
    name: "DNA Helix",
    description: "Rotating DNA structure for biology and chemistry",
    preview: "bg-gradient-to-br from-blue-500 to-purple-600",
    category: "animated",
  },
  {
    id: "learning-bg-circuit",
    name: "Circuit Board",
    description: "Pulsing electronic circuits for engineering",
    preview: "bg-gradient-to-br from-gray-900 to-green-900",
    category: "animated",
  },
  {
    id: "learning-bg-waves",
    name: "Ocean Waves",
    description: "Flowing waves for physics and fluid dynamics",
    preview: "bg-gradient-to-br from-blue-400 to-purple-500",
    category: "animated",
  },
  {
    id: "learning-bg-space",
    name: "Starry Space",
    description: "Twinkling stars for astronomy and physics",
    preview: "bg-gradient-to-b from-indigo-900 to-black",
    category: "animated",
  },
  {
    id: "learning-bg-aurora",
    name: "Aurora Borealis",
    description: "Northern lights for atmospheric science",
    preview: "bg-gradient-to-br from-green-400 via-purple-500 to-pink-500",
    category: "animated",
  },
  {
    id: "learning-bg-brainwaves",
    name: "Brain Waves",
    description: "Neural activity patterns for neuroscience",
    preview: "bg-gradient-to-br from-purple-600 to-blue-600",
    category: "animated",
  },
]

export function BackgroundSelector({ currentBackground, onBackgroundChange }: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<"all" | "static" | "animated" | "featured">("all")

  const filteredBackgrounds = backgrounds.filter(
    (bg) =>
      selectedCategory === "all" ||
      bg.category === selectedCategory ||
      (selectedCategory === "featured" && bg.id === "learning-bg-custom"),
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change background</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Learning Background</DialogTitle>
          <DialogDescription>Select a background theme that enhances your learning experience</DialogDescription>
        </DialogHeader>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={selectedCategory === "featured" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("featured")}
            className="flex items-center gap-1"
          >
            ⭐ Featured
          </Button>
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Backgrounds
          </Button>
          <Button
            variant={selectedCategory === "static" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("static")}
          >
            Static Patterns
          </Button>
          <Button
            variant={selectedCategory === "animated" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("animated")}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Animated
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {filteredBackgrounds.map((bg) => (
            <Card
              key={bg.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentBackground === bg.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => {
                onBackgroundChange(bg.id)
                setIsOpen(false)
              }}
            >
              <CardHeader className="p-3">
                <div className={`h-16 w-full rounded-md ${bg.preview} ${bg.id} relative overflow-hidden`}>
                  {bg.category === "animated" && (
                    <div className="absolute top-1 right-1">
                      <Sparkles className="h-3 w-3 text-white animate-pulse" />
                    </div>
                  )}
                  {currentBackground === bg.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-6 w-6 text-primary bg-white rounded-full p-1" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <CardTitle className="text-sm flex items-center gap-1">
                  {bg.name}
                  {bg.category === "animated" && <Sparkles className="h-3 w-3 text-amber-500" />}
                </CardTitle>
                <CardDescription className="text-xs">{bg.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center mt-4">
          <p>💡 Animated backgrounds may use more battery on mobile devices</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
