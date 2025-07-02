"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, AlertCircle } from "lucide-react"

interface YouTubePlayerProps {
  videoId: string
  title?: string
  autoplay?: boolean
  width?: string
  height?: string
}

export function YouTubePlayer({
  videoId,
  title = "Educational Video",
  autoplay = false,
  width = "100%",
  height = "400px",
}: YouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(false)

  // Validate video ID
  const isValidVideoId = /^[a-zA-Z0-9_-]{11}$/.test(videoId)

  useEffect(() => {
    if (!isValidVideoId) {
      setHasError(true)
      setIsLoading(false)
    }
  }, [videoId, isValidVideoId])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const getEmbedUrl = () => {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      showinfo: "0",
      fs: "1",
      cc_load_policy: "1",
      iv_load_policy: "3",
      autohide: "1",
      controls: "1",
      enablejsapi: "1",
      origin: window.location.origin,
    })

    if (autoplay) {
      params.set("autoplay", "1")
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  const openInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank", "noopener,noreferrer")
  }

  const openInNewTab = () => {
    window.open(`https://www.youtube.com/embed/${videoId}?autoplay=1`, "_blank", "noopener,noreferrer")
  }

  if (!isValidVideoId) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-[300px] bg-gray-100 rounded-lg">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Video ID</h3>
              <p className="text-gray-600 mb-4">The video ID "{videoId}" is not valid.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="relative" style={{ width, height }}>
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Unavailable</h3>
                <p className="text-gray-600 mb-4">This video cannot be played in the embedded player.</p>
                <div className="space-x-2">
                  <Button onClick={openInYouTube} variant="default">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                  <Button onClick={openInNewTab} variant="outline">
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Iframe */}
          <iframe
            src={getEmbedUrl()}
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="rounded-lg"
            style={{ display: hasError ? "none" : "block" }}
          />

          {/* Control Overlay */}
          {!isLoading && !hasError && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={openInYouTube}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 border-t">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Video ID: {videoId}</p>
            <Button onClick={openInYouTube} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Watch on YouTube
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
