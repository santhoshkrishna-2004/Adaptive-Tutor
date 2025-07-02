"use client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

interface TestResultsChartProps {
  className?: string
}

export function TestResultsChart({ className = "" }: TestResultsChartProps) {
  // Sample test data - replace with real data from your backend
  const progressData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
    datasets: [
      {
        label: "Test Scores (%)",
        data: [65, 72, 78, 85, 82, 88, 92, 95],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Average Score (%)",
        data: [70, 70, 75, 80, 80, 85, 85, 90],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  }

  const subjectScores = {
    labels: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    datasets: [
      {
        label: "Latest Test Scores",
        data: [92, 88, 85, 90, 95],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const performanceDistribution = {
    labels: ["Excellent (90-100%)", "Good (80-89%)", "Average (70-79%)", "Needs Improvement (<70%)"],
    datasets: [
      {
        data: [45, 35, 15, 5],
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
    scales: {
      x: {
        display: true,
        title: {
          display: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
        },
        min: 0,
        max: 100,
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  }

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📊 Test Results Analytics</CardTitle>
          <CardDescription>Track your learning progress and test performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Progress Over Time</TabsTrigger>
              <TabsTrigger value="subjects">Subject Scores</TabsTrigger>
              <TabsTrigger value="distribution">Performance Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <div className="h-80 w-full">
                <Line data={progressData} options={chartOptions} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <p className="text-sm text-muted-foreground">Latest Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">+12%</div>
                    <p className="text-sm text-muted-foreground">Improvement</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <p className="text-sm text-muted-foreground">Tests Taken</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4">
              <div className="h-80 w-full">
                <Bar data={subjectScores} options={barOptions} />
              </div>
              <div className="text-sm text-muted-foreground">
                Your strongest subject is Computer Science (95%), while Chemistry needs more focus (85%).
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              <div className="h-80 w-full">
                <Doughnut data={performanceDistribution} options={doughnutOptions} />
              </div>
              <div className="text-sm text-muted-foreground">
                45% of your tests are in the excellent range. Keep up the great work!
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
