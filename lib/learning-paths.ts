export interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedHours: number
  prerequisites?: string[]
  skills: string[]
  videos: LearningVideo[]
  color: string
  icon: string
}

export interface LearningVideo {
  id: string
  title: string
  description: string
  duration: string
  order: number
  isRequired: boolean
  prerequisites?: string[]
  skills: string[]
  thumbnailUrl: string
  channelTitle: string
}

export interface UserProgress {
  pathId: string
  completedVideos: string[]
  currentVideo?: string
  startedAt: string
  lastAccessedAt: string
  completionPercentage: number
}

export const learningPaths: LearningPath[] = [
  {
    id: "computer-science-fundamentals",
    title: "Computer Science Fundamentals",
    description: "Master the core concepts of computer science from algorithms to programming",
    category: "Computer Science",
    difficulty: "Beginner",
    estimatedHours: 12,
    skills: ["Programming", "Algorithms", "Data Structures", "Problem Solving"],
    color: "bg-blue-500",
    icon: "💻",
    videos: [
      {
        id: "YAXLy4jNhAs",
        title: "Introduction to Programming",
        description: "Learn the basics of programming and computer science fundamentals",
        duration: "12:28",
        order: 1,
        isRequired: true,
        skills: ["Programming Basics", "Computer Science"],
        thumbnailUrl: "https://img.youtube.com/vi/YAXLy4jNhAs/mqdefault.jpg",
        channelTitle: "Crash Course Computer Science",
      },
      {
        id: "rfscVS0vtbw",
        title: "How do computers read code?",
        description: "Understanding how computers interpret and execute programming code",
        duration: "12:45",
        order: 2,
        isRequired: true,
        prerequisites: ["YAXLy4jNhAs"],
        skills: ["Code Execution", "Compilers"],
        thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/mqdefault.jpg",
        channelTitle: "Frame of Essence",
      },
      {
        id: "yQP4UJhNn0I",
        title: "What is an Algorithm?",
        description: "Introduction to algorithms and their importance in computer science",
        duration: "13:15",
        order: 3,
        isRequired: true,
        prerequisites: ["rfscVS0vtbw"],
        skills: ["Algorithms", "Problem Solving"],
        thumbnailUrl: "https://img.youtube.com/vi/yQP4UJhNn0I/mqdefault.jpg",
        channelTitle: "Crash Course Computer Science",
      },
      {
        id: "kO2x8wSpmWc",
        title: "How Does the Internet Work?",
        description: "Understanding the fundamentals of how the internet and web work",
        duration: "13:42",
        order: 4,
        isRequired: false,
        skills: ["Networking", "Internet Protocols"],
        thumbnailUrl: "https://img.youtube.com/vi/kO2x8wSpmWc/mqdefault.jpg",
        channelTitle: "Crash Course Computer Science",
      },
    ],
  },
  {
    id: "machine-learning-basics",
    title: "Machine Learning & AI Fundamentals",
    description: "Dive into artificial intelligence and machine learning concepts",
    category: "Artificial Intelligence",
    difficulty: "Intermediate",
    estimatedHours: 15,
    prerequisites: ["computer-science-fundamentals"],
    skills: ["Machine Learning", "Neural Networks", "AI Concepts", "Data Science"],
    color: "bg-purple-500",
    icon: "🤖",
    videos: [
      {
        id: "8mAITcNt710",
        title: "Machine Learning Explained",
        description: "A comprehensive introduction to machine learning concepts and applications",
        duration: "15:30",
        order: 1,
        isRequired: true,
        skills: ["Machine Learning Basics", "AI Overview"],
        thumbnailUrl: "https://img.youtube.com/vi/8mAITcNt710/mqdefault.jpg",
        channelTitle: "Zach Star",
      },
      {
        id: "aircAruvnKk",
        title: "But what is a neural network?",
        description: "An intuitive explanation of neural networks and deep learning concepts",
        duration: "19:13",
        order: 2,
        isRequired: true,
        prerequisites: ["8mAITcNt710"],
        skills: ["Neural Networks", "Deep Learning"],
        thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
        channelTitle: "3Blue1Brown",
      },
    ],
  },
  {
    id: "mathematics-foundation",
    title: "Mathematics for Engineers",
    description: "Essential mathematical concepts for engineering and computer science",
    category: "Mathematics",
    difficulty: "Beginner",
    estimatedHours: 20,
    skills: ["Calculus", "Linear Algebra", "Mathematical Thinking", "Problem Solving"],
    color: "bg-green-500",
    icon: "📐",
    videos: [
      {
        id: "byHcYRpMgI4",
        title: "The Map of Mathematics",
        description: "A visual guide to the different areas of mathematics and how they connect",
        duration: "11:06",
        order: 1,
        isRequired: true,
        skills: ["Mathematical Overview", "Math Concepts"],
        thumbnailUrl: "https://img.youtube.com/vi/byHcYRpMgI4/mqdefault.jpg",
        channelTitle: "Domain of Science",
      },
      {
        id: "WUvTyaaNkzM",
        title: "The essence of calculus",
        description: "Understanding the fundamental concepts of calculus through visual explanations",
        duration: "17:04",
        order: 2,
        isRequired: true,
        prerequisites: ["byHcYRpMgI4"],
        skills: ["Calculus", "Derivatives", "Mathematical Analysis"],
        thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg",
        channelTitle: "3Blue1Brown",
      },
      {
        id: "spUNpyF58BY",
        title: "Linear algebra - full course",
        description: "Complete introduction to linear algebra concepts and applications",
        duration: "20:52",
        order: 3,
        isRequired: true,
        skills: ["Linear Algebra", "Vectors", "Matrices"],
        thumbnailUrl: "https://img.youtube.com/vi/spUNpyF58BY/mqdefault.jpg",
        channelTitle: "freeCodeCamp.org",
      },
    ],
  },
  {
    id: "physics-engineering",
    title: "Physics for Engineers",
    description: "Core physics principles essential for engineering applications",
    category: "Physics",
    difficulty: "Intermediate",
    estimatedHours: 18,
    prerequisites: ["mathematics-foundation"],
    skills: ["Classical Mechanics", "Electricity", "Thermodynamics", "Wave Physics"],
    color: "bg-red-500",
    icon: "⚡",
    videos: [
      {
        id: "QcUey-DVYjk",
        title: "How Electricity Actually Works",
        description: "Understanding the fundamentals of electricity and electrical circuits",
        duration: "18:22",
        order: 1,
        isRequired: true,
        skills: ["Electricity", "Circuit Analysis", "Electromagnetic Theory"],
        thumbnailUrl: "https://img.youtube.com/vi/QcUey-DVYjk/mqdefault.jpg",
        channelTitle: "Veritasium",
      },
    ],
  },
  {
    id: "chemistry-fundamentals",
    title: "Chemistry Fundamentals",
    description: "Essential chemistry concepts for engineering and science students",
    category: "Chemistry",
    difficulty: "Beginner",
    estimatedHours: 10,
    skills: ["Chemical Reactions", "Molecular Structure", "Thermodynamics", "Materials Science"],
    color: "bg-yellow-500",
    icon: "🧪",
    videos: [
      {
        id: "kYIS7j4fHIU",
        title: "Introduction to Chemistry",
        description: "Basic concepts of chemistry including atoms, molecules, and chemical reactions",
        duration: "14:30",
        order: 1,
        isRequired: true,
        skills: ["Atomic Structure", "Chemical Bonding", "Reactions"],
        thumbnailUrl: "https://img.youtube.com/vi/kYIS7j4fHIU/mqdefault.jpg",
        channelTitle: "Crash Course Chemistry",
      },
    ],
  },
]

