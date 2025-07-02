"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Users, Loader2, Filter, X, TrendingUp, Clock } from "lucide-react"
import {
  searchVideos,
  getPopularSearchTerms,
  getCategories,
  getDifficulties,
  getSubjects,
  type VideoData,
} from "@/lib/video-database"

interface EnhancedVideoSearchProps {
  onVideoSelect: (video: any) => void
}

export function EnhancedVideoSearch({ onVideoSelect }: EnhancedVideoSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const popularTerms = getPopularSearchTerms()
  const categories = getCategories()
  const difficulties = getDifficulties()
  const subjects = getSubjects()

  // Search results with memoization for performance
  const searchResults = useMemo(() => {
    setIsLoading(true)
    const results = searchVideos(searchQuery, {
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
      subject: selectedSubject !== "all" ? selectedSubject : undefined,
    })
    setTimeout(() => setIsLoading(false), 300) // Simulate search delay
    return results
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedSubject])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by the useMemo above
  }

  const handlePopularTermClick = (term: string) => {
    setSearchQuery(term)
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedSubject("all")
    setSearchQuery("")
  }

  const formatDuration = (duration: string) => {
    return duration
  }

  const formatViewCount = (viewCount: string) => {
    const num = Number.parseInt(viewCount)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const handleVideoClick = (video: VideoData) => {
    onVideoSelect({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnailUrl,
      duration: video.duration,
      views: formatViewCount(video.viewCount),
      channel: video.channelTitle,
      publishedAt: video.publishedAt,
      category: video.category,
    })
  }

  const activeFiltersCount = [selectedCategory, selectedDifficulty, selectedSubject].filter((f) => f !== "all").length

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for educational content... (e.g., 'machine learning', 'calculus', 'programming')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {(searchQuery || activeFiltersCount > 0) && (
            <Button type="button" variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        {/* Popular Search Terms */}
        {!searchQuery && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Popular searches:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTerms.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePopularTermClick(term)}
                  className="text-xs"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Educational Videos"}
            </h3>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <Badge variant="secondary">{searchResults.length} videos found</Badge>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <Badge variant="outline" className="gap-1">
                Category: {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
              </Badge>
            )}
            {selectedDifficulty !== "all" && (
              <Badge variant="outline" className="gap-1">
                Level: {selectedDifficulty}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedDifficulty("all")} />
              </Badge>
            )}
            {selectedSubject !== "all" && (
              <Badge variant="outline" className="gap-1">
                Subject: {selectedSubject}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSubject("all")} />
              </Badge>
            )}
          </div>
        )}

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((video) => (
              <Card
                key={video.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=180&width=320"
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`text-white ${
                        video.difficulty === "Beginner"
                          ? "bg-green-600"
                          : video.difficulty === "Intermediate"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }`}
                    >
                      {video.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">{video.title}</h4>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{video.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {video.channelTitle}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {formatViewCount(video.viewCount)} views
                    </span>
                  </div>

                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No videos found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No educational videos found for "${searchQuery}". Try different keywords or adjust your filters.`
                : "No videos match your current filters. Try adjusting your search criteria."}
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
