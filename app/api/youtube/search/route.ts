import { NextResponse } from "next/server"

// Updated YouTube API key
const YOUTUBE_API_KEY = "YOUR_API_KEY"
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v"

// Enhanced fallback educational videos
const fallbackVideos = [
  {
    id: "8mAITcNt710",
    title: "Machine Learning Explained",
    description: "A comprehensive introduction to machine learning concepts and applications in modern technology.",
    thumbnailUrl: "https://img.youtube.com/vi/8mAITcNt710/mqdefault.jpg",
    channelTitle: "Zach Star",
    publishedAt: "2023-01-15T10:00:00Z",
    duration: "PT15M30S",
    viewCount: "1234567",
  },
  {
    id: "rfscVS0vtbw",
    title: "How do computers read code?",
    description: "Understanding how computers interpret and execute programming code step by step.",
    thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/mqdefault.jpg",
    channelTitle: "Frame of Essence",
    publishedAt: "2023-02-20T14:30:00Z",
    duration: "PT12M45S",
    viewCount: "987654",
  },
  {
    id: "byHcYRpMgI4",
    title: "The Map of Mathematics",
    description: "A visual guide to the different areas of mathematics and how they connect to each other.",
    thumbnailUrl: "https://img.youtube.com/vi/byHcYRpMgI4/mqdefault.jpg",
    channelTitle: "Domain of Science",
    publishedAt: "2023-03-10T09:15:00Z",
    duration: "PT11M06S",
    viewCount: "756432",
  },
  {
    id: "aircAruvnKk",
    title: "But what is a neural network?",
    description: "An intuitive explanation of neural networks and deep learning concepts with visual examples.",
    thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-01T10:00:00Z",
    duration: "PT19M13S",
    viewCount: "2100000",
  },
  {
    id: "WUvTyaaNkzM",
    title: "The essence of calculus",
    description: "Understanding the fundamental concepts of calculus through beautiful visual explanations.",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-15T14:00:00Z",
    duration: "PT17M04S",
    viewCount: "1800000",
  },
  {
    id: "spUNpyF58BY",
    title: "Linear algebra - full course",
    description: "Complete introduction to linear algebra concepts and applications in computer science.",
    thumbnailUrl: "https://img.youtube.com/vi/spUNpyF58BY/mqdefault.jpg",
    channelTitle: "freeCodeCamp.org",
    publishedAt: "2023-08-01T09:00:00Z",
    duration: "PT20M52S",
    viewCount: "950000",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || searchParams.get("query") || ""
  const maxResults = Number.parseInt(searchParams.get("maxResults") || "10")

  console.log("YouTube API Search - Query:", query, "API Key Available:", !!YOUTUBE_API_KEY)

  // Check if API key is available
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key is missing. Using fallback data.")
    return NextResponse.json({
      videos: fallbackVideos.slice(0, maxResults),
      message: "Using fallback educational videos. YouTube API key is missing.",
    })
  }

  try {
    // Build the API URL with proper parameters
    const apiUrl = new URL(`${YOUTUBE_API_URL}/search`)
    apiUrl.searchParams.set("part", "snippet")
    apiUrl.searchParams.set("maxResults", maxResults.toString())
    apiUrl.searchParams.set("q", query || "educational programming tutorial")
    apiUrl.searchParams.set("type", "video")
    apiUrl.searchParams.set("videoEmbeddable", "true")
    apiUrl.searchParams.set("videoSyndicated", "true")
    apiUrl.searchParams.set("safeSearch", "strict")
    apiUrl.searchParams.set("relevanceLanguage", "en")
    apiUrl.searchParams.set("key", YOUTUBE_API_KEY)

    console.log("Making YouTube API request to:", apiUrl.toString())

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Referer: "https://adaptive-ai-tutor.vercel.app",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    console.log("YouTube API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("YouTube API Error Response:", errorText)

      // Try to parse error details
      let errorDetails = "Unknown error"
      try {
        const errorData = JSON.parse(errorText)
        errorDetails = errorData.error?.message || errorText
      } catch (e) {
        errorDetails = errorText
      }

      throw new Error(`YouTube API Error (${response.status}): ${errorDetails}`)
    }

    const data = await response.json()
    console.log("YouTube API Success - Items found:", data.items?.length || 0)

    if (!data.items || data.items.length === 0) {
      console.log("No videos found, using fallback data")
      return NextResponse.json({
        videos: fallbackVideos.slice(0, maxResults),
        message: `No videos found for "${query}". Showing educational content instead.`,
      })
    }

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: "Unknown",
      viewCount: "Unknown",
    }))

    return NextResponse.json({
      videos,
      message: `Found ${videos.length} videos for "${query}"`,
    })
  } catch (error) {
    console.error("YouTube API Error:", error)

    // Return fallback data with error message
    return NextResponse.json({
      videos: fallbackVideos.slice(0, maxResults),
      message: `API Error: ${error instanceof Error ? error.message : "Unknown error"}. Showing educational content instead.`,
      error: true,
    })
  }
}
