"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SlideContent } from "@/app/actions/generate-ppt"

interface PPTSlideProps {
  slide: SlideContent
  theme: string
  index: number
  onClick?: () => void
}

const themeStyles = {
  professional: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    titleColor: "text-blue-900",
    textColor: "text-blue-800",
    accent: "border-blue-300",
  },
  creative: {
    bg: "bg-gradient-to-br from-purple-50 to-pink-100",
    titleColor: "text-purple-900",
    textColor: "text-purple-800",
    accent: "border-purple-300",
  },
  minimal: {
    bg: "bg-gradient-to-br from-gray-50 to-gray-100",
    titleColor: "text-gray-900",
    textColor: "text-gray-700",
    accent: "border-gray-300",
  },
  academic: {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    titleColor: "text-green-900",
    textColor: "text-green-800",
    accent: "border-green-300",
  },
  modern: {
    bg: "bg-gradient-to-br from-indigo-50 to-cyan-100",
    titleColor: "text-indigo-900",
    textColor: "text-indigo-800",
    accent: "border-indigo-300",
  },
}

export function PPTSlide({ slide, theme, index, onClick }: PPTSlideProps) {
  const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.professional

  // Generate placeholder image URL based on the image prompt
  const getImageUrl = (prompt: string) => {
    const keywords = prompt?.toLowerCase().split(" ").join("+") || "education"
    return `/placeholder.svg?height=120&width=200&text=${encodeURIComponent(keywords)}`
  }

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 ${currentTheme.accent} border-2`}
      onClick={onClick}
    >
      <CardContent className={`p-4 h-64 ${currentTheme.bg} relative overflow-hidden`}>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {index + 1}
          </Badge>
        </div>

        <div className="h-full flex flex-col">
          {/* Title */}
          <h3 className={`font-bold text-sm mb-3 ${currentTheme.titleColor} line-clamp-2`}>{slide.title}</h3>

          {/* Image */}
          {slide.imagePrompt && (
            <div className="mb-3 flex justify-center">
              <img
                src={getImageUrl(slide.imagePrompt) || "/placeholder.svg"}
                alt={slide.imagePrompt}
                className="w-32 h-20 object-cover rounded border shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=80&width=128&text=Image"
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 space-y-1">
            {slide.content.slice(0, 4).map((point, idx) => (
              <div key={idx} className={`text-xs ${currentTheme.textColor} flex items-start`}>
                <span className="mr-1 mt-0.5">•</span>
                <span className="line-clamp-1">{point}</span>
              </div>
            ))}
            {slide.content.length > 4 && (
              <div className={`text-xs ${currentTheme.textColor} italic`}>
                +{slide.content.length - 4} more points...
              </div>
            )}
          </div>

          {/* Footer with slide info */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className={`text-xs ${currentTheme.textColor} opacity-75`}>{slide.content.length} points</span>
              {slide.notes && slide.notes.length > 0 && (
                <span className={`text-xs ${currentTheme.textColor} opacity-75`}>📝 {slide.notes.length} notes</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
