"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Clock, Users, Star, Filter, ArrowLeft, Video, Sparkles, TestTube } from "lucide-react"
import { VideoSearch } from "@/components/video-search"
import { EnhancedVideoSearch } from "@/components/enhanced-video-search"
import { YouTubePlayer } from "@/components/youtube-player"
import { GeminiChartBot } from "@/components/gemini-chart-bot"
import { RecommendedVideos } from "@/components/recommended-videos"
import Link from "next/link"

const featuredVideos = [
  {
    id: "8mAITcNt710",
    title: "Machine Learning Explained",
    description: "A comprehensive introduction to machine learning concepts and applications in modern technology",
    thumbnail: "https://img.youtube.com/vi/8mAITcNt710/mqdefault.jpg",
    duration: "15:30",
    views: "1.2M",
    channel: "Zach Star",
    publishedAt: "2023-01-15",
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
    publishedAt: "2023-02-20",
    category: "Computer Science",
  },
  {
    id: "byHcYRpMgI4",
    title: "The Map of Mathematics",
    description: "A visual guide to the different areas of mathematics and how they connect to each other",
    thumbnail: "https://img.youtube.com/vi/byHcYRpMgI4/mqdefault.jpg",
    duration: "11:06",
    views: "650K",
    channel: "Domain of Science",
    publishedAt: "2023-03-10",
    category: "Mathematics",
  },
  {
    id: "aircAruvnKk",
    title: "But what is a neural network?",
    description: "An intuitive explanation of neural networks and deep learning concepts with visual examples",
    thumbnail: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    duration: "19:13",
    views: "2.1M",
    channel: "3Blue1Brown",
    publishedAt: "2023-07-01",
    category: "Artificial Intelligence",
  },
  {
    id: "WUvTyaaNkzM",
    title: "The essence of calculus",
    description: "Understanding the fundamental concepts of calculus through beautiful visual explanations",
    thumbnail: "https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg",
    duration: "17:04",
    views: "1.8M",
    channel: "3Blue1Brown",
    publishedAt: "2023-07-15",
    category: "Mathematics",
  },
  {
    id: "spUNpyF58BY",
    title: "Linear algebra - full course",
    description: "Complete introduction to linear algebra concepts and applications in computer science",
    thumbnail: "https://img.youtube.com/vi/spUNpyF58BY/mqdefault.jpg",
    duration: "20:52",
    views: "950K",
    channel: "freeCodeCamp.org",
    publishedAt: "2023-08-01",
    category: "Mathematics",
  },
]

interface VideoItem {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  channel: string
  publishedAt: string
  category: string
}

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredVideos, setFilteredVideos] = useState(featuredVideos)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Computer Science", "Artificial Intelligence", "Mathematics", "Physics", "Chemistry"]

  useEffect(() => {
    let filtered = featuredVideos

    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.category === selectedCategory)
    }

    setFilteredVideos(filtered)
  }, [searchQuery, selectedCategory])

  const handleVideoSelect = (video: VideoItem) => {
    setSelectedVideo(video)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Educational Videos</h1>
              <p className="text-gray-600">Discover and learn from curated educational content</p>
            </div>
          </div>
          <Link href="/dashboard/videos/test">
            <Button variant="outline" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Player
            </Button>
          </Link>
        </div>
      </div>

      {selectedVideo ? (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setSelectedVideo(null)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <YouTubePlayer videoId={selectedVideo.id} title={selectedVideo.title} height="400px" />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    {selectedVideo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
                  <Badge variant="secondary" className="mb-4">
                    {selectedVideo.category}
                  </Badge>
                  <p className="text-gray-700 leading-relaxed">{selectedVideo.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <GeminiChartBot videoTitle={selectedVideo.title} videoDescription={selectedVideo.description} />
              <RecommendedVideos currentVideoId={selectedVideo.id} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search educational videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="featured">Featured Videos</TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Smart Search
              </TabsTrigger>
              <TabsTrigger value="youtube">YouTube Search</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail || "/placeholder.svg?height=180&width=320"}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=180&width=320"
                        }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-600 text-white">Educational</Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-t-lg">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{video.channel}</span>
                        <span>{video.views} views</span>
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {video.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No videos found</h3>
                  <p className="text-gray-500">
                    No videos found matching your criteria. Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="search">
              <EnhancedVideoSearch onVideoSelect={handleVideoSelect} />
            </TabsContent>

            <TabsContent value="youtube">
              <VideoSearch onVideoSelect={handleVideoSelect} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
