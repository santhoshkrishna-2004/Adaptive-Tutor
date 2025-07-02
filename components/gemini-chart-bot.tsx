"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  SendHorizontal,
  BarChart2,
  PieChart,
  LineChart,
  Loader2,
  Brain,
  HelpCircle,
  Sparkles,
  Zap,
  Clock,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line as RechartsLine, Pie } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

type ChartType = "bar" | "line" | "pie" | "radar"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  chartData?: any
  chartType?: ChartType
  isAnimating?: boolean
}

interface GeminiChartBotProps {
  videoTitle?: string
  videoDescription?: string
}

export function GeminiChartBot({ videoTitle = "Educational Content" }: GeminiChartBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: `🎓 **Welcome to the Interactive Learning Chart Assistant!**

I'm your AI-powered data visualization companion! I can create beautiful, interactive charts to help you understand your learning journey better.

✨ **What I can create for you:**

📈 **Progress Analytics** - Track your learning over time
📊 **Subject Comparisons** - Compare different topics and skills  
🥧 **Knowledge Distribution** - Visualize your learning portfolio
🎯 **Skill Assessments** - Analyze your competencies

🚀 **Try the glowing quick action buttons below or ask me anything!**`,
      role: "assistant",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

  const generateChartResponse = async (userMessage: string): Promise<Message> => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    const lowerMessage = userMessage.toLowerCase()
    const response: Message = {
      id: Date.now().toString(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isAnimating: true,
    }

    if (lowerMessage.includes("progress") || lowerMessage.includes("time") || lowerMessage.includes("timeline")) {
      response.content = `📈 **Your Learning Progress Journey**

🎯 **Amazing insights from your 8-week learning adventure:**

✨ **Key Highlights:**
• **Consistent Growth**: Your progress shows steady improvement week over week
• **Strong Understanding**: Your comprehension closely follows your progress  
• **Excellent Retention**: You're retaining 88% of what you learn
• **Building Confidence**: Your confidence has grown from 8% to 85%

🚀 **You're crushing it! This upward trend shows dedication and effective learning strategies.**`
      response.chartType = "line"
      response.chartData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
        datasets: [
          {
            label: "Progress %",
            data: [15, 28, 42, 58, 70, 82, 88, 92],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Understanding %",
            data: [12, 25, 38, 52, 65, 78, 85, 90],
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    } else if (lowerMessage.includes("compare") || lowerMessage.includes("subject") || lowerMessage.includes("topic")) {
      response.content = `📊 **Subject Performance Analysis**

🎓 **Your academic performance breakdown across subjects:**

🏆 **Top Performers:**
• **Programming**: Excellent mastery (88%) despite moderate difficulty
• **Mathematics**: Strong performance with high difficulty handling

⚡ **Growth Opportunities:**
• **Physics**: Most challenging subject - consider extra study time
• **Chemistry**: Good balance but room for improvement

💡 **Study Recommendation**: Allocate 20% more time to Physics to boost mastery from 58% to 75%+`
      response.chartType = "bar"
      response.chartData = {
        labels: ["Mathematics", "Physics", "Programming", "Chemistry", "Biology"],
        datasets: [
          {
            label: "Mastery Level (%)",
            data: [72, 58, 88, 65, 75],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(139, 92, 246, 0.8)",
            ],
            borderColor: [
              "rgb(59, 130, 246)",
              "rgb(239, 68, 68)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(139, 92, 246)",
            ],
            borderWidth: 2,
          },
        ],
      }
    } else if (
      lowerMessage.includes("distribution") ||
      lowerMessage.includes("breakdown") ||
      lowerMessage.includes("knowledge")
    ) {
      response.content = `🥧 **Knowledge Portfolio Analysis**

🎯 **Your learning status distribution - this is impressive!**

🌟 **Portfolio Breakdown:**
• **Mastered (45%)**: Nearly half your curriculum is fully understood! 
• **Learning (30%)**: Actively progressing with solid momentum
• **Review Needed (15%)**: Previously learned content needing refresh
• **To Learn (10%)**: Fresh territory ahead

🚀 **Status**: You're in the top 20% of learners! Your 45% mastery rate is exceptional for this stage.

💡 **Next Steps**: Focus on the 15% review content to solidify your foundation before tackling new material.`
      response.chartType = "pie"
      response.chartData = {
        labels: ["Mastered", "Learning", "Review Needed", "To Learn"],
        datasets: [
          {
            data: [45, 30, 15, 10],
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
            borderColor: ["rgb(16, 185, 129)", "rgb(59, 130, 246)", "rgb(245, 158, 11)", "rgb(239, 68, 68)"],
            borderWidth: 2,
          },
        ],
      }
    } else {
      response.content = `📊 **Learning Performance Overview**

🎓 **Here's a comprehensive view of your academic performance across key areas:**

💡 **Performance Insights:**
• **Theory (90%)**: Exceptional conceptual understanding
• **Practical Skills (88%)**: Strong hands-on application
• **Core Concepts (82%)**: Solid foundational knowledge
• **Advanced Topics (68%)**: Room for growth in complex areas

🎯 **Key Observations:**
• You excel at theoretical understanding and practical application
• Core concepts are well-established
• Advanced topics present the biggest opportunity for improvement

🚀 **Recommendation**: Your strong theory-practice balance is ideal! Focus next on advanced topics to reach expert level.`
      response.chartType = "bar"
      response.chartData = {
        labels: ["Theory", "Practical Skills", "Core Concepts", "Advanced Topics"],
        datasets: [
          {
            label: "Performance Level (%)",
            data: [90, 88, 82, 68],
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
            borderColor: ["rgb(16, 185, 129)", "rgb(59, 130, 246)", "rgb(245, 158, 11)", "rgb(239, 68, 68)"],
            borderWidth: 2,
          },
        ],
      }
    }

    return response
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const assistantResponse = await generateChartResponse(inputMessage)
      setMessages((prev) => [...prev, assistantResponse])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          "🚨 Oops! I encountered an error creating your chart. Please try again with a different question - I'm eager to help visualize your learning data!",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderChart = (message: Message) => {
    if (!message.chartData || !message.chartType) return null

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      scales:
        message.chartType !== "pie"
          ? {
              x: {
                display: true,
              },
              y: {
                display: true,
                beginAtZero: true,
                max: message.chartType === "line" ? 100 : undefined,
              },
            }
          : undefined,
    }

    switch (message.chartType) {
      case "line":
        return (
          <div className="animate-fade-in h-80">
            <RechartsLine data={message.chartData} options={chartOptions} />
          </div>
        )

      case "bar":
        return (
          <div className="animate-fade-in h-80">
            <Bar data={message.chartData} options={chartOptions} />
          </div>
        )

      case "pie":
        return (
          <div className="animate-fade-in h-80">
            <Pie
              data={message.chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom" as const,
                  },
                },
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        <CardTitle className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              Interactive Learning Chart Assistant
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <CardDescription className="text-blue-100 text-base">
              AI-powered data visualization for your educational journey
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="space-y-8">
          {/* Messages */}
          <div className="h-96 overflow-y-auto border-2 border-blue-200 rounded-xl p-6 space-y-6 bg-white shadow-inner">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-10 w-10 border-2 border-blue-300 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Brain className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-6 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "bg-white border-2 border-gray-100"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  {message.chartData && (
                    <div className="mt-6 bg-white rounded-xl p-6 border-2 border-gray-100 shadow-lg">
                      {renderChart(message)}
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-3 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-10 w-10 border-2 border-blue-300 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {(isLoading || isTyping) && (
              <div className="flex gap-4 justify-start animate-slide-in">
                <Avatar className="h-10 w-10 border-2 border-blue-300 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Brain className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {isTyping ? "Analyzing your data and crafting insights..." : "Creating your interactive chart..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-4">
            <Input
              placeholder="Ask me about your progress, compare subjects, show distributions, or analyze skills..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 border-2 border-blue-200 focus:border-blue-400 rounded-xl h-12 text-base shadow-lg"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-8 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg"
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Interactive Quick Actions */}
          <div>
            <div className="text-lg font-bold mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-500" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quick Chart Actions
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAction("Show my progress over time")}
                className="h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <LineChart className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold text-blue-800">Progress Timeline</span>
                <span className="text-xs text-blue-600">Track improvement</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAction("Compare my subjects")}
                className="h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <BarChart2 className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold text-green-800">Subject Analysis</span>
                <span className="text-xs text-green-600">Compare performance</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAction("Show my knowledge distribution")}
                className="h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-2 border-orange-200 hover:border-orange-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <PieChart className="h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold text-orange-800">Knowledge Map</span>
                <span className="text-xs text-orange-600">Learning portfolio</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAction("Analyze my skills and abilities")}
                className="h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <HelpCircle className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold text-purple-800">Skills Radar</span>
                <span className="text-xs text-purple-600">Competency analysis</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
