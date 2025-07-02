"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, Download, FileText, RefreshCw, Check, Plus, Trash2 } from "lucide-react"
import { PPTSlide } from "@/components/ppt-slide"
import { getVideoDetails } from "@/lib/youtube-api"
import type { SlideContent } from "@/app/actions/generate-ppt"
import { VideoSearch } from "@/components/video-search"
import { YouTubePlayer } from "@/components/youtube-player"
import type { YouTubeVideo } from "@/lib/youtube-api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

// Import the enhanced PPT generator
import { generateEnhancedPPT } from "@/app/actions/generate-ppt-enhanced"
import type { PPTContent } from "@/app/actions/generate-ppt-enhanced"

export default function PPTGenerationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const videoId = searchParams.get("videoId")

  const [selectedSubject, setSelectedSubject] = useState("")
  const [searchTopic, setSearchTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [pptContent, setPptContent] = useState<PPTContent | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [activeTab, setActiveTab] = useState("video")
  const [selectedTheme, setSelectedTheme] = useState("professional")
  const [editingSlide, setEditingSlide] = useState<SlideContent | null>(null)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Mock data for subjects and departments
  const departments = [
    {
      name: "Computer Science Engineering",
      subjects: ["Data Structures", "Algorithms", "Database Systems", "Computer Networks", "Operating Systems"],
    },
    {
      name: "Electrical Engineering",
      subjects: ["Circuit Theory", "Digital Electronics", "Power Systems", "Control Systems", "Signals and Systems"],
    },
    {
      name: "Mechanical Engineering",
      subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Manufacturing Processes", "Heat Transfer"],
    },
    {
      name: "Civil Engineering",
      subjects: [
        "Structural Analysis",
        "Geotechnical Engineering",
        "Transportation Engineering",
        "Environmental Engineering",
        "Surveying",
      ],
    },
    {
      name: "Chemical Engineering",
      subjects: [
        "Chemical Reaction Engineering",
        "Process Dynamics",
        "Fluid Mechanics",
        "Heat Transfer",
        "Mass Transfer",
      ],
    },
  ]

  const subjects = departments.flatMap((dept) => dept.subjects)

  // Fetch video if videoId is provided in URL
  useEffect(() => {
    if (videoId) {
      const fetchVideo = async () => {
        try {
          const video = await getVideoDetails(videoId)
          if (video) {
            setSelectedVideo(video)
            setActiveTab("video")
            // Add to search history
            addToSearchHistory(video.title)
          }
        } catch (error) {
          console.error("Error fetching video details:", error)
          toast({
            title: "Error",
            description: "Failed to load video details. Please try again.",
            variant: "destructive",
          })
        }
      }
      fetchVideo()
    }
  }, [videoId])

  // Load search history from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("searchHistory")
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory))
      }
    } catch (error) {
      console.error("Error loading search history:", error)
    }
  }, [])

  const addToSearchHistory = (query: string) => {
    try {
      const newHistory = [query, ...searchHistory.filter((item) => item !== query)].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))
    } catch (error) {
      console.error("Error saving search history:", error)
    }
  }

  const handleSearch = () => {
    if (searchTopic) {
      addToSearchHistory(searchTopic)
    }
  }

  // Update the handleGenerate function:
  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      let content: PPTContent

      if (selectedVideo) {
        // Generate PPT from video
        content = await generateEnhancedPPT({
          subject: selectedSubject || "Computer Science",
          topic: searchTopic || selectedVideo.title,
          videoData: {
            id: selectedVideo.id,
            title: selectedVideo.title,
            description: selectedVideo.description || "",
          },
        })
      } else {
        // Generate PPT from topic
        content = await generateEnhancedPPT({
          subject: selectedSubject || "Computer Science",
          topic: searchTopic,
          customContent: `Topic: ${searchTopic}\nSubject: ${selectedSubject}`,
        })
      }

      // Apply selected theme
      content.theme = selectedTheme

      // Save to localStorage for persistence
      try {
        localStorage.setItem("lastGeneratedPPT", JSON.stringify(content))
      } catch (error) {
        console.error("Error saving PPT to localStorage:", error)
      }

      setPptContent(content)

      toast({
        title: "Presentation Generated",
        description: "Your presentation has been successfully generated with enhanced content.",
      })
    } catch (error) {
      console.error("Error generating PPT:", error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your presentation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video)
    addToSearchHistory(video.title)
  }

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
    if (pptContent) {
      const updatedContent = {
        ...pptContent,
        theme,
      }
      setPptContent(updatedContent)

      // Update in localStorage
      try {
        localStorage.setItem("lastGeneratedPPT", JSON.stringify(updatedContent))
      } catch (error) {
        console.error("Error saving updated PPT to localStorage:", error)
      }
    }
  }

  const handleEditSlide = (slide: SlideContent, index: number) => {
    setEditingSlide({ ...slide })
    setEditingSlideIndex(index)
  }

  const handleSaveSlide = () => {
    if (editingSlide && editingSlideIndex !== null && pptContent) {
      const newSlides = [...pptContent.slides]
      newSlides[editingSlideIndex] = editingSlide
      const updatedContent = {
        ...pptContent,
        slides: newSlides,
      }

      setPptContent(updatedContent)

      // Update in localStorage
      try {
        localStorage.setItem("lastGeneratedPPT", JSON.stringify(updatedContent))
      } catch (error) {
        console.error("Error saving updated PPT to localStorage:", error)
      }

      setEditingSlide(null)
      setEditingSlideIndex(null)

      toast({
        title: "Slide Updated",
        description: "Your slide has been successfully updated.",
      })
    }
  }

  const handleAddSlide = () => {
    if (pptContent) {
      const newSlide: SlideContent = {
        title: "New Slide",
        content: ["Add your content here", "Click to edit this slide"],
        imagePrompt: "Educational illustration",
      }

      const updatedContent = {
        ...pptContent,
        slides: [...pptContent.slides, newSlide],
      }

      setPptContent(updatedContent)

      // Update in localStorage
      try {
        localStorage.setItem("lastGeneratedPPT", JSON.stringify(updatedContent))
      } catch (error) {
        console.error("Error saving updated PPT to localStorage:", error)
      }

      toast({
        title: "Slide Added",
        description: "A new slide has been added to your presentation.",
      })
    }
  }

  const handleDeleteSlide = (index: number) => {
    if (pptContent && pptContent.slides.length > 1) {
      const newSlides = pptContent.slides.filter((_, i) => i !== index)

      const updatedContent = {
        ...pptContent,
        slides: newSlides,
      }

      setPptContent(updatedContent)

      // Update in localStorage
      try {
        localStorage.setItem("lastGeneratedPPT", JSON.stringify(updatedContent))
      } catch (error) {
        console.error("Error saving updated PPT to localStorage:", error)
      }

      toast({
        title: "Slide Deleted",
        description: "The slide has been removed from your presentation.",
      })
    } else {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one slide in your presentation.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (!pptContent) return

    setIsDownloading(true)

    // Create a blob with presentation content
    const pptBlob = new Blob([JSON.stringify(pptContent, null, 2)], { type: "application/json" })

    // Create download link
    const url = URL.createObjectURL(pptBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${pptContent.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      setIsDownloading(false)
      URL.revokeObjectURL(url)

      toast({
        title: "Presentation Downloaded",
        description: "Your presentation has been downloaded successfully.",
      })
    }, 1000)
  }

  // Load last generated PPT from localStorage on component mount
  useEffect(() => {
    try {
      const savedPPT = localStorage.getItem("lastGeneratedPPT")
      if (savedPPT) {
        setPptContent(JSON.parse(savedPPT))
      }
    } catch (error) {
      console.error("Error loading saved PPT:", error)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Automatic PPT Generation</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video">Generate from Video</TabsTrigger>
          <TabsTrigger value="topic">Generate from Topic</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4 pt-4">
          {selectedVideo ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Selected Video</h3>
                <Button variant="outline" onClick={() => setSelectedVideo(null)}>
                  Change Video
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <YouTubePlayer videoId={selectedVideo.id} title={selectedVideo.title} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{selectedVideo.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{selectedVideo.channelTitle}</p>
                      <p className="text-sm line-clamp-4 mb-4">{selectedVideo.description}</p>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Presentation Theme</label>
                          <Select value={selectedTheme} onValueChange={handleThemeChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="creative">Creative</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate Presentation"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <VideoSearch onVideoSelect={handleVideoSelect} />
          )}
        </TabsContent>

        <TabsContent value="topic" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate PPT from Topic</CardTitle>
              <CardDescription>Select a subject and topic to generate a presentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Department</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.name} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Topic</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a topic..."
                      value={searchTopic}
                      onChange={(e) => setSearchTopic(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleSearch}>
                      Search
                    </Button>
                  </div>
                </div>

                {searchHistory.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Recent Searches</label>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.slice(0, 5).map((query, index) => (
                        <Button key={index} variant="outline" size="sm" onClick={() => setSearchTopic(query)}>
                          {query}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-1 block">Presentation Theme</label>
                  <Select value={selectedTheme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!selectedSubject && !searchTopic)}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Presentation"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {pptContent && (
        <>
          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Generated Presentation: {pptContent.title}</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleGenerate}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Select value={pptContent.theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button variant="outline" onClick={handleAddSlide} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Slide
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pptContent.slides.map((slide, index) => (
                <div key={index} className="relative group">
                  <PPTSlide
                    slide={slide}
                    theme={pptContent.theme}
                    index={index}
                    onClick={() => handleEditSlide(slide, index)}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSlide(index)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Edit Presentation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Presentation</DialogTitle>
                    <DialogDescription>Modify the title and theme of your presentation.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="title" className="text-right">
                        Title
                      </label>
                      <Input
                        id="title"
                        value={pptContent.title}
                        onChange={(e) => setPptContent({ ...pptContent, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="theme" className="text-right">
                        Theme
                      </label>
                      <Select value={pptContent.theme} onValueChange={handleThemeChange}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={() => {
                        // Save to localStorage
                        try {
                          localStorage.setItem("lastGeneratedPPT", JSON.stringify(pptContent))
                        } catch (error) {
                          console.error("Error saving PPT to localStorage:", error)
                        }

                        toast({
                          title: "Presentation Updated",
                          description: "Your presentation details have been updated.",
                        })
                      }}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PPT
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Edit Slide Dialog */}
      <Dialog open={editingSlide !== null} onOpenChange={(open) => !open && setEditingSlide(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Slide</DialogTitle>
            <DialogDescription>Modify the content of this slide. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editingSlide && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="slide-title" className="font-medium">
                  Slide Title
                </label>
                <Input
                  id="slide-title"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="slide-content" className="font-medium">
                  Slide Content
                </label>
                <Textarea
                  id="slide-content"
                  value={editingSlide.content.join("\n")}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      content: e.target.value.split("\n").filter((line) => line.trim() !== ""),
                    })
                  }
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter each point on a new line. Empty lines will be removed.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="image-prompt" className="font-medium">
                  Image Description
                </label>
                <Input
                  id="image-prompt"
                  value={editingSlide.imagePrompt || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, imagePrompt: e.target.value })}
                  placeholder="Describe the image you want for this slide"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSlide(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSlide}>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
