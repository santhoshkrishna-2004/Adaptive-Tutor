"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Paperclip, Send, Users, MoreVertical, Trash2, UserX, AlertTriangle, Shield, Eye, EyeOff } from "lucide-react"
import { useWebSocketContext } from "./websocket-provider"
import { chatModerationService } from "@/lib/chat-moderation"
import type { StudyGroupMessage } from "@/lib/study-groups"

interface ModeratedChatProps {
  groupId: string
  initialMessages: StudyGroupMessage[]
  userId: string
  userName: string
  userRole: "owner" | "moderator" | "member"
}

interface TypingUser {
  userId: string
  userName: string
  timestamp: number
}

interface DeletedMessage extends StudyGroupMessage {
  deleted: true
  deletedBy: string
  deletedAt: string
  deletionReason: string
}

export function ModeratedChat({ groupId, initialMessages, userId, userName, userRole }: ModeratedChatProps) {
  const [messages, setMessages] = useState<(StudyGroupMessage | DeletedMessage)[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [contentWarnings, setContentWarnings] = useState<string[]>([])
  const [showDeletedMessages, setShowDeletedMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // At the top of the component, add error boundary handling
  const [wsError, setWsError] = useState<string | null>(null)
  const webSocketContext = useWebSocketContext()

  const { sendMessage, subscribe, isConnected } = webSocketContext || {
    sendMessage: () => {},
    subscribe: () => () => {},
    isConnected: false,
  }

  const canModerate = userRole === "owner" || userRole === "moderator"

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

    // Subscribe to message deletions
    const unsubscribeMessageDeleted = subscribe("message_deleted", (wsMessage) => {
      if (wsMessage.groupId === groupId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === wsMessage.payload.messageId
              ? ({
                  ...msg,
                  deleted: true,
                  deletedBy: wsMessage.payload.deletedBy,
                  deletedAt: wsMessage.timestamp,
                  deletionReason: wsMessage.payload.reason,
                } as DeletedMessage)
              : msg,
          ),
        )
      }
    })

    // Subscribe to user muting
    const unsubscribeUserMuted = subscribe("user_muted", (wsMessage) => {
      if (wsMessage.groupId === groupId && wsMessage.payload.userId === userId) {
        // Show mute notification to the muted user
        setContentWarnings((prev) => [...prev, `You have been muted: ${wsMessage.payload.reason}`])
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

    return () => {
      unsubscribeChatMessages()
      unsubscribeMessageDeleted()
      unsubscribeUserMuted()
      unsubscribeTyping()
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

    // Check if user is muted
    const muteStatus = chatModerationService.isUserMuted(userId, groupId)
    if (muteStatus.muted) {
      setContentWarnings([`You are muted: ${muteStatus.mutedUser?.reason || "No reason provided"}`])
      return
    }

    // Check spam rate
    const spamCheck = chatModerationService.checkSpamRate(userId, groupId)
    if (spamCheck.isSpam) {
      setContentWarnings([spamCheck.warning || "Rate limit exceeded"])
      return
    }

    // Filter content
    const filterResult = chatModerationService.filterMessage(newMessage, groupId)

    if (filterResult.blocked) {
      setContentWarnings(filterResult.warnings)
      return
    }

    if (filterResult.warnings.length > 0) {
      setContentWarnings(filterResult.warnings)
    }

    setIsSubmitting(true)
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Use filtered content
    const contentToSend = filterResult.filtered

    // Optimistically add message to UI immediately
    const optimisticMessage: StudyGroupMessage = {
      id: messageId,
      groupId,
      userId,
      userName,
      content: contentToSend,
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
          content: contentToSend,
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

  const handleDeleteMessage = async (messageId: string, reason: string) => {
    if (!canModerate) return

    try {
      const success = chatModerationService.deleteMessage(messageId, userId, reason, groupId)

      if (success) {
        // Send deletion notification via WebSocket
        sendMessage({
          type: "message_deleted",
          groupId,
          payload: {
            messageId,
            deletedBy: userId,
            reason,
          },
        })

        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? ({
                  ...msg,
                  deleted: true,
                  deletedBy: userId,
                  deletedAt: new Date().toISOString(),
                  deletionReason: reason,
                } as DeletedMessage)
              : msg,
          ),
        )
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const handleMuteUser = async (targetUserId: string, targetUserName: string, reason: string, duration?: number) => {
    if (!canModerate || targetUserId === userId) return

    try {
      const mutedUser = chatModerationService.muteUser(targetUserId, targetUserName, userId, reason, groupId, duration)

      // Send mute notification via WebSocket
      sendMessage({
        type: "user_muted",
        groupId,
        payload: {
          userId: targetUserId,
          userName: targetUserName,
          mutedBy: userId,
          reason,
          duration,
        },
      })
    } catch (error) {
      console.error("Error muting user:", error)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    // Clear content warnings when user starts typing
    if (contentWarnings.length > 0) {
      setContentWarnings([])
    }

    if (!isConnected) return

    // Check if user is muted before sending typing indicator
    const muteStatus = chatModerationService.isUserMuted(userId, groupId)
    if (muteStatus.muted) return

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
  const groupedMessages: { [date: string]: (StudyGroupMessage | DeletedMessage)[] } = {}
  const visibleMessages = showDeletedMessages ? messages : messages.filter((msg) => !("deleted" in msg && msg.deleted))

  visibleMessages.forEach((message) => {
    const date = formatMessageDate(message.timestamp)
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  const muteStatus = chatModerationService.isUserMuted(userId, groupId)

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Moderated Group Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {isConnected ? "Connected" : "Connecting..."}
            </Badge>
            {canModerate && (
              <Button variant="outline" size="sm" onClick={() => setShowDeletedMessages(!showDeletedMessages)}>
                {showDeletedMessages ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDeletedMessages ? "Hide" : "Show"} Deleted
              </Button>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{onlineUsers.size + 1}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {wsError && (
        <div className="px-4 pb-2">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{wsError}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Content warnings */}
      {contentWarnings.length > 0 && (
        <div className="px-4 pb-2">
          {contentWarnings.map((warning, index) => (
            <Alert key={index} variant="destructive" className="mb-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Mute status */}
      {muteStatus.muted && (
        <div className="px-4 pb-2">
          <Alert variant="destructive">
            <UserX className="h-4 w-4" />
            <AlertDescription>
              You are muted
              {muteStatus.mutedUser?.mutedUntil
                ? ` until ${new Date(muteStatus.mutedUser.mutedUntil).toLocaleString()}`
                : " permanently"}
              . Reason: {muteStatus.mutedUser?.reason}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">{date}</div>
            </div>

            {dateMessages.map((message) => {
              const isDeleted = "deleted" in message && message.deleted

              return (
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
                      <div className="flex items-start gap-2">
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isDeleted
                              ? "bg-red-50 border border-red-200 text-red-600"
                              : message.userId === userId
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                          }`}
                        >
                          {isDeleted ? (
                            <div className="italic">
                              <div>Message deleted by {(message as DeletedMessage).deletedBy}</div>
                              <div className="text-xs">Reason: {(message as DeletedMessage).deletionReason}</div>
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>

                        {/* Moderation menu */}
                        {canModerate && !isDeleted && message.userId !== userId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDeleteMessage(message.id, "Inappropriate content")}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Message
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleMuteUser(message.userId, message.userName, "Inappropriate behavior", 60)
                                }
                                className="text-orange-600"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Mute User (1h)
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleMuteUser(message.userId, message.userName, "Repeated violations")}
                                className="text-red-600"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Mute Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
            placeholder={
              muteStatus.muted
                ? "You are muted and cannot send messages"
                : isConnected
                  ? "Type your message..."
                  : "Connecting..."
            }
            disabled={isSubmitting || !isConnected || muteStatus.muted}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isSubmitting || !newMessage.trim() || !isConnected || muteStatus.muted}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
