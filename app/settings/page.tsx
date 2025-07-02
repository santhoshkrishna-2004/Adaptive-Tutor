"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Bell, Shield, Database, Trash2, Download, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile settings
    name: "",
    email: "",
    department: "",
    studentId: "",

    // Notification settings
    emailNotifications: true,
    quizReminders: true,
    progressUpdates: false,
    weeklyReports: true,

    // Privacy settings
    profileVisibility: "private",
    dataSharing: false,
    analyticsTracking: true,

    // Learning preferences
    defaultDifficulty: "medium",
    autoGenerateQuizzes: true,
    preferredChartType: "bar",
    studyGoal: "30", // minutes per day
  })

  const [isLoading, setIsLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("userName") || ""
      const savedEmail = localStorage.getItem("userEmail") || ""
      const savedDepartment = localStorage.getItem("userDepartment") || ""
      const savedSettings = localStorage.getItem("userSettings")

      setSettings((prev) => ({
        ...prev,
        name: savedName,
        email: savedEmail,
        department: savedDepartment,
        ...(savedSettings ? JSON.parse(savedSettings) : {}),
      }))

      setDataLoaded(true)
    } catch (error) {
      console.error("Error loading settings:", error)
      setDataLoaded(true)
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("userName", settings.name)
      localStorage.setItem("userEmail", settings.email)
      localStorage.setItem("userDepartment", settings.department)
      localStorage.setItem("userSettings", JSON.stringify(settings))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    try {
      const userData = {
        profile: {
          name: settings.name,
          email: settings.email,
          department: settings.department,
          studentId: settings.studentId,
        },
        settings,
        exportDate: new Date().toISOString(),
      }

      const dataBlob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `adaptive-ai-tutor-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAllData = () => {
    if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      try {
        // Clear all user data from localStorage
        const keysToRemove = [
          "userName",
          "userEmail",
          "userDepartment",
          "userSettings",
          "userAuth",
          "isLoggedIn",
          "searchHistory",
          "lastGeneratedPPT",
        ]

        keysToRemove.forEach((key) => localStorage.removeItem(key))

        toast({
          title: "Data Deleted",
          description: "All your data has been deleted successfully.",
        })

        // Reset settings to default
        setSettings({
          name: "",
          email: "",
          department: "",
          studentId: "",
          emailNotifications: true,
          quizReminders: true,
          progressUpdates: false,
          weeklyReports: true,
          profileVisibility: "private",
          dataSharing: false,
          analyticsTracking: true,
          defaultDifficulty: "medium",
          autoGenerateQuizzes: true,
          preferredChartType: "bar",
          studyGoal: "30",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete data. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-600">Customize your learning experience and manage your account</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and learning preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={settings.department}
                        onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                        placeholder="e.g., Computer Science Engineering"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={settings.studentId}
                        onChange={(e) => setSettings({ ...settings, studentId: e.target.value })}
                        placeholder="Enter your student ID"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Learning Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Default Quiz Difficulty</Label>
                        <Select
                          value={settings.defaultDifficulty}
                          onValueChange={(value) => setSettings({ ...settings, defaultDifficulty: value })}
                        >
                          <SelectTrigger id="difficulty">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chartType">Preferred Chart Type</Label>
                        <Select
                          value={settings.preferredChartType}
                          onValueChange={(value) => setSettings({ ...settings, preferredChartType: value })}
                        >
                          <SelectTrigger id="chartType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bar">Bar Chart</SelectItem>
                            <SelectItem value="line">Line Chart</SelectItem>
                            <SelectItem value="pie">Pie Chart</SelectItem>
                            <SelectItem value="radar">Radar Chart</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studyGoal">Daily Study Goal (minutes)</Label>
                        <Input
                          id="studyGoal"
                          type="number"
                          value={settings.studyGoal}
                          onChange={(e) => setSettings({ ...settings, studyGoal: e.target.value })}
                          placeholder="30"
                        />
                      </div>
                      <div className="flex items-center justify-between space-y-0 pt-4">
                        <div>
                          <Label htmlFor="autoQuizzes">Auto-generate Quizzes</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically generate quizzes after watching videos
                          </p>
                        </div>
                        <Switch
                          id="autoQuizzes"
                          checked={settings.autoGenerateQuizzes}
                          onCheckedChange={(checked) => setSettings({ ...settings, autoGenerateQuizzes: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about your learning progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive important updates via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="quizReminders">Quiz Reminders</Label>
                        <p className="text-sm text-gray-500">Get reminded to take quizzes</p>
                      </div>
                      <Switch
                        id="quizReminders"
                        checked={settings.quizReminders}
                        onCheckedChange={(checked) => setSettings({ ...settings, quizReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="progressUpdates">Progress Updates</Label>
                        <p className="text-sm text-gray-500">Receive updates about your learning progress</p>
                      </div>
                      <Switch
                        id="progressUpdates"
                        checked={settings.progressUpdates}
                        onCheckedChange={(checked) => setSettings({ ...settings, progressUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyReports">Weekly Reports</Label>
                        <p className="text-sm text-gray-500">Get weekly summary of your learning activity</p>
                      </div>
                      <Switch
                        id="weeklyReports"
                        checked={settings.weeklyReports}
                        onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Control your privacy settings and data usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <Select
                        value={settings.profileVisibility}
                        onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}
                      >
                        <SelectTrigger id="profileVisibility">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dataSharing">Data Sharing</Label>
                        <p className="text-sm text-gray-500">Allow sharing anonymized data for research</p>
                      </div>
                      <Switch
                        id="dataSharing"
                        checked={settings.dataSharing}
                        onCheckedChange={(checked) => setSettings({ ...settings, dataSharing: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                        <p className="text-sm text-gray-500">Help improve the platform with usage analytics</p>
                      </div>
                      <Switch
                        id="analyticsTracking"
                        checked={settings.analyticsTracking}
                        onCheckedChange={(checked) => setSettings({ ...settings, analyticsTracking: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Export or delete your personal data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">Export Your Data</h4>
                          <p className="text-sm text-gray-500">Download a copy of all your data</p>
                        </div>
                        <Button variant="outline" onClick={handleExportData}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>

                      <Alert className="border-red-200 bg-red-50">
                        <Trash2 className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <h4 className="font-medium text-red-800">Delete All Data</h4>
                            <p className="text-sm text-red-700">
                              Permanently delete all your personal data, progress, and settings. This action cannot be
                              undone.
                            </p>
                            <Button variant="destructive" size="sm" onClick={handleDeleteAllData} className="mt-2">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete All Data
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Storage Information</CardTitle>
                    <CardDescription>Information about your data storage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Local Storage</h4>
                          <p className="text-sm text-gray-600">
                            Your data is currently stored locally in your browser. For better data persistence, consider
                            upgrading to cloud storage.
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Data Usage</h4>
                          <p className="text-sm text-gray-600">
                            Profile data, quiz results, and learning progress are stored to enhance your experience.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6">
            <Button onClick={handleSaveSettings} disabled={isLoading} className="px-8">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
