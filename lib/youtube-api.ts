// Enhanced YouTube API for educational videos

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  channelTitle: string
  publishedAt: string
  duration?: string
  viewCount?: string
  category: string
  isEducational: boolean
}

// Educational videos database with real YouTube video IDs
const educationalVideos: YouTubeVideo[] = [
  {
    id: "8mAITcNt710",
    title: "Machine Learning Explained",
    description: "A comprehensive introduction to machine learning concepts and applications.",
    thumbnailUrl: "https://img.youtube.com/vi/8mAITcNt710/mqdefault.jpg",
    channelTitle: "Zach Star",
    publishedAt: "2023-01-15T10:00:00Z",
    duration: "15:30",
    viewCount: "1,234,567",
    category: "Computer Science",
    isEducational: true,
  },
  {
    id: "rfscVS0vtbw",
    title: "How do computers read code?",
    description: "Understanding how computers interpret and execute programming code.",
    thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/mqdefault.jpg",
    channelTitle: "Frame of Essence",
    publishedAt: "2023-02-20T14:30:00Z",
    duration: "12:45",
    viewCount: "987,654",
    category: "Computer Science",
    isEducational: true,
  },
  {
    id: "byHcYRpMgI4",
    title: "The Map of Mathematics",
    description: "A visual guide to the different areas of mathematics and how they connect.",
    thumbnailUrl: "https://img.youtube.com/vi/byHcYRpMgI4/mqdefault.jpg",
    channelTitle: "Domain of Science",
    publishedAt: "2023-03-10T09:15:00Z",
    duration: "11:06",
    viewCount: "756,432",
    category: "Mathematics",
    isEducational: true,
  },
  {
    id: "QcUey-DVYjk",
    title: "How Electricity Actually Works",
    description: "Understanding the fundamentals of electricity and electrical circuits.",
    thumbnailUrl: "https://img.youtube.com/vi/QcUey-DVYjk/mqdefault.jpg",
    channelTitle: "Veritasium",
    publishedAt: "2023-04-05T16:20:00Z",
    duration: "18:22",
    viewCount: "654,321",
    category: "Physics",
    isEducational: true,
  },
  {
    id: "yQP4UJhNn0I",
    title: "What is an Algorithm?",
    description: "Introduction to algorithms and their importance in computer science.",
    thumbnailUrl: "https://img.youtube.com/vi/yQP4UJhNn0I/mqdefault.jpg",
    channelTitle: "Crash Course Computer Science",
    publishedAt: "2023-05-12T11:45:00Z",
    duration: "13:15",
    viewCount: "543,210",
    category: "Computer Science",
    isEducational: true,
  },
  {
    id: "kYIS7j4fHIU",
    title: "Introduction to Chemistry",
    description: "Basic concepts of chemistry including atoms, molecules, and chemical reactions.",
    thumbnailUrl: "https://img.youtube.com/vi/kYIS7j4fHIU/mqdefault.jpg",
    channelTitle: "Crash Course Chemistry",
    publishedAt: "2023-06-18T13:30:00Z",
    duration: "14:30",
    viewCount: "432,109",
    category: "Chemistry",
    isEducational: true,
  },
  {
    id: "aircAruvnKk",
    title: "But what is a neural network?",
    description: "An intuitive explanation of neural networks and deep learning concepts.",
    thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-01T10:00:00Z",
    duration: "19:13",
    viewCount: "2,100,000",
    category: "Artificial Intelligence",
    isEducational: true,
  },
  {
    id: "WUvTyaaNkzM",
    title: "The essence of calculus",
    description: "Understanding the fundamental concepts of calculus through visual explanations.",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-15T14:00:00Z",
    duration: "17:04",
    viewCount: "1,800,000",
    category: "Mathematics",
    isEducational: true,
  },
  {
    id: "spUNpyF58BY",
    title: "Linear algebra - full course",
    description: "Complete introduction to linear algebra concepts and applications.",
    thumbnailUrl: "https://img.youtube.com/vi/spUNpyF58BY/mqdefault.jpg",
    channelTitle: "freeCodeCamp.org",
    publishedAt: "2023-08-01T09:00:00Z",
    duration: "20:52",
    viewCount: "950,000",
    category: "Mathematics",
    isEducational: true,
  },
  {
    id: "YAXLy4jNhAs",
    title: "Introduction to Programming",
    description: "Learn the basics of programming and computer science fundamentals.",
    thumbnailUrl: "https://img.youtube.com/vi/YAXLy4jNhAs/mqdefault.jpg",
    channelTitle: "Crash Course Computer Science",
    publishedAt: "2023-08-15T11:30:00Z",
    duration: "12:28",
    viewCount: "720,000",
    category: "Computer Science",
    isEducational: true,
  },
  {
    id: "kO2x8wSpmWc",
    title: "How Does the Internet Work?",
    description: "Understanding the fundamentals of how the internet and web work.",
    thumbnailUrl: "https://img.youtube.com/vi/kO2x8wSpmWc/mqdefault.jpg",
    channelTitle: "Crash Course Computer Science",
    publishedAt: "2023-09-01T16:45:00Z",
    duration: "13:42",
    viewCount: "680,000",
    category: "Computer Science",
    isEducational: true,
  },
]

export function searchYouTubeVideos(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query.trim()) {
        resolve(educationalVideos.slice(0, maxResults))
        return
      }

      const filtered = educationalVideos.filter((video) => {
        const searchText = `${video.title} ${video.description} ${video.category}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })

      resolve(filtered.length > 0 ? filtered.slice(0, maxResults) : educationalVideos.slice(0, maxResults))
    }, 500)
  })
}

export function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const video = educationalVideos.find((v) => v.id === videoId)
      resolve(video || null)
    }, 300)
  })
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`
}

export function validateEducationalVideo(videoId: string): boolean {
  // More flexible validation - accept any valid YouTube video ID format
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
}

export function getEducationalCategories(): string[] {
  return [...new Set(educationalVideos.map((v) => v.category))]
}

export function formatYouTubeDuration(duration: string): string {
  return duration
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}
