"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  PlayCircle,
  FileText,
  Trophy,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Zap,
  Target,
  Award,
  Brain,
  Sparkles,
  Flame,
} from "lucide-react"

const DashboardPage = () => {
  const [userName, setUserName] = useState("Student")
  const [userStats, setUserStats] = useState({
    coursesCompleted: 3,
    totalCourses: 8,
    quizzesCompleted: 12,
    averageScore: 87,
    studyHours: 24,
    currentStreak: 5,
  })
  const [animatedStats, setAnimatedStats] = useState({
    coursesCompleted: 0,
    averageScore: 0,
    studyHours: 0,
    currentStreak: 0,
  })

  useEffect(() => {
    // Load user data
    const storedName = localStorage.getItem("userName") || "Student"
    const storedEmail = localStorage.getItem("userEmail") || ""
    setUserName(storedName || storedEmail.split("@")[0] || "Student")

    // Animate stats on load
    const animateStats = () => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setAnimatedStats({
          coursesCompleted: Math.floor(userStats.coursesCompleted * progress),
          averageScore: Math.floor(userStats.averageScore * progress),
          studyHours: Math.floor(userStats.studyHours * progress),
          currentStreak: Math.floor(userStats.currentStreak * progress),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setAnimatedStats(userStats)
        }
      }, stepDuration)
    }

    setTimeout(animateStats, 500)
  }, [])

  const recentActivities = [
    {
      type: "video",
      title: "Data Structures - Arrays",
      progress: 100,
      time: "2 hours ago",
      icon: PlayCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      type: "quiz",
      title: "Algorithm Quiz",
      score: 92,
      time: "1 day ago",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      type: "ppt",
      title: "Database Systems",
      slides: 15,
      time: "2 days ago",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      type: "video",
      title: "Machine Learning Basics",
      progress: 75,
      time: "3 days ago",
      icon: Brain,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  const subjects = [
    {
      name: "Data Structures",
      progress: 85,
      lessons: 12,
      color: "from-blue-500 to-blue-600",
      icon: "📊",
      difficulty: "Intermediate",
      nextLesson: "Binary Trees",
    },
    {
      name: "Algorithms",
      progress: 70,
      lessons: 15,
      color: "from-green-500 to-green-600",
      icon: "⚡",
      difficulty: "Advanced",
      nextLesson: "Dynamic Programming",
    },
    {
      name: "Database Systems",
      progress: 60,
      lessons: 10,
      color: "from-purple-500 to-purple-600",
      icon: "🗄️",
      difficulty: "Intermediate",
      nextLesson: "SQL Joins",
    },
    {
      name: "Computer Networks",
      progress: 45,
      lessons: 18,
      color: "from-orange-500 to-orange-600",
      icon: "🌐",
      difficulty: "Advanced",
      nextLesson: "TCP/IP Protocol",
    },
    {
      name: "Operating Systems",
      progress: 30,
      lessons: 14,
      color: "from-red-500 to-red-600",
      icon: "💻",
      difficulty: "Advanced",
      nextLesson: "Process Management",
    },
    {
      name: "Machine Learning",
      progress: 20,
      lessons: 20,
      color: "from-indigo-500 to-indigo-600",
      icon: "🤖",
      difficulty: "Expert",
      nextLesson: "Neural Networks",
    },
  ]

  const achievements = [
    { title: "First Quiz", icon: "🎯", earned: true },
    { title: "Week Streak", icon: "🔥", earned: true },
    { title: "Perfect Score", icon: "⭐", earned: true },
    { title: "Course Master", icon: "🏆", earned: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Animated Welcome Header */}
        <div className="text-center py-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
              Welcome back, {userName}! 🚀
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
              Continue your learning journey with AI-powered education. Track your progress, take quizzes, and master
              new concepts.
            </p>
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Courses Completed</p>
                  <p className="text-4xl font-bold">
                    {animatedStats.coursesCompleted}/{userStats.totalCourses}
                  </p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-200 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="mt-4">
                <Progress
                  value={(animatedStats.coursesCompleted / userStats.totalCourses) * 100}
                  className="bg-blue-400 h-2"
                />
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span className="text-xs">Keep going!</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Quiz Average</p>
                  <p className="text-4xl font-bold">{animatedStats.averageScore}%</p>
                </div>
                <Trophy className="h-10 w-10 text-green-200 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="mt-4">
                <p className="text-green-100 text-sm">{userStats.quizzesCompleted} quizzes completed</p>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span className="text-xs">Excellent!</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Study Hours</p>
                  <p className="text-4xl font-bold">{animatedStats.studyHours}h</p>
                </div>
                <Clock className="h-10 w-10 text-purple-200 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="mt-4">
                <p className="text-purple-100 text-sm">This month</p>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span className="text-xs">On track!</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Current Streak</p>
                  <p className="text-4xl font-bold">{animatedStats.currentStreak} days</p>
                </div>
                <Flame className="h-10 w-10 text-orange-200 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="mt-4">
                <p className="text-orange-100 text-sm">Keep it up! 🔥</p>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span className="text-xs">Amazing!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-blue-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <PlayCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Watch Videos</h3>
              <p className="text-gray-600 mb-6">Learn from curated educational content with AI assistance</p>
              <Button asChild className="w-full group-hover:bg-blue-600 transition-colors duration-300">
                <Link href="/dashboard/videos">
                  Start Learning
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-green-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Take Quizzes</h3>
              <p className="text-gray-600 mb-6">Test your knowledge and track progress with smart analytics</p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/quizzes">
                  Start Quiz
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-purple-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Generate PPT</h3>
              <p className="text-gray-600 mb-6">Create presentations from videos with AI-powered content</p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/ppt">
                  Create PPT
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Course Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              Your Learning Journey
            </h2>
            <Button variant="outline" asChild className="hover:bg-blue-50">
              <Link href="/dashboard/videos">View All Courses</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors duration-300">
                          {subject.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {subject.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span className="font-semibold">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-3 group-hover:h-4 transition-all duration-300" />

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{subject.lessons} lessons</span>
                      <span>{Math.floor((subject.progress / 100) * subject.lessons)} completed</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors duration-300">
                      <p className="text-xs text-gray-600 mb-1">Next Lesson:</p>
                      <p className="text-sm font-medium">{subject.nextLesson}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <Button size="sm" className="flex-1 group-hover:bg-blue-600 transition-colors duration-300" asChild>
                      <Link href={`/dashboard/videos?subject=${encodeURIComponent(subject.name)}`}>Continue</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="group-hover:border-blue-300 transition-colors duration-300"
                      asChild
                    >
                      <Link href={`/dashboard/quizzes?subject=${encodeURIComponent(subject.name)}`}>Quiz</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 ${activity.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <activity.icon className={`h-6 w-6 ${activity.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold group-hover:text-blue-600 transition-colors duration-300">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {activity.type === "video" && `${activity.progress}% completed`}
                            {activity.type === "quiz" && `Score: ${activity.score}%`}
                            {activity.type === "ppt" && `${activity.slides} slides generated`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{activity.time}</p>
                        {activity.type === "video" && activity.progress === 100 && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                            <Star className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {activity.type === "quiz" && activity.score && activity.score >= 80 && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 mt-1">
                            <Trophy className="h-3 w-3 mr-1" />
                            Great!
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Interactive Achievements */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`group transition-all duration-300 hover:shadow-lg ${
                    achievement.earned
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:-translate-y-1"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`text-2xl group-hover:scale-110 transition-transform duration-300 ${
                          achievement.earned ? "animate-pulse" : ""
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge className={achievement.earned ? "bg-yellow-500 text-white" : "bg-gray-400 text-white"}>
                          {achievement.earned ? "Earned" : "Locked"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
