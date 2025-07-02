"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BookOpen } from "lucide-react"
import { getLearningPaths, getLearningPathsByCategory, type LearningPath } from "@/lib/learning-paths"
import Link from "next/link"

interface LearningPathsProps {
  userProgress?: Record<string, number>
}

export function LearningPaths({ userProgress = {} }: LearningPathsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const allPaths = getLearningPaths()
  const categories = ["all", "Computer Science", "Artificial Intelligence", "Mathematics", "Physics", "Chemistry"]

  const filteredPaths = selectedCategory === "all" ? allPaths : getLearningPathsByCategory(selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        <p className="text-gray-600">Structured learning journeys to master different subjects</p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category === "all" ? "All" : category.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <LearningPathCard key={path.id} path={path} progress={userProgress[path.id] || 0} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredPaths.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No learning paths found for this category.</p>
        </div>
      )}
    </div>
  )
}

function LearningPathCard({ path, progress }: { path: LearningPath; progress: number }) {
  const requiredVideos = path.videos.filter((video) => video.isRequired).length
  const totalVideos = path.videos.length

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${path.color} flex items-center justify-center text-white text-xl`}>
              {path.icon}
            </div>
            <div>
              <CardTitle className="text-lg line-clamp-2">{path.title}</CardTitle>
              <Badge className={getDifficultyColor(path.difficulty)}>{path.difficulty}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{path.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-2">
          {path.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {path.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{path.skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {path.estimatedHours}h
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {requiredVideos}/{totalVideos} videos
          </span>
        </div>

        {path.prerequisites && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Prerequisites:</span> {path.prerequisites.length} path(s)
          </div>
        )}

        <Button asChild className="w-full">
          <Link href={`/dashboard/learning-paths/${path.id}`}>{progress > 0 ? "Continue Learning" : "Start Path"}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
