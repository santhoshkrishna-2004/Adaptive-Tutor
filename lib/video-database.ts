export interface VideoData {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  channelTitle: string
  publishedAt: string
  duration: string
  viewCount: string
  category: string
  tags: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  subject: string
}

export const educationalVideoDatabase: VideoData[] = [
  // Computer Science & Programming
  {
    id: "8mAITcNt710",
    title: "Machine Learning Explained",
    description:
      "A comprehensive introduction to machine learning concepts, algorithms, and real-world applications in modern technology.",
    thumbnailUrl: "https://img.youtube.com/vi/8mAITcNt710/mqdefault.jpg",
    channelTitle: "Zach Star",
    publishedAt: "2023-01-15T10:00:00Z",
    duration: "15:30",
    viewCount: "1234567",
    category: "Computer Science",
    tags: ["machine learning", "AI", "algorithms", "data science", "artificial intelligence"],
    difficulty: "Intermediate",
    subject: "Computer Science",
  },
  {
    id: "rfscVS0vtbw",
    title: "How do computers read code?",
    description:
      "Understanding how computers interpret and execute programming code step by step, from source code to machine language.",
    thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/mqdefault.jpg",
    channelTitle: "Frame of Essence",
    publishedAt: "2023-02-20T14:30:00Z",
    duration: "12:45",
    viewCount: "987654",
    category: "Computer Science",
    tags: ["programming", "compilers", "code execution", "computer science", "software"],
    difficulty: "Beginner",
    subject: "Computer Science",
  },
  {
    id: "YAXLy4jNhAs",
    title: "Introduction to Programming",
    description:
      "Learn the fundamental concepts of programming including variables, functions, loops, and data structures.",
    thumbnailUrl: "https://img.youtube.com/vi/YAXLy4jNhAs/mqdefault.jpg",
    channelTitle: "Crash Course Computer Science",
    publishedAt: "2023-08-15T11:30:00Z",
    duration: "12:28",
    viewCount: "720000",
    category: "Computer Science",
    tags: ["programming basics", "coding", "variables", "functions", "beginner programming"],
    difficulty: "Beginner",
    subject: "Computer Science",
  },
  {
    id: "kO2x8wSpmWc",
    title: "How Does the Internet Work?",
    description:
      "Understanding the fundamentals of how the internet and web work, including protocols, servers, and data transmission.",
    thumbnailUrl: "https://img.youtube.com/vi/kO2x8wSpmWc/mqdefault.jpg",
    channelTitle: "Crash Course Computer Science",
    publishedAt: "2023-09-01T16:45:00Z",
    duration: "13:42",
    viewCount: "680000",
    category: "Computer Science",
    tags: ["internet", "networking", "web", "protocols", "TCP/IP"],
    difficulty: "Intermediate",
    subject: "Computer Science",
  },

  // Mathematics
  {
    id: "byHcYRpMgI4",
    title: "The Map of Mathematics",
    description:
      "A visual guide to the different areas of mathematics and how they connect to each other, from pure math to applied mathematics.",
    thumbnailUrl: "https://img.youtube.com/vi/byHcYRpMgI4/mqdefault.jpg",
    channelTitle: "Domain of Science",
    publishedAt: "2023-03-10T09:15:00Z",
    duration: "11:06",
    viewCount: "756432",
    category: "Mathematics",
    tags: ["mathematics", "math overview", "algebra", "geometry", "calculus", "statistics"],
    difficulty: "Beginner",
    subject: "Mathematics",
  },
  {
    id: "WUvTyaaNkzM",
    title: "The essence of calculus",
    description:
      "Understanding the fundamental concepts of calculus through beautiful visual explanations and intuitive examples.",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-15T14:00:00Z",
    duration: "17:04",
    viewCount: "1800000",
    category: "Mathematics",
    tags: ["calculus", "derivatives", "integrals", "mathematics", "visual math"],
    difficulty: "Intermediate",
    subject: "Mathematics",
  },
  {
    id: "spUNpyF58BY",
    title: "Linear algebra - full course",
    description:
      "Complete introduction to linear algebra concepts including vectors, matrices, eigenvalues, and applications in computer science.",
    thumbnailUrl: "https://img.youtube.com/vi/spUNpyF58BY/mqdefault.jpg",
    channelTitle: "freeCodeCamp.org",
    publishedAt: "2023-08-01T09:00:00Z",
    duration: "20:52",
    viewCount: "950000",
    category: "Mathematics",
    tags: ["linear algebra", "vectors", "matrices", "eigenvalues", "math"],
    difficulty: "Intermediate",
    subject: "Mathematics",
  },

  // Artificial Intelligence
  {
    id: "aircAruvnKk",
    title: "But what is a neural network?",
    description:
      "An intuitive explanation of neural networks and deep learning concepts with visual examples and practical applications.",
    thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    channelTitle: "3Blue1Brown",
    publishedAt: "2023-07-01T10:00:00Z",
    duration: "19:13",
    viewCount: "2100000",
    category: "Artificial Intelligence",
    tags: ["neural networks", "deep learning", "AI", "machine learning", "artificial intelligence"],
    difficulty: "Intermediate",
    subject: "Artificial Intelligence",
  },
  {
    id: "yQP4UJhNn0I",
    title: "What is an Algorithm?",
    description:
      "Introduction to algorithms and their importance in computer science, including sorting, searching, and optimization.",
    thumbnailUrl: "https://img.youtube.com/vi/yQP4UJhNn0I/mqdefault.jpg",
    channelTitle: "Crash Course Computer Science",
    publishedAt: "2023-05-12T11:45:00Z",
    duration: "13:15",
    viewCount: "543210",
    category: "Computer Science",
    tags: ["algorithms", "sorting", "searching", "computer science", "programming"],
    difficulty: "Beginner",
    subject: "Computer Science",
  },

  // Physics
  {
    id: "QcUey-DVYjk",
    title: "How Electricity Actually Works",
    description:
      "Understanding the fundamentals of electricity, electrical circuits, current, voltage, and resistance with practical examples.",
    thumbnailUrl: "https://img.youtube.com/vi/QcUey-DVYjk/mqdefault.jpg",
    channelTitle: "Veritasium",
    publishedAt: "2023-04-05T16:20:00Z",
    duration: "18:22",
    viewCount: "654321",
    category: "Physics",
    tags: ["electricity", "circuits", "voltage", "current", "physics", "electronics"],
    difficulty: "Intermediate",
    subject: "Physics",
  },
  {
    id: "kYIS7j4fHIU",
    title: "Introduction to Quantum Physics",
    description:
      "Basic concepts of quantum physics including wave-particle duality, uncertainty principle, and quantum mechanics fundamentals.",
    thumbnailUrl: "https://img.youtube.com/vi/kYIS7j4fHIU/mqdefault.jpg",
    channelTitle: "MinutePhysics",
    publishedAt: "2023-06-18T13:30:00Z",
    duration: "14:30",
    viewCount: "432109",
    category: "Physics",
    tags: ["quantum physics", "quantum mechanics", "physics", "wave-particle duality", "uncertainty"],
    difficulty: "Advanced",
    subject: "Physics",
  },

  // Chemistry
  {
    id: "kYIS7j4fHIU",
    title: "Introduction to Chemistry",
    description:
      "Basic concepts of chemistry including atoms, molecules, chemical reactions, and the periodic table of elements.",
    thumbnailUrl: "https://img.youtube.com/vi/kYIS7j4fHIU/mqdefault.jpg",
    channelTitle: "Crash Course Chemistry",
    publishedAt: "2023-06-18T13:30:00Z",
    duration: "14:30",
    viewCount: "432109",
    category: "Chemistry",
    tags: ["chemistry", "atoms", "molecules", "periodic table", "chemical reactions"],
    difficulty: "Beginner",
    subject: "Chemistry",
  },

  // Biology
  {
    id: "H8WJ2KENlK0",
    title: "DNA and Genetics Explained",
    description: "Understanding DNA structure, genetic inheritance, mutations, and the basics of molecular biology.",
    thumbnailUrl: "https://img.youtube.com/vi/H8WJ2KENlK0/mqdefault.jpg",
    channelTitle: "Crash Course Biology",
    publishedAt: "2023-09-10T14:00:00Z",
    duration: "16:45",
    viewCount: "890000",
    category: "Biology",
    tags: ["DNA", "genetics", "biology", "inheritance", "molecular biology"],
    difficulty: "Intermediate",
    subject: "Biology",
  },
]

