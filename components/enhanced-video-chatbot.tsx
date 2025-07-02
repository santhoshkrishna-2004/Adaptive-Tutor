"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SendHorizontal, BookOpen, Lightbulb, HelpCircle } from 'lucide-react'

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "explanation" | "example" | "question" | "general"
}

interface EnhancedVideoChatbotProps {
  videoTitle?: string
  subject?: string
  topic?: string
}

// Enhanced response database organized by subject and context
const responseDatabase: Record<string, Record<string, string[]>> = {
  "Data Structures": {
    "arrays": [
      "Arrays are fundamental data structures that store elements in contiguous memory locations. They provide O(1) access time using indices.",
      "The main advantage of arrays is constant-time access to elements. However, insertion and deletion can be expensive as they may require shifting elements.",
      "Arrays are ideal when you need fast random access to elements and when the size of your data is relatively fixed."
    ],
    "linked lists": [
      "Linked lists are dynamic data structures where elements (nodes) are stored in arbitrary memory locations and connected via pointers.",
      "Unlike arrays, linked lists allow efficient insertion and deletion at any position (O(1) if you have the reference), but accessing elements requires traversal (O(n)).",
      "Linked lists are perfect when you frequently insert/delete elements and don't need random access to elements."
    ],
    "stacks": [
      "Stacks follow the LIFO (Last In, First Out) principle. Think of it like a stack of plates - you can only add or remove from the top.",
      "Common stack operations are push (add element), pop (remove element), and peek/top (view top element). All operations are O(1).",
      "Stacks are used in function calls, expression evaluation, undo operations, and backtracking algorithms."
    ],
    "queues": [
      "Queues follow the FIFO (First In, First Out) principle, like a line of people waiting - first person in line is served first.",
      "Basic queue operations include enqueue (add to rear), dequeue (remove from front), and front/rear (view elements). All are O(1) in a well-implemented queue.",
      "Queues are essential in breadth-first search, scheduling algorithms, and handling requests in web servers."
    ],
    "trees": [
      "Trees are hierarchical data structures with a root node and child nodes. Each node can have multiple children but only one parent.",
      "Binary trees are special trees where each node has at most 2 children. Binary Search Trees (BST) maintain sorted order for efficient searching.",
      "Trees are used in file systems, decision making, parsing expressions, and many search algorithms."
    ]
  },
  "Algorithms": {
    "sorting": [
      "Sorting algorithms arrange elements in a specific order. Common algorithms include bubble sort, merge sort, quick sort, and heap sort.",
      "Merge sort guarantees O(n log n) time complexity and is stable, while quick sort averages O(n log n) but can degrade to O(n²) in worst case.",
      "Choose sorting algorithms based on your needs: merge sort for stability, quick sort for average performance, heap sort for guaranteed O(n log n)."
    ],
    "searching": [
      "Linear search checks each element sequentially (O(n)), while binary search works on sorted arrays by eliminating half the search space each time (O(log n)).",
      "Binary search is much faster for large datasets but requires the data to be sorted first. Linear search works on any arrangement.",
      "Hash tables provide O(1) average search time by using hash functions to directly compute the location of elements."
    ],
    "graph algorithms": [
      "Graph algorithms work on networks of connected nodes. Common algorithms include BFS, DFS, Dijkstra's, and Floyd-Warshall.",
      "BFS finds shortest paths in unweighted graphs and explores level by level. DFS goes deep into the graph and is useful for detecting cycles.",
      "Dijkstra's algorithm finds shortest paths in weighted graphs with non-negative weights, while Bellman-Ford handles negative weights."
    ]
  },
  "Database Systems": {
    "sql": [
      "SQL (Structured Query Language) is used to communicate with relational databases. It includes DDL, DML, and DCL commands.",
      "SELECT statements retrieve data, INSERT adds new records, UPDATE modifies existing data, and DELETE removes records.",
      "Joins combine data from multiple tables: INNER JOIN returns matching records, LEFT JOIN includes all left table records, RIGHT JOIN includes all right table records."
    ],
    "normalization": [
      "Database normalization reduces redundancy and improves data integrity by organizing data into related tables.",
      "First Normal Form (1NF) eliminates repeating groups, Second Normal Form (2NF) removes partial dependencies, Third Normal Form (3NF) eliminates transitive dependencies.",
      "While normalization reduces redundancy, sometimes denormalization is used for performance optimization in read-heavy applications."
    ],
    "indexing": [
      "Database indexes are data structures that improve query performance by creating shortcuts to data, similar to an index in a book.",
      "B-tree indexes are most common and work well for range queries. Hash indexes are faster for exact matches but don't support range queries.",
      "Indexes speed up SELECT operations but slow down INSERT, UPDATE, and DELETE operations because the index must be maintained."
    ]
  },
  "Computer Networks": {
    "osi model": [
      "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Each layer has specific responsibilities.",
      "The Physical layer deals with electrical signals, Data Link handles frame transmission, Network manages routing, and Transport ensures reliable delivery.",
      "Understanding the OSI model helps troubleshoot network issues by identifying which layer might be causing problems."
    ],
    "tcp/ip": [
      "TCP (Transmission Control Protocol) is reliable and connection-oriented, ensuring all data arrives in order. UDP is faster but doesn't guarantee delivery.",
      "TCP uses a three-way handshake to establish connections: SYN, SYN-ACK, ACK. This ensures both parties are ready to communicate.",
      "IP (Internet Protocol) handles addressing and routing packets across networks. IPv4 uses 32-bit addresses, while IPv6 uses 128-bit addresses."
    ],
    "routing": [
      "Routing protocols determine the best path for data to travel across networks. Common protocols include RIP, OSPF, and BGP.",
      "Static routing uses manually configured routes, while dynamic routing automatically adapts to network changes using routing protocols.",
      "Routing tables contain information about network destinations and the best paths to reach them, updated by routing protocols."
    ]
  }
}

