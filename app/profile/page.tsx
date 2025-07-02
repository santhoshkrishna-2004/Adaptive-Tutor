"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Calendar, BookOpen, Trophy, Clock, TrendingUp, Save, Edit, Award, Target } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProfileImageUpload } from "@/components/profile-image-upload"

interface UserProfile {
  name: string
  email: string
  department: string
  studentId: string
  bio: string
  joinDate: string
  avatar: string
}

interface UserStats {
  totalQuizzes: number
  averageScore: number
  studyHours: number
  coursesCompleted: number
  currentStreak: number
  totalPoints: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    department: "",
    studentId: "",
    bio: "",
    joinDate: "",
    avatar: "",
  })

  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    averageScore: 0,
    studyHours: 0,
    coursesCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const achievements: Achievement[] = [
    {
      id: "first_quiz",
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      earned: true,
      earnedDate: "2024-01-15",
    },
    {
      id: "quiz_master",
      title: "Quiz Master",
      description: "Complete 10 quizzes",
      icon: "🏆",
      earned: true,
      earnedDate: "2024-02-01",
    },
    {
      id: "perfect_score",
      title: "Perfect Score",
      description: "Get 100% on a quiz",
      icon: "⭐",
      earned: true,
      earnedDate: "2024-01-20",
    },
    {
      id: "study_streak",
      title: "Study Streak",
      description: "Study for 7 consecutive days",
      icon: "🔥",
      earned: false,
    },
    {
      id: "knowledge_seeker",
      title: "Knowledge Seeker",
      description: "Complete 5 different subjects",
      icon: "📚",
      earned: false,
    },
    {
      id: "time_master",
      title: "Time Master",
      description: "Study for 50 hours total",
      icon: "⏰",
      earned: false,
    },
  ]

  const recentActivity = [
    {
      type: "quiz",
      title: "Data Structures Quiz",
      score: 85,
      date: "2024-01-10",
      subject: "Computer Science",
    },
    {
      type: "video",
      title: "Machine Learning Basics",
      progress: 100,
      date: "2024-01-09",
      subject: "AI",
    },
    {
      type: "ppt",
      title: "Database Systems Presentation",
      slides: 12,
      date: "2024-01-08",
      subject: "Database",
    },
  ]

  useEffect(() => {
    // Load profile data from localStorage
    const loadProfileData = () => {
      try {
        const savedName = localStorage.getItem("userName") || ""
        const savedEmail = localStorage.getItem("userEmail") || ""
        const savedDepartment = localStorage.getItem("userDepartment") || ""
        const savedProfile = localStorage.getItem("userProfile")

        const profileData = savedProfile ? JSON.parse(savedProfile) : {}

        setProfile({
          name: savedName || profileData.name || "",
          email: savedEmail || profileData.email || "",
          department: savedDepartment || profileData.department || "",
          studentId: profileData.studentId || "",
          bio: profileData.bio || "",
          joinDate: profileData.joinDate || "2024-01-01",
          avatar: profileData.avatar || "",
        })

        // Load stats (in a real app, this would come from the database)
        setStats({
          totalQuizzes: 12,
          averageScore: 87,
          studyHours: 24,
          coursesCompleted: 3,
          currentStreak: 5,
          totalPoints: 1250,
        })
      } catch (error) {
        console.error("Error loading profile data:", error)
      }
    }

    loadProfileData()
  }, [])

  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("userName", profile.name)
      localStorage.setItem("userEmail", profile.email)
      localStorage.setItem("userDepartment", profile.department)
      localStorage.setItem("userProfile", JSON.stringify(profile))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Adaptive AI Tutor
          </Link>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <ProfileImageUpload
                  initialImage={profile.avatar}
                  onImageChange={(imageUrl) => setProfile({ ...profile, avatar: imageUrl })}
                />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold">{profile.name || "Your Name"}</h1>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4" />
                        {profile.email || "your.email@example.com"}
                      </p>
                      {profile.department && (
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <BookOpen className="h-4 w-4" />
                          {profile.department}
                        </p>
                      )}
                      <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        Joined {new Date(profile.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                    <div className="text-sm text-gray-600">Quizzes Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{stats.averageScore}%</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{stats.studyHours}h</div>
                    <div className="text-sm text-gray-600">Study Time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{stats.currentStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {activity.type === "quiz" && <Trophy className="h-5 w-5 text-yellow-600" />}
                          {activity.type === "video" && <BookOpen className="h-5 w-5 text-blue-600" />}
                          {activity.type === "ppt" && <Award className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-600">
                            {activity.type === "quiz" && `Score: ${activity.score}%`}
                            {activity.type === "video" && `Progress: ${activity.progress}%`}
                            {activity.type === "ppt" && `${activity.slides} slides generated`}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{activity.subject}</Badge>
                          <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Data Structures</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Algorithms</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Database Systems</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.totalPoints}</div>
                        <div className="text-sm text-green-700">Total Points</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.coursesCompleted}</div>
                        <div className="text-sm text-blue-700">Courses Completed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Track your learning milestones and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <Card
                        key={achievement.id}
                        className={`border-2 ${
                          achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <h3 className="font-semibold mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {achievement.earned ? (
                            <Badge className="bg-green-500">
                              Earned {achievement.earnedDate && new Date(achievement.earnedDate).toLocaleDateString()}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Earned</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        placeholder="e.g., Computer Science Engineering"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={profile.studentId}
                        onChange={(e) => setProfile({ ...profile, studentId: e.target.value })}
                        placeholder="Enter your student ID"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
