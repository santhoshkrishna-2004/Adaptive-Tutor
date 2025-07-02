"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award, Search, Filter } from "lucide-react"
import { getAllBranches, getBranchById, getCoursesByBranchAndYear, searchCourses } from "@/lib/engineering-curriculum"
import type { EngineeringBranch, Course } from "@/lib/engineering-curriculum"
import Link from "next/link"

interface ComprehensiveCourseBrowserProps {
  selectedBranch?: string
  selectedYear?: number
  onCourseSelect?: (course: Course, branch: EngineeringBranch) => void
}

export function ComprehensiveCourseBrowser({
  selectedBranch,
  selectedYear,
  onCourseSelect,
}: ComprehensiveCourseBrowserProps) {
  const [branches] = useState<EngineeringBranch[]>(getAllBranches())
  const [currentBranch, setCurrentBranch] = useState<string>(selectedBranch || "computer-science")
  const [currentYear, setCurrentYear] = useState<number>(selectedYear || 1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  const currentBranchData = getBranchById(currentBranch)

  useEffect(() => {
    if (searchQuery) {
      const results = searchCourses(searchQuery, currentBranch)
      setFilteredCourses(results)
    } else {
      const courses = getCoursesByBranchAndYear(currentBranch, currentYear)
      setFilteredCourses(courses)
    }
  }, [currentBranch, currentYear, searchQuery])

  const getTypeColor = (type: Course["type"]) => {
    switch (type) {
      case "core":
        return "bg-blue-100 text-blue-800"
      case "elective":
        return "bg-green-100 text-green-800"
      case "lab":
        return "bg-purple-100 text-purple-800"
      case "project":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getYearProgress = (year: number) => {
    // Mock progress calculation
    const baseProgress = year * 20
    return Math.min(baseProgress + Math.random() * 20, 100)
  }

  const handleCourseClick = (course: Course) => {
    if (onCourseSelect && currentBranchData) {
      onCourseSelect(course, currentBranchData)
    }
  }

  const filteredByType =
    filterType === "all" ? filteredCourses : filteredCourses.filter((course) => course.type === filterType)

  return (
    <div className="space-y-6">
      {/* Branch Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Engineering Curriculum Browser
          </CardTitle>
          <CardDescription>Explore all engineering courses across all branches and years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Engineering Branch</label>
              <Select value={currentBranch} onValueChange={setCurrentBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name} ({branch.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Academic Year</label>
              <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Course Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="core">Core Subjects</SelectItem>
                  <SelectItem value="elective">Electives</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Branch Overview */}
      {currentBranchData && (
        <Card>
          <CardHeader>
            <CardTitle>{currentBranchData.name}</CardTitle>
            <CardDescription>{currentBranchData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[1, 2, 3, 4].map((year) => (
                <div key={year} className="text-center">
                  <div className="text-2xl font-bold">{year}</div>
                  <div className="text-sm text-muted-foreground">Year {year}</div>
                  <Progress value={getYearProgress(year)} className="mt-2 h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round(getYearProgress(year))}% Complete
                  </div>
                </div>
              ))}
            </div>

            {currentBranchData.specializations && (
              <div>
                <h4 className="font-medium mb-2">Specializations Available:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentBranchData.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Course Listing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{searchQuery ? `Search Results (${filteredByType.length})` : `Year ${currentYear} Courses`}</span>
            <Badge variant="outline">{filteredByType.length} courses</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredByType.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredByType.map((course) => (
                <Card
                  key={course.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCourseClick(course)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base line-clamp-2">{course.name}</CardTitle>
                        <CardDescription className="text-sm">{course.code}</CardDescription>
                      </div>
                      <Badge className={getTypeColor(course.type)}>{course.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{course.credits} credits</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/videos?subject=${encodeURIComponent(course.name)}`}>Videos</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/quizzes?subject=${encodeURIComponent(course.name)}`}>Quiz</Link>
                        </Button>
                      </div>
                    </div>
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Prerequisites: {course.prerequisites.join(", ")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Year-wise Progress Overview */}
      {!searchQuery && currentBranchData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Academic Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="year-overview">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="year-overview">Year Overview</TabsTrigger>
                <TabsTrigger value="semester-breakdown">Semester Breakdown</TabsTrigger>
              </TabsList>

              <TabsContent value="year-overview" className="space-y-4">
                {currentBranchData.curriculum.map((yearData) => {
                  const totalCourses = yearData.semester1.length + yearData.semester2.length
                  const totalCredits = [...yearData.semester1, ...yearData.semester2].reduce(
                    (sum, course) => sum + course.credits,
                    0,
                  )

                  return (
                    <Card key={yearData.year}>
                      <CardHeader>
                        <CardTitle className="text-lg">Year {yearData.year}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold">{totalCourses}</div>
                            <div className="text-sm text-muted-foreground">Total Courses</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{totalCredits}</div>
                            <div className="text-sm text-muted-foreground">Total Credits</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{Math.round(getYearProgress(yearData.year))}%</div>
                            <div className="text-sm text-muted-foreground">Progress</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>

              <TabsContent value="semester-breakdown" className="space-y-4">
                {currentBranchData.curriculum.find((y) => y.year === currentYear) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Semester 1</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentBranchData.curriculum
                            .find((y) => y.year === currentYear)!
                            .semester1.map((course) => (
                              <div key={course.id} className="flex justify-between items-center">
                                <span className="text-sm">{course.name}</span>
                                <Badge variant="outline">{course.credits} cr</Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Semester 2</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentBranchData.curriculum
                            .find((y) => y.year === currentYear)!
                            .semester2.map((course) => (
                              <div key={course.id} className="flex justify-between items-center">
                                <span className="text-sm">{course.name}</span>
                                <Badge variant="outline">{course.credits} cr</Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
