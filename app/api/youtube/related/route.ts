import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3"

// Fallback related videos
const fallbackRelatedVideos = [
  {
    id: "dQw4w9WgXcQ",
    title: "Advanced Data Structures",
    description: "Learn advanced data structures for efficient algorithms",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    channelTitle: "CS Education",
    publishedAt: "2023-01-20T14:30:00Z",
  },
  {
    id: "UVeYPz6COEY",
    title: "Algorithm Analysis",
    description: "Understanding time and space complexity",
    thumbnailUrl: "https://i.ytimg.com/vi/UVeYPz6COEY/mqdefault.jpg",
    channelTitle: "Programming Simplified",
    publishedAt: "2023-02-25T10:15:00Z",
  },
  {
    id: "8mAITcNt710",
    title: "Circuit Design Principles",
    description: "Advanced circuit design techniques",
    thumbnailUrl: "https://i.ytimg.com/vi/8mAITcNt710/mqdefault.jpg",
    channelTitle: "Electrical Engineering Basics",
    publishedAt: "2023-03-10T09:45:00Z",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("id")
  const maxResults = searchParams.get("maxResults") || "5"

  if (!videoId) {
    return NextResponse.json({ error: "Video ID parameter is required" }, { status: 400 })
  }

  // Check if API key is available
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key is missing. Using fallback data.")
    return NextResponse.json({
      videos: fallbackRelatedVideos,
      message: "Using fallback data. YouTube API key is missing.",
    })
  }

  try {
    // First get the video details to get the topic/category
    const videoResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=snippet,topicDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!videoResponse.ok) {
      throw new Error("Failed to fetch video details")
    }

    const videoData = await videoResponse.json()

    if (!videoData.items || videoData.items.length === 0) {
      throw new Error("Video not found")
    }

    const videoItem = videoData.items[0]
    const { snippet } = videoItem

    // Use the video title and tags for related search
    const searchQuery = snippet.tags ? `${snippet.title} ${snippet.tags.slice(0, 3).join(" ")}` : snippet.title

    // Now search for related videos
    const response = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(
        searchQuery,
      )}&type=video&key=${YOUTUBE_API_KEY}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Filter out the original video
    const videos = data.items
      .filter((item: any) => item.id.videoId !== videoId)
      .map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }))

    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Error fetching related videos:", error)

    // Return fallback data with a message
    return NextResponse.json({
      videos: fallbackRelatedVideos,
      message: "Using fallback data due to API error. Please try again later.",
    })
  }
}
