"use client"

import { LearningPaths } from "@/components/learning-paths"

// Mock user progress - in a real app, this would come from your database
const mockUserProgress = {
  "computer-science-fundamentals": 75,
  "mathematics-foundation": 33,
  "machine-learning-basics": 0,
  "physics-engineering": 0,
  "chemistry-fundamentals": 50,
}

export default function LearningPathsPage() {
  return (
    <div className="container mx-auto p-6">
      <LearningPaths userProgress={mockUserProgress} />
    </div>
  )
}