const quickSuggestions = [
  "Explain this concept in simple terms",
  "Give me a real-world example",
  "What are the advantages and disadvantages?",
  "How does this compare to other approaches?",
  "What are common mistakes to avoid?",
  "Can you provide a code example?"
]

export function EnhancedVideoChatbot({ videoTitle = "this video", subject = "Computer Science", topic }: EnhancedVideoChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello! I'm your AI tutor specialized in ${subject}. I can help explain concepts, provide examples, and answer questions about ${videoTitle}. What would you like to learn about?`,
      role: "assistant",
      timestamp: new Date(),
      type: "general"
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])

  const generateContextualResponse = (userInput: string): { content: string; type: Message["type"] } => {
    const input = userInput.toLowerCase()
    const subjectResponses = responseDatabase[subject] || {}
    
    // Check for specific topics/keywords
    for (const [key, responses] of Object.entries(subjectResponses)) {
      if (input.includes(key)) {
        const response = responses[Math.floor(Math.random() * responses.length)]
        return { content: response, type: "explanation" }
      }
    }

    // Check for question types
    if (input.includes("example") || input.includes("show me")) {
      return {
        content: generateExample(input, subject, topic),
        type: "example"
      }
    }

    if (input.includes("compare") || input.includes("difference")) {
      return {
        content: generateComparison(input, subject),
        type: "explanation"
      }
    }

    if (input.includes("why") || input.includes("how")) {
      return {
        content: generateExplanation(input, subject, topic),
        type: "explanation"
      }
    }

    // Default contextual response
    return {
      content: generateDefaultResponse(input, subject, topic),
      type: "general"
    }
  }

  const generateExample = (input: string, subject: string, topic?: string): string => {
    const examples: Record<string, string> = {
      "Data Structures": `Here's a practical example: Imagine you're building a music playlist app. You'd use an array to store songs for quick access by index, a stack for the "undo" feature when removing songs, and a queue for the "up next" functionality where songs play in order.`,
      "Algorithms": `For example, when you search for a contact in your phone, it might use binary search if contacts are sorted alphabetically. This is much faster than checking every contact one by one (linear search).`,
      "Database Systems": `Consider an e-commerce website: Customer information is stored in a 'customers' table, products in a 'products' table, and orders in an 'orders' table. SQL joins connect these tables to show which customer bought which products.`,
      "Computer Networks": `Think of sending an email: Your message travels through multiple routers (like postal sorting facilities) using IP addresses (like postal codes) until it reaches the recipient's email server.`
    }
    
    return examples[subject] || `Here's an example related to ${topic || subject}: This concept is commonly used in real-world applications where efficiency and reliability are important.`
  }

  const generateComparison = (input: string, subject: string): string => {
    const comparisons: Record<string, string> = {
      "Data Structures": "Arrays vs Linked Lists: Arrays offer O(1) access but fixed size, while linked lists provide dynamic sizing but O(n) access. Choose arrays for frequent access, linked lists for frequent insertions/deletions.",
      "Algorithms": "Quick Sort vs Merge Sort: Quick sort is faster on average but has O(n²) worst case, while merge sort guarantees O(n log n) but uses more memory. Merge sort is also stable (preserves order of equal elements).",
      "Database Systems": "SQL vs NoSQL: SQL databases ensure ACID properties and work well with structured data, while NoSQL databases offer flexibility and scalability for unstructured data and high-volume applications.",
      "Computer Networks": "TCP vs UDP: TCP ensures reliable, ordered delivery but has overhead, while UDP is faster but doesn't guarantee delivery. Use TCP for important data, UDP for real-time applications like gaming or streaming."
    }
    
    return comparisons[subject] || "Both approaches have their strengths and are suited for different scenarios. The choice depends on your specific requirements and constraints."
  }

  const generateExplanation = (input: string, subject: string, topic?: string): string => {
    if (input.includes("why")) {
      const whyExplanations: Record<string, string> = {
        "Data Structures": "Data structures are crucial because they determine how efficiently we can store, access, and manipulate data. The right choice can make the difference between a program that runs in seconds versus hours.",
        "Algorithms": "Algorithms are step-by-step procedures for solving problems. Good algorithms can process millions of data points efficiently, while poor algorithms might take forever on the same data.",
        "Database Systems": "Databases organize and manage data systematically, ensuring data integrity, security, and efficient retrieval. They're essential for any application that needs to store and query information.",
        "Computer Networks": "Networks enable communication and resource sharing between computers. Understanding networking helps build scalable, secure, and efficient distributed systems."
      }
      return whyExplanations[subject] || `${topic || subject} is important because it forms the foundation for building efficient and reliable systems.`
    }
    
    if (input.includes("how")) {
      const howExplanations: Record<string, string> = {
        "Data Structures": "Data structures work by organizing data in memory according to specific rules and providing operations to manipulate that data efficiently.",
        "Algorithms": "Algorithms work by breaking down complex problems into smaller, manageable steps that can be executed systematically to produce the desired result.",
        "Database Systems": "Databases work by storing data in structured formats (tables, documents, etc.) and providing query languages to retrieve and manipulate that data.",
        "Computer Networks": "Networks work by breaking data into packets, routing them through interconnected devices, and reassembling them at the destination."
      }
      return howExplanations[subject] || `${topic || subject} works through a systematic approach that ensures efficiency and reliability.`
    }
    
    return `Let me explain ${topic || subject}: This is a fundamental concept that builds upon basic principles and has wide-ranging applications in computer science.`
  }

  const generateDefaultResponse = (input: string, subject: string, topic?: string): string => {
    const defaultResponses = [
      `That's a great question about ${subject}! This concept is fundamental to understanding how modern systems work.`,
      `In ${subject}, this topic connects to many other important concepts. Let me break it down for you.`,
      `This is an important aspect of ${subject}. Understanding this will help you grasp more advanced topics later.`,
      `Great question! This concept in ${subject} has practical applications in many real-world scenarios.`
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setConversationContext((prev) => [...prev, input].slice(-5)) // Keep last 5 messages for context
    setInput("")
    setIsLoading(true)

    // Generate contextual AI response
    setTimeout(() => {
      const { content, type } = generateContextualResponse(input)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        role: "assistant",
        timestamp: new Date(),
        type
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000) // Simulate realistic response time
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMessageIcon = (type?: Message["type"]) => {
    switch (type) {
      case "explanation":
        return <BookOpen className="h-3 w-3" />
      case "example":
        return <Lightbulb className="h-3 w-3" />
      case "question":
        return <HelpCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI Tutor Chat
          <Badge variant="secondary">{subject}</Badge>
          {topic && <Badge variant="outline">{topic}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>

          <div className="flex flex-col space-y-4 h-80 overflow-y-auto p-4 border rounded-md">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start gap-2`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === "user" ? (
                      <>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === "assistant" && getMessageIcon(message.type)}
                      {message.type && (
                        <Badge variant="secondary" className="text-xs">
                          {message.type}
                        </Badge>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Ask about ${subject}${topic ? ` - ${topic}` : ''}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
