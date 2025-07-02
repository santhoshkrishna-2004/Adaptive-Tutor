"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { YouTubePlayer } from "./youtube-player"
import { Play, Search, TestTube } from "lucide-react"

// Test video IDs that should work
const testVideos = [
  { id: "8mAITcNt710", title: "Machine Learning Explained", category: "AI/ML" },
  { id: "rfscVS0vtbw", title: "How Computers Read Code", category: "Programming" },
  { id: "byHcYRpMgI4", title: "The Map of Mathematics", category: "Mathematics" },
  { id: "aircAruvnKk", title: "Neural Networks", category: "AI/ML" },
  { id: "WUvTyaaNkzM", title: "The Essence of Calculus", category: "Mathematics" },
  { id: "dQw4w9WgXcQ", title: "Test Video", category: "Test" },
]

export function VideoTestPanel() {
  const [currentVideoId, setCurrentVideoId] = useState("8mAITcNt710")
  const [customVideoId, setCustomVideoId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>("")

  const handleTestVideo = (videoId: string) => {
    setCurrentVideoId(videoId)
  }

  const handleCustomVideo = () => {
    if (customVideoId.trim()) {
      setCurrentVideoId(customVideoId.trim())
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setApiStatus("Searching...")

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}&maxResults=5`)
      const data = await response.json()

      if (data.error) {
        setApiStatus(`API Error: ${data.message}`)
      } else {
        setApiStatus(`Found ${data.videos.length} videos`)
      }

      setSearchResults(data.videos || [])
    } catch (error) {
      setApiStatus(`Search failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const testApiConnection = async () => {
    setApiStatus("Testing API connection...")

    try {
      const response = await fetch("/api/youtube/search?q=test&maxResults=1")
      const data = await response.json()

      if (response.ok) {
        setApiStatus(`✅ API Working - ${data.message}`)
      } else {
        setApiStatus(`❌ API Error: ${data.message}`)
      }
    } catch (error) {
      setApiStatus(`❌ Connection Failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            YouTube API Test Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={testApiConnection} variant="outline">
              Test API Connection
            </Button>
            {apiStatus && (
              <Badge
                variant={apiStatus.includes("✅") ? "default" : apiStatus.includes("❌") ? "destructive" : "secondary"}
              >
                {apiStatus}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Test Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {testVideos.map((video) => (
              <Button
                key={video.id}
                onClick={() => handleTestVideo(video.id)}
                variant={currentVideoId === video.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Play className="h-4 w-4" />
                  <Badge variant="secondary" className="text-xs">
                    {video.category}
                  </Badge>
                </div>
                <span className="text-sm font-medium">{video.title}</span>
                <span className="text-xs text-gray-500">{video.id}</span>
              </Button>
            ))}
          </div>

          {/* Custom Video ID */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter YouTube Video ID (e.g., dQw4w9WgXcQ)"
              value={customVideoId}
              onChange={(e) => setCustomVideoId(e.target.value)}
            />
            <Button onClick={handleCustomVideo}>Test Custom ID</Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Test */}
      <Card>
        <CardHeader>
          <CardTitle>Search Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search for educational videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Search Results:</h4>
              {searchResults.map((video) => (
                <Button
                  key={video.id}
                  onClick={() => handleTestVideo(video.id)}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{video.title}</div>
                    <div className="text-sm text-gray-500">
                      {video.channelTitle} • {video.id}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Player */}
      <Card>
        <CardHeader>
          <CardTitle>Video Player Test</CardTitle>
        </CardHeader>
        <CardContent>
          <YouTubePlayer
            videoId={currentVideoId}
            title={testVideos.find((v) => v.id === currentVideoId)?.title || "Test Video"}
            height="400px"
          />
        </CardContent>
      </Card>
    </div>
  )
}