export function getLearningPaths(): LearningPath[] {
  return learningPaths
}

export function getLearningPathById(pathId: string): LearningPath | undefined {
  return learningPaths.find((path) => path.id === pathId)
}

export function getLearningPathsByCategory(category: string): LearningPath[] {
  return learningPaths.filter((path) => path.category === category)
}

export function getLearningPathsByDifficulty(difficulty: string): LearningPath[] {
  return learningPaths.filter((path) => path.difficulty === difficulty)
}

export function getNextVideoInPath(pathId: string, currentVideoId: string): LearningVideo | null {
  const path = getLearningPathById(pathId)
  if (!path) return null

  const currentIndex = path.videos.findIndex((video) => video.id === currentVideoId)
  if (currentIndex === -1 || currentIndex === path.videos.length - 1) return null

  return path.videos[currentIndex + 1]
}

export function getPreviousVideoInPath(pathId: string, currentVideoId: string): LearningVideo | null {
  const path = getLearningPathById(pathId)
  if (!path) return null

  const currentIndex = path.videos.findIndex((video) => video.id === currentVideoId)
  if (currentIndex <= 0) return null

  return path.videos[currentIndex - 1]
}

export function calculatePathProgress(pathId: string, completedVideos: string[]): number {
  const path = getLearningPathById(pathId)
  if (!path) return 0

  const requiredVideos = path.videos.filter((video) => video.isRequired)
  const completedRequired = requiredVideos.filter((video) => completedVideos.includes(video.id))

  return Math.round((completedRequired.length / requiredVideos.length) * 100)
}

export function getRecommendedPaths(completedPaths: string[]): LearningPath[] {
  return learningPaths.filter((path) => {
    if (completedPaths.includes(path.id)) return false

    if (!path.prerequisites) return true

    return path.prerequisites.every((prereq) => completedPaths.includes(prereq))
  })
}

export function isVideoUnlocked(pathId: string, videoId: string, completedVideos: string[]): boolean {
  const path = getLearningPathById(pathId)
  if (!path) return false

  const video = path.videos.find((v) => v.id === videoId)
  if (!video || !video.prerequisites) return true

  return video.prerequisites.every((prereq) => completedVideos.includes(prereq))
}
