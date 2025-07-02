"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, Lock, Play, ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import {
  getLearningPathById,
  getNextVideoInPath,
  getPreviousVideoInPath,
  isVideoUnlocked,
  type LearningVideo,
} from "@/lib/learning-paths"
import { YouTubePlayer } from "@/components/youtube-player"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function LearningPathDetailPage() {
  const params = useParams()
  const pathId = params.pathId as string
  const [selectedVideo, setSelectedVideo] = useState<LearningVideo | null>(null)
  const [completedVideos, setCompletedVideos] = useState<string[]>([])

  const path = getLearningPathById(pathId)

  useEffect(() => {
    // Load user progress from localStorage or API
    const saved = localStorage.getItem(`progress-${pathId}`)
    if (saved) {
      setCompletedVideos(JSON.parse(saved))
    }
  }, [pathId])

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem(`progress-${pathId}`, JSON.stringify(completedVideos))
  }, [completedVideos, pathId])

  if (!path) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Learning Path Not Found</h1>
          <p className="text-gray-600 mt-2">The requested learning path could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/learning-paths">Back to Learning Paths</Link>
          </Button>
        </div>
      </div>
    )
  }

  const progress = Math.round((completedVideos.length / path.videos.filter((v) => v.isRequired).length) * 100)

  const markVideoComplete = (videoId: string) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId])
    }
  }

  const markVideoIncomplete = (videoId: string) => {
    setCompletedVideos(completedVideos.filter((id) => id !== videoId))
  }

  const nextVideo = selectedVideo ? getNextVideoInPath(pathId, selectedVideo.id) : null
  const previousVideo = selectedVideo ? getPreviousVideoInPath(pathId, selectedVideo.id) : null

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/learning-paths">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Paths
          </Link>
        </Button>
      </div>

      {selectedVideo ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <YouTubePlayer
              videoId={selectedVideo.id}
              title={selectedVideo.title}
              description={selectedVideo.description}
            />

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      {selectedVideo.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{selectedVideo.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {completedVideos.includes(selectedVideo.id) ? (
                      <Button variant="outline" size="sm" onClick={() => markVideoIncomplete(selectedVideo.id)}>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Completed
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => markVideoComplete(selectedVideo.id)}>
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedVideo.duration}
                  </span>
                  <span>Order: {selectedVideo.order}</span>
                  {selectedVideo.isRequired && <Badge variant="secondary">Required</Badge>}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedVideo.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    disabled={!previousVideo}
                    onClick={() => previousVideo && setSelectedVideo(previousVideo)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button disabled={!nextVideo} onClick={() => nextVideo && setSelectedVideo(nextVideo)}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <PathProgressCard path={path} progress={progress} completedVideos={completedVideos} />
            <VideoListCard
              path={path}
              selectedVideo={selectedVideo}
              completedVideos={completedVideos}
              onVideoSelect={setSelectedVideo}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PathOverviewCard path={path} progress={progress} />
          </div>
          <div className="space-y-6">
            <PathProgressCard path={path} progress={progress} completedVideos={completedVideos} />
            <VideoListCard
              path={path}
              selectedVideo={selectedVideo}
              completedVideos={completedVideos}
              onVideoSelect={setSelectedVideo}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function PathOverviewCard({ path, progress }: { path: any; progress: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-lg ${path.color} flex items-center justify-center text-white text-2xl`}>
            {path.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl">{path.title}</CardTitle>
            <Badge className="mt-2">{path.difficulty}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-700">{path.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{path.estimatedHours} hours</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span>{path.videos.length} videos</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Skills You'll Learn</h4>
          <div className="flex flex-wrap gap-2">
            {path.skills.map((skill: string) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {path.prerequisites && (
          <div>
            <h4 className="font-semibold mb-2">Prerequisites</h4>
            <p className="text-sm text-gray-600">Complete {path.prerequisites.length} other learning path(s) first</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PathProgressCard({
  path,
  progress,
  completedVideos,
}: { path: any; progress: number; completedVideos: string[] }) {
  const requiredVideos = path.videos.filter((v: any) => v.isRequired)
  const completedRequired = requiredVideos.filter((v: any) => completedVideos.includes(v.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="text-sm text-gray-600">
          <div>
            Required: {completedRequired.length}/{requiredVideos.length}
          </div>
          <div>
            Total: {completedVideos.length}/{path.videos.length}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VideoListCard({
  path,
  selectedVideo,
  completedVideos,
  onVideoSelect,
}: {
  path: any
  selectedVideo: LearningVideo | null
  completedVideos: string[]
  onVideoSelect: (video: LearningVideo) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Course Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {path.videos.map((video: LearningVideo) => {
          const isCompleted = completedVideos.includes(video.id)
          const isUnlocked = isVideoUnlocked(path.id, video.id, completedVideos)
          const isSelected = selectedVideo?.id === video.id

          return (
            <div
              key={video.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              } ${!isUnlocked ? "opacity-50" : ""}`}
              onClick={() => isUnlocked && onVideoSelect(video)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : !isUnlocked ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Play className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{video.duration}</span>
                    {video.isRequired && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
