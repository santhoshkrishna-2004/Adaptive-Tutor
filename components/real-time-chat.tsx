"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Paperclip, Send, Users } from "lucide-react"
import { useWebSocketContext } from "./websocket-provider"
import type { StudyGroupMessage } from "@/lib/study-groups"

interface RealTimeChatProps {
  groupId: string
  initialMessages: StudyGroupMessage[]
  userId: string
  userName: string
}

interface TypingUser {
  userId: string
  userName: string
  timestamp: number
}

export function RealTimeChat({ groupId, initialMessages, userId, userName }: RealTimeChatProps) {
  const [messages, setMessages] = useState<StudyGroupMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { sendMessage, subscribe, isConnected } = useWebSocketContext()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Subscribe to chat messages for this group
    const unsubscribeChatMessages = subscribe("chat_message", (wsMessage) => {
      if (wsMessage.groupId === groupId) {
        const chatMessage: StudyGroupMessage = {
          id: wsMessage.payload.id || `msg-${Date.now()}`,
          groupId: wsMessage.groupId,
          userId: wsMessage.userId || "unknown",
          userName: wsMessage.payload.userName || "Unknown User",
          content: wsMessage.payload.content,
          timestamp: wsMessage.timestamp,
          attachmentUrl: wsMessage.payload.attachmentUrl,
          attachmentType: wsMessage.payload.attachmentType,
        }

        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((msg) => msg.id === chatMessage.id)) {
            return prev
          }
          return [...prev, chatMessage]
        })
      }
    })

    // Subscribe to typing indicators
    const unsubscribeTyping = subscribe("typing", (wsMessage) => {
      if (wsMessage.groupId === groupId && wsMessage.userId !== userId) {
        const typingUser: TypingUser = {
          userId: wsMessage.userId || "unknown",
          userName: wsMessage.payload.userName || "Unknown User",
          timestamp: Date.now(),
        }

        setTypingUsers((prev) => {
          const filtered = prev.filter((user) => user.userId !== typingUser.userId)
          if (wsMessage.payload.isTyping) {
            return [...filtered, typingUser]
          }
          return filtered
        })
      }
    })

    // Subscribe to user presence
    const unsubscribeUserJoined = subscribe("user_joined", (wsMessage) => {
      if (wsMessage.groupId === groupId) {
        setOnlineUsers((prev) => new Set([...prev, wsMessage.userId || "unknown"]))
      }
    })

    const unsubscribeUserLeft = subscribe("user_left", (wsMessage) => {
      if (wsMessage.groupId === groupId) {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(wsMessage.userId || "unknown")
          return newSet
        })
      }
    })

    return () => {
      unsubscribeChatMessages()
      unsubscribeTyping()
      unsubscribeUserJoined()
      unsubscribeUserLeft()
    }
  }, [groupId, userId, subscribe])

  // Clean up old typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setTypingUsers((prev) => prev.filter((user) => now - user.timestamp < 3000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !isConnected) return

    setIsSubmitting(true)

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Optimistically add message to UI immediately
    const optimisticMessage: StudyGroupMessage = {
      id: messageId,
      groupId,
      userId,
      userName,
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticMessage])

    try {
      // Send via WebSocket
      sendMessage({
        type: "chat_message",
        groupId,
        payload: {
          id: messageId,
          content: newMessage,
          userName: userName,
        },
      })

      setNewMessage("")

      // Stop typing indicator
      sendMessage({
        type: "typing",
        groupId,
        payload: {
          userName: userName,
          isTyping: false,
        },
      })
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!isConnected) return

    // Send typing indicator
    sendMessage({
      type: "typing",
      groupId,
      payload: {
        userName: userName,
        isTyping: value.length > 0,
      },
    })

    // Clear typing indicator after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendMessage({
        type: "typing",
        groupId,
        payload: {
          userName: userName,
          isTyping: false,
        },
      })
    }, 3000)
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  // Group messages by date
  const groupedMessages: { [date: string]: StudyGroupMessage[] } = {}
  messages.forEach((message) => {
    const date = formatMessageDate(message.timestamp)
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Group Chat</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {isConnected ? "Connected" : "Connecting..."}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{onlineUsers.size + 1}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">{date}</div>
            </div>

            {dateMessages.map((message) => (
              <div key={message.id} className={`flex ${message.userId === userId ? "justify-end" : "justify-start"}`}>
                <div className="flex gap-2 max-w-[80%]">
                  {message.userId !== userId && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {message.userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {message.userId !== userId && (
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        {message.userName}
                        {onlineUsers.has(message.userId) && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.userId === userId ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                      {message.attachmentUrl && (
                        <div className="mt-2">
                          <a
                            href={message.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline flex items-center gap-1"
                          >
                            <Paperclip className="h-3 w-3" />
                            {message.attachmentType || "Attachment"}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">...</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center gap-1">
                  <span>
                    {typingUsers.map((u) => u.userName).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={isSubmitting || !isConnected}
          />
          <Button type="submit" size="icon" disabled={isSubmitting || !newMessage.trim() || !isConnected}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
