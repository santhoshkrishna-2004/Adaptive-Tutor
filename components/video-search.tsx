"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Play, Users, Loader2 } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  channelTitle: string
  publishedAt: string
  duration?: string
  viewCount?: string
}

interface VideoSearchProps {
  onVideoSelect: (video: any) => void
}

export function VideoSearch({ onVideoSelect }: VideoSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Load featured videos on component mount
  useEffect(() => {
    loadFeaturedVideos()
  }, [])

  const loadFeaturedVideos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/youtube/search?maxResults=12")
      const data = await response.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error("Error loading featured videos:", error)
      setVideos([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadFeaturedVideos()
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}&maxResults=12`)
      const data = await response.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error("Error searching videos:", error)
      setVideos([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDuration = (duration: string) => {
    if (!duration) return "N/A"
    // Convert PT15M30S to 15:30
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return duration

    const hours = Number.parseInt(match[1] || "0")
    const minutes = Number.parseInt(match[2] || "0")
    const seconds = Number.parseInt(match[3] || "0")

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatViewCount = (viewCount: string) => {
    if (!viewCount) return "N/A"
    const num = Number.parseInt(viewCount)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const handleVideoClick = (video: Video) => {
    onVideoSelect({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnailUrl,
      duration: formatDuration(video.duration || ""),
      views: formatViewCount(video.viewCount || ""),
      channel: video.channelTitle,
      publishedAt: video.publishedAt,
      category: "Educational",
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for educational videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {isLoading && !videos.length && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Searching for educational videos...</p>
          </div>
        </div>
      )}

      {!isLoading && videos.length === 0 && hasSearched && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-gray-600">Try searching with different keywords</p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {hasSearched && searchQuery ? `Search Results for "${searchQuery}"` : "Featured Educational Videos"}
            </h3>
            <Badge variant="secondary">{videos.length} videos</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=180&width=320"
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration || "")}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-600 text-white">Educational</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">{video.title}</h4>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{video.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {video.channelTitle}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {formatViewCount(video.viewCount || "")} views
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
