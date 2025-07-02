"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { searchYouTubeVideos, type YouTubeVideo } from "@/lib/youtube-api"
import Link from "next/link"

export function RecommendedVideos({ subject }: { subject?: string }) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      setIsLoading(true)
      try {
        const searchQuery = subject ? `${subject} education tutorial` : "computer science education tutorial"

        const results = await searchYouTubeVideos(searchQuery, 3)
        setVideos(results)
      } catch (error) {
        console.error("Error fetching recommended videos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [subject])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-32 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <div className="aspect-video">
            <img
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h4 className="font-semibold line-clamp-2">{video.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{video.channelTitle}</p>
            <Button className="w-full mt-3" asChild>
              <Link href={`/dashboard/videos?videoId=${video.id}`}>Watch Video</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
