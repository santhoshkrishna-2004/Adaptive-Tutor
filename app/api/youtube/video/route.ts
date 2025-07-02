import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3"

// Fallback video data
const fallbackVideo = {
  id: "dQw4w9WgXcQ",
  title: "Introduction to Data Structures",
  description: "Learn the basics of data structures in computer science with this comprehensive tutorial.",
  thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  channelTitle: "CS Education",
  publishedAt: "2023-01-15T14:30:00Z",
  duration: "PT15M30S",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("id")

  if (!videoId) {
    return NextResponse.json({ error: "Video ID parameter is required" }, { status: 400 })
  }

  // Check if API key is available
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key is missing. Using fallback data.")
    return NextResponse.json({
      video: { ...fallbackVideo, id: videoId },
      message: "Using fallback data. YouTube API key is missing.",
    })
  }

  try {
    // Fetch video details
    const detailsResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!detailsResponse.ok) {
      throw new Error("Failed to fetch video details")
    }

    const detailsData = await detailsResponse.json()

    if (!detailsData.items || detailsData.items.length === 0) {
      throw new Error("Video not found")
    }

    const videoItem = detailsData.items[0]
    const { snippet, contentDetails } = videoItem

    const video = {
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      duration: contentDetails.duration,
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error("Error fetching video details:", error)

    // Return fallback data with a message
    return NextResponse.json({
      video: { ...fallbackVideo, id: videoId },
      message: "Using fallback data due to API error. Please try again later.",
    })
  }
}
