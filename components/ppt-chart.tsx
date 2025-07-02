"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
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
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

interface PPTChartProps {
  data: any
  className?: string
}

export function PPTChart({ data, className = "" }: PPTChartProps) {
  if (!data || !data.type) {
    return <div className="p-4 text-center text-muted-foreground">No chart data available</div>
  }

  const chartData: ChartData<"bar" | "line" | "pie"> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset: any) => ({
      ...dataset,
      backgroundColor:
        data.type === "pie"
          ? generateColorArray(data.datasets.length)
          : dataset.backgroundColor || "rgba(75, 192, 192, 0.6)",
      borderColor: dataset.borderColor || "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    })),
  }

  const options: ChartOptions<"bar" | "line" | "pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: data.title || "Data Visualization",
      },
    },
  }

  const renderChart = () => {
    switch (data.type) {
      case "bar":
        return <Bar data={chartData} options={options} />
      case "line":
        return <Line data={chartData} options={options} />
      case "pie":
        return <Pie data={chartData} options={options} />
      default:
        return <Bar data={chartData} options={options} />
    }
  }

  return <div className={`w-full h-64 ${className}`}>{renderChart()}</div>
}

function generateColorArray(count: number) {
  const colors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ]

  if (count <= colors.length) {
    return colors.slice(0, count)
  }

  // If we need more colors than in our predefined array, generate them
  const result = [...colors]
  for (let i = colors.length; i < count; i++) {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    result.push(`rgba(${r}, ${g}, ${b}, 0.6)`)
  }

  return result
}
