"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { YouTubePlayer } from "@/components/youtube-player"
import { Play, ArrowLeft, Clock, Users, Star, ExternalLink } from "lucide-react"

const testVideos = [
  {
    id: "8mAITcNt710",
    title: "Machine Learning Explained",
    description: "A comprehensive introduction to machine learning concepts and applications in modern technology",
    thumbnail: "https://img.youtube.com/vi/8mAITcNt710/mqdefault.jpg",
    duration: "15:30",
    views: "1.2M",
    channel: "Zach Star",
    category: "Computer Science",
  },
  {
    id: "rfscVS0vtbw",
    title: "How do computers read code?",
    description: "Understanding how computers interpret and execute programming code step by step",
    thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/mqdefault.jpg",
    duration: "12:45",
    views: "850K",
    channel: "Frame of Essence",
    category: "Computer Science",
  },
  {
    id: "aircAruvnKk",
    title: "But what is a neural network?",
    description: "An intuitive explanation of neural networks and deep learning concepts with visual examples",
    thumbnail: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    duration: "19:13",
    views: "2.1M",
    channel: "3Blue1Brown",
    category: "Artificial Intelligence",
  },
]

export function VideoPlayerTest() {
  const [selectedVideo, setSelectedVideo] = useState(testVideos[0])
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)

  const handleVideoClick = (video: (typeof testVideos)[0]) => {
    setSelectedVideo(video)
    setIsPlayerVisible(true)
  }

  const handleBackClick = () => {
    setIsPlayerVisible(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-600" />
            Video Player Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Click on any video below to test the YouTube player functionality with the new API key.
          </p>

          {!isPlayerVisible ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testVideos.map((video) => (
                <Card
                  key={video.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-t-lg">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{video.channel}</span>
                      <span>{video.views} views</span>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {video.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Button variant="outline" onClick={handleBackClick} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Video List
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <YouTubePlayer videoId={selectedVideo.id} title={selectedVideo.title} height="400px" />
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedVideo.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedVideo.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {selectedVideo.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {selectedVideo.channel}
                        </span>
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        {selectedVideo.category}
                      </Badge>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">{selectedVideo.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo.id}`, "_blank")}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch on YouTube
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Video Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Video ID:</span>
                          <code className="bg-gray-100 px-1 rounded">{selectedVideo.id}</code>
                        </div>
                        <div className="flex justify-between">
                          <span>API Status:</span>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Embed Status:</span>
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            Loading
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
