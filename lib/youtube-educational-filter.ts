// Enhanced educational content filtering for YouTube videos

export interface EducationalVideo {
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
  educationalScore: number
  tags: string[]
}

// Educational keywords for filtering
const EDUCATIONAL_KEYWORDS = [
  "tutorial",
  "learn",
  "education",
  "course",
  "lesson",
  "lecture",
  "study",
  "how to",
  "explained",
  "introduction",
  "basics",
  "fundamentals",
  "guide",
  "math",
  "science",
  "physics",
  "chemistry",
  "biology",
  "programming",
  "computer science",
  "engineering",
  "calculus",
  "algebra",
  "geometry",
  "history",
  "literature",
  "language",
  "academic",
  "university",
  "college",
  "khan academy",
  "crash course",
  "ted-ed",
  "mit",
  "stanford",
  "harvard",
]

// Non-educational keywords to filter out
const NON_EDUCATIONAL_KEYWORDS = [
  "movie",
  "film",
  "comedy",
  "funny",
  "entertainment",
  "music video",
  "gaming",
  "gameplay",
  "reaction",
  "vlog",
  "prank",
  "challenge",
  "unboxing",
  "review",
  "trailer",
  "clip",
  "highlights",
  "sports",
  "news",
  "politics",
  "gossip",
  "celebrity",
  "drama",
  "reality tv",
]

// Trusted educational channels
const EDUCATIONAL_CHANNELS = [
  "Khan Academy",
  "Crash Course",
  "TED-Ed",
  "3Blue1Brown",
  "Veritasium",
  "MinutePhysics",
  "SciShow",
  "Numberphile",
  "MIT OpenCourseWare",
  "Stanford",
  "Harvard University",
  "freeCodeCamp.org",
  "Coursera",
  "edX",
  "Academic Earth",
  "Professor Leonard",
  "PatrickJMT",
  "The Organic Chemistry Tutor",
  "Domain of Science",
  "Zach Star",
]

export function calculateEducationalScore(video: any): number {
  let score = 0
  const title = video.title?.toLowerCase() || ""
  const description = video.description?.toLowerCase() || ""
  const channelTitle = video.channelTitle || ""

  // Check for educational keywords in title (higher weight)
  EDUCATIONAL_KEYWORDS.forEach((keyword) => {
    if (title.includes(keyword)) score += 3
    if (description.includes(keyword)) score += 1
  })

  // Penalty for non-educational keywords
  NON_EDUCATIONAL_KEYWORDS.forEach((keyword) => {
    if (title.includes(keyword)) score -= 5
    if (description.includes(keyword)) score -= 2
  })

  // Bonus for trusted educational channels
  if (EDUCATIONAL_CHANNELS.some((channel) => channelTitle.toLowerCase().includes(channel.toLowerCase()))) {
    score += 10
  }

  // Bonus for academic/educational indicators
  if (title.includes("lecture") || title.includes("course")) score += 5
  if (description.includes("university") || description.includes("college")) score += 3

  return Math.max(0, score) // Ensure non-negative score
}

export function filterEducationalVideos(videos: any[]): EducationalVideo[] {
  return videos
    .map((video) => ({
      ...video,
      educationalScore: calculateEducationalScore(video),
      isEducational: calculateEducationalScore(video) >= 5,
    }))
    .filter((video) => video.isEducational)
    .sort((a, b) => b.educationalScore - a.educationalScore) // Sort by educational relevance
}

// Curated educational videos database
export const CURATED_EDUCATIONAL_VIDEOS: EducationalVideo[] = [
  {
    id: "8mAITcNt710",
    title: "Machine Learning Explained - A Complete Beginner's Guide",
    description:
      "Learn the fundamentals of machine learning, including supervised and unsupervised learning, neural networks, and real-world applications.",
    thumbnailUrl: "https://img.youtube.com/vi/8mAITcNt710/mqdefault.jpg",
    channelTitle: "Zach Star",
    publishedAt: "2023-01-15T10:00:00Z",
    duration: "15:30",
    viewCount: "1,234,567",
    category: "Computer Science",
    isEducational: true,
    educationalScore: 15,
    tags: ["machine learning", "AI", "tutorial", "beginner"],
  },
  {
    id: "aircAruvnKk",
    title: "But what is a neural network? | Chapter 1, Deep learning",
    description:
      "An intuitive explanation of neural networks and how they learn, perfect for beginners in deep learning.",
    thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-01T10:00:00Z",
    duration: "19:13",
    viewCount: "2,100,000",
    category: "Artificial Intelligence",
    isEducational: true,
    educationalScore: 18,
    tags: ["neural networks", "deep learning", "AI", "mathematics"],
  },
  {
    id: "WUvTyaaNkzM",
    title: "The essence of calculus | Chapter 1 - Introduction",
    description:
      "Understanding the fundamental concepts of calculus through beautiful visual explanations and intuitive examples.",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-15T14:00:00Z",
    duration: "17:04",
    viewCount: "1,800,000",
    category: "Mathematics",
    isEducational: true,
    educationalScore: 16,
    tags: ["calculus", "mathematics", "derivatives", "tutorial"],
  },
  {
    id: "rfscVS0vtbw",
    title: "How do computers read code? - Programming Fundamentals",
    description: "Learn how computers interpret and execute programming code, from source code to machine language.",
    thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/mqdefault.jpg",
    channelTitle: "Frame of Essence",
    publishedAt: "2023-02-20T14:30:00Z",
    duration: "12:45",
    viewCount: "987,654",
    category: "Computer Science",
    isEducational: true,
    educationalScore: 14,
    tags: ["programming", "computer science", "coding", "tutorial"],
  },
  {
    id: "QcUey-DVYjk",
    title: "How Electricity Actually Works - Physics Explained",
    description:
      "A deep dive into the fundamentals of electricity, covering current, voltage, resistance, and electrical circuits.",
    thumbnailUrl: "https://img.youtube.com/vi/QcUey-DVYjk/mqdefault.jpg",
    channelTitle: "Veritasium",
    publishedAt: "2023-04-05T16:20:00Z",
    duration: "18:22",
    viewCount: "654,321",
    category: "Physics",
    isEducational: true,
    educationalScore: 15,
    tags: ["physics", "electricity", "circuits", "science"],
  },
]

export function searchEducationalVideos(query: string): EducationalVideo[] {
  if (!query.trim()) {
    return CURATED_EDUCATIONAL_VIDEOS
  }

  const searchTerm = query.toLowerCase()
  return CURATED_EDUCATIONAL_VIDEOS.filter((video) => {
    const searchableText = `${video.title} ${video.description} ${video.category} ${video.tags.join(" ")}`.toLowerCase()
    return searchableText.includes(searchTerm)
  })
}
