"use client"

import { VideoPlayerTest } from "@/components/video-player-test"

export default function VideoTestPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Video Player Test</h1>
        <p className="text-gray-600">Test the YouTube video player functionality with the new API key</p>
      </div>

      <VideoPlayerTest />
    </div>
  )
}
