"use server"

export interface SlideContent {
  title: string
  content: string[]
  imagePrompt?: string
  chartData?: any
}

export interface PPTContent {
  title: string
  slides: SlideContent[]
  theme: string
}

export async function generatePPTFromVideo(videoData: {
  id: string
  title: string
  description: string
}): Promise<PPTContent> {
  // In a real implementation, this would use AI to analyze the video content
  // For now, we'll generate a mock PPT based on the video title and description

  const title = videoData.title
  const description = videoData.description || "Educational content"

  // Extract potential topics from the title and description
  const topics = extractTopics(title, description)

  // Generate slides based on topics
  const slides: SlideContent[] = [
    {
      title: "Introduction",
      content: [title, "Key concepts and learning objectives", "Why this topic matters"],
      imagePrompt: `Conceptual illustration of ${title}`,
    },
  ]

  // Add topic slides
  topics.forEach((topic, index) => {
    slides.push({
      title: topic,
      content: [`Key point 1 about ${topic}`, `Key point 2 about ${topic}`, `Key point 3 about ${topic}`],
      imagePrompt: `Illustration of ${topic}`,
    })

    // Add a chart for one of the slides
    if (index === 1) {
      slides.push({
        title: `${topic} - Data Analysis`,
        content: [
          "Data shows the following trends:",
          "- Increasing adoption in recent years",
          "- Correlation with improved outcomes",
          "- Variations across different applications",
        ],
        chartData: generateChartData(topic),
      })
    }
  })

  // Add summary slide
  slides.push({
    title: "Summary",
    content: [
      "Key takeaways:",
      ...topics.map((topic) => `- Understanding of ${topic}`),
      "Next steps and further learning",
    ],
    imagePrompt: `Summary of ${title}`,
  })

  return {
    title,
    slides,
    theme: getRandomTheme(),
  }
}

function extractTopics(title: string, description: string): string[] {
  // In a real implementation, this would use NLP to extract topics
  // For now, we'll generate some mock topics based on the title

  const words = title.split(" ")
  const topics = []

  // Generate 3-4 topics
  if (words.length > 3) {
    topics.push(words.slice(0, 2).join(" "))
    topics.push(words.slice(2, 4).join(" "))
    if (words.length > 5) {
      topics.push(words.slice(4, 6).join(" "))
    }
  } else {
    topics.push(title)
    topics.push("Core Concepts")
    topics.push("Applications")
  }

  // Add a generic topic if we don't have enough
  if (topics.length < 3) {
    topics.push("Key Principles")
  }

  return topics
}

function generateChartData(topic: string) {
  // Generate mock chart data based on the topic
  return {
    type: "bar", // or "line", "pie"
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: `${topic} Growth`,
        data: [
          Math.floor(Math.random() * 50) + 10,
          Math.floor(Math.random() * 50) + 20,
          Math.floor(Math.random() * 50) + 30,
          Math.floor(Math.random() * 50) + 40,
          Math.floor(Math.random() * 50) + 50,
        ],
      },
      {
        label: "Industry Average",
        data: [
          Math.floor(Math.random() * 30) + 10,
          Math.floor(Math.random() * 30) + 15,
          Math.floor(Math.random() * 30) + 20,
          Math.floor(Math.random() * 30) + 25,
          Math.floor(Math.random() * 30) + 30,
        ],
      },
    ],
  }
}

function getRandomTheme() {
  const themes = ["professional", "creative", "minimal", "academic", "modern"]
  return themes[Math.floor(Math.random() * themes.length)]
}
