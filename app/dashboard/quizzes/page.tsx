"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Clock, CheckCircle, XCircle, RotateCcw, Play, Search, BookOpen, Target, Award } from "lucide-react"
import { generateQuiz, getSubjects, getAvailableTopics, type QuizData } from "@/lib/quiz-generator"

export default function QuizzesPage() {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [customTopic, setCustomTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [availableTopics, setAvailableTopics] = useState<string[]>([])

  const subjects = getSubjects()

  useEffect(() => {
    if (selectedSubject) {
      const topics = getAvailableTopics(selectedSubject)
      setAvailableTopics(topics)
      setSelectedTopic("")
      setCustomTopic("")
    }
  }, [selectedSubject])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizStarted, showResults])

  const handleGenerateQuiz = () => {
    if (!selectedSubject) return

    const topicToUse = customTopic.trim() || selectedTopic || "General"
    const quiz = generateQuiz(selectedSubject, topicToUse, difficulty, questionCount)
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStarted(true)
    setTimeElapsed(0)
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleFinishQuiz = () => {
    setShowResults(true)
    setQuizStarted(false)
  }

  const calculateScore = () => {
    if (!currentQuiz) return { score: 0, percentage: 0 }

    const correctAnswers = currentQuiz.questions.filter(
      (question) => selectedAnswers[question.id] === question.correctAnswer,
    ).length

    return {
      score: correctAnswers,
      percentage: Math.round((correctAnswers / currentQuiz.questions.length) * 100),
    }
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStarted(false)
    setTimeElapsed(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { text: "Excellent!", color: "bg-green-500" }
    if (percentage >= 80) return { text: "Great!", color: "bg-blue-500" }
    if (percentage >= 70) return { text: "Good", color: "bg-yellow-500" }
    if (percentage >= 60) return { text: "Fair", color: "bg-orange-500" }
    return { text: "Needs Improvement", color: "bg-red-500" }
  }

  if (showResults && currentQuiz) {
    const { score, percentage } = calculateScore()
    const badge = getScoreBadge(percentage)

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="border-2">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-full ${badge.color} flex items-center justify-center`}>
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {score}/{currentQuiz.questions.length}
              </div>
              <div className={`text-2xl font-semibold ${getScoreColor(percentage)}`}>{percentage}%</div>
              <Badge className={`${badge.color} text-white`}>{badge.text}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="font-semibold">Time Taken</div>
                <div className="text-lg">{formatTime(timeElapsed)}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="font-semibold">Accuracy</div>
                <div className="text-lg">{percentage}%</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="font-semibold">Grade</div>
                <div className="text-lg">{badge.text}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Answers:</h3>
              {currentQuiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <Card
                    key={question.id}
                    className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Your answer:</span>
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {userAnswer || "Not answered"}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Correct answer:</span>
                                <span className="text-green-600">{question.correctAnswer}</span>
                              </div>
                            )}
                            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={resetQuiz} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Quiz
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="flex-1">
                Print Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentQuiz && quizStarted) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>{currentQuiz.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeElapsed)}
                </span>
                <Badge variant="outline">
                  {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h3>
                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                  Previous
                </Button>
                <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestion.id]}>
                  {currentQuestionIndex === currentQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Interactive Quizzes</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Test your knowledge with adaptive quizzes. Generate quizzes on any topic and track your progress.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create Your Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
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

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSubject && (
            <div className="space-y-4">
              {availableTopics.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="topic">Available Topics</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a topic (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customTopic">Or Enter Custom Topic</Label>
                <Input
                  id="customTopic"
                  placeholder="e.g., Binary Search Trees, React Hooks, Linear Algebra..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  You can enter any topic! The system will generate relevant questions.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Select
              value={questionCount.toString()}
              onValueChange={(value) => setQuestionCount(Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!selectedSubject && (
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>Please select a subject to generate your quiz.</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleGenerateQuiz} disabled={!selectedSubject} className="w-full" size="lg">
            <Play className="h-4 w-4 mr-2" />
            Generate Quiz
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center p-6">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="font-semibold mb-2">Adaptive Questions</h3>
          <p className="text-sm text-gray-600">Questions generated based on your chosen topic and difficulty level</p>
        </Card>
        <Card className="text-center p-6">
          <Target className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h3 className="font-semibold mb-2">Instant Feedback</h3>
          <p className="text-sm text-gray-600">Get detailed explanations for each question after completion</p>
        </Card>
        <Card className="text-center p-6">
          <Award className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="font-semibold mb-2">Track Progress</h3>
          <p className="text-sm text-gray-600">Monitor your learning progress and identify areas for improvement</p>
        </Card>
      </div>
    </div>
  )
}