export function searchVideos(
  query: string,
  filters?: {
    category?: string
    difficulty?: string
    subject?: string
  },
): VideoData[] {
  if (!query.trim() && !filters) {
    return educationalVideoDatabase
  }

  let results = educationalVideoDatabase

  // Apply text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(" ")
    results = results.filter((video) => {
      const searchableText = `
        ${video.title} 
        ${video.description} 
        ${video.channelTitle} 
        ${video.category} 
        ${video.subject}
        ${video.tags.join(" ")}
      `.toLowerCase()

      return searchTerms.every((term) => searchableText.includes(term))
    })
  }

  // Apply filters
  if (filters?.category && filters.category !== "all") {
    results = results.filter((video) => video.category === filters.category)
  }

  if (filters?.difficulty && filters.difficulty !== "all") {
    results = results.filter((video) => video.difficulty === filters.difficulty)
  }

  if (filters?.subject && filters.subject !== "all") {
    results = results.filter((video) => video.subject === filters.subject)
  }

  // Sort by relevance (simple scoring based on title matches)
  if (query.trim()) {
    const queryLower = query.toLowerCase()
    results.sort((a, b) => {
      const aScore =
        (a.title.toLowerCase().includes(queryLower) ? 10 : 0) + (a.tags.some((tag) => tag.includes(queryLower)) ? 5 : 0)
      const bScore =
        (b.title.toLowerCase().includes(queryLower) ? 10 : 0) + (b.tags.some((tag) => tag.includes(queryLower)) ? 5 : 0)
      return bScore - aScore
    })
  }

  return results
}

export function getPopularSearchTerms(): string[] {
  return [
    "machine learning",
    "programming",
    "calculus",
    "neural networks",
    "algorithms",
    "physics",
    "chemistry",
    "linear algebra",
    "quantum physics",
    "DNA genetics",
    "electricity",
    "internet networking",
  ]
}

export function getCategories(): string[] {
  return [...new Set(educationalVideoDatabase.map((v) => v.category))]
}

export function getDifficulties(): string[] {
  return ["Beginner", "Intermediate", "Advanced"]
}

export function getSubjects(): string[] {
  return [...new Set(educationalVideoDatabase.map((v) => v.subject))]
}
