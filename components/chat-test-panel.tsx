"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Wifi, WifiOff, MessageCircle, Bell } from "lucide-react"
import { useWebSocketContext } from "./websocket-provider"

interface SimulatedUser {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  isTyping: boolean
}

export function ChatTestPanel({ groupId }: { groupId: string }) {
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>([
    { id: "user-1", name: "Alice Chen", avatar: "AC", isOnline: true, isTyping: false },
    { id: "user-2", name: "Bob Smith", avatar: "BS", isOnline: true, isTyping: false },
    { id: "user-3", name: "Carol Davis", avatar: "CD", isOnline: false, isTyping: false },
    { id: "user-4", name: "David Wilson", avatar: "DW", isOnline: true, isTyping: false },
  ])

  const [testMessages, setTestMessages] = useState<string[]>([
    "Hey everyone! Ready for today's study session?",
    "I'm having trouble with the calculus problem from video 3",
    "Can someone explain the derivative concept again?",
    "Let me share my notes from that section",
    "Thanks! This group is so helpful 😊",
    "Should we schedule a review session for next week?",
    "Great idea! I'm free Tuesday evening",
    "Tuesday works for me too",
  ])

  const { sendMessage, isConnected, notifications, connectionState } = useWebSocketContext()

  // Simulate user activity
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedUsers((prev) =>
        prev.map((user) => ({
          ...user,
          isOnline: Math.random() > 0.3, // 70% chance to be online
          isTyping: user.isOnline && Math.random() > 0.85, // 15% chance to be typing if online
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Simulate incoming messages
  const simulateIncomingMessage = (userId: string, userName: string) => {
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)]

    // First show typing indicator
    sendMessage({
      type: "typing",
      groupId,
      payload: {
        userName,
        isTyping: true,
      },
    })

    // Then send message after a delay
    setTimeout(
      () => {
        sendMessage({
          type: "chat_message",
          groupId,
          payload: {
            id: `sim-msg-${Date.now()}`,
            content: randomMessage,
            userName,
          },
        })

        // Stop typing
        sendMessage({
          type: "typing",
          groupId,
          payload: {
            userName,
            isTyping: false,
          },
        })
      },
      1500 + Math.random() * 2000,
    ) // 1.5-3.5 seconds delay
  }

  const simulateUserJoining = (user: SimulatedUser) => {
    sendMessage({
      type: "user_joined",
      groupId,
      payload: {
        userName: user.name,
        userId: user.id,
      },
    })

    // Send a greeting message
    setTimeout(() => {
      sendMessage({
        type: "chat_message",
        groupId,
        payload: {
          id: `join-msg-${Date.now()}`,
          content: `Hi everyone! Just joined the group 👋`,
          userName: user.name,
        },
      })
    }, 1000)
  }

  const simulateNotification = (type: "session" | "reminder" | "achievement") => {
    let notification

    switch (type) {
      case "session":
        notification = {
          id: `notif-${Date.now()}`,
          type: "info" as const,
          title: "Study Session Starting",
          message: "Your Machine Learning study session starts in 10 minutes!",
          groupId,
          timestamp: new Date().toISOString(),
          read: false,
        }
        break
      case "reminder":
        notification = {
          id: `notif-${Date.now()}`,
          type: "warning" as const,
          title: "Assignment Due Soon",
          message: "Don't forget: Quiz on Linear Algebra is due tomorrow",
          groupId,
          timestamp: new Date().toISOString(),
          read: false,
        }
        break
      case "achievement":
        notification = {
          id: `notif-${Date.now()}`,
          type: "success" as const,
          title: "Progress Milestone!",
          message: "Congratulations! You've completed 75% of the CS Fundamentals path",
          timestamp: new Date().toISOString(),
          read: false,
        }
        break
    }

    sendMessage({
      type: "notification",
      payload: notification,
    })
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            Real-Time Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "destructive"}>{connectionState.toUpperCase()}</Badge>
            <div className="text-sm text-muted-foreground">
              {isConnected ? "All real-time features are active" : "Attempting to reconnect..."}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Simulated Users</TabsTrigger>
          <TabsTrigger value="messages">Test Messages</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Simulated Study Group Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simulatedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant={user.isOnline ? "default" : "secondary"} className="text-xs">
                            {user.isOnline ? "Online" : "Offline"}
                          </Badge>
                          {user.isTyping && (
                            <Badge variant="outline" className="text-xs">
                              Typing...
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => simulateIncomingMessage(user.id, user.name)}
                        disabled={!user.isOnline || !isConnected}
                      >
                        Send Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => simulateUserJoining(user)}
                        disabled={user.isOnline || !isConnected}
                      >
                        Join Group
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Quick Test Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {testMessages.slice(0, 8).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => {
                      const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)]
                      sendMessage({
                        type: "chat_message",
                        groupId,
                        payload: {
                          id: `test-msg-${Date.now()}`,
                          content: message,
                          userName: randomUser.name,
                        },
                      })
                    }}
                    disabled={!isConnected}
                  >
                    <div className="truncate">{message}</div>
                  </Button>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Typing Indicator Test</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const user = simulatedUsers[0]
                      sendMessage({
                        type: "typing",
                        groupId,
                        payload: {
                          userName: user.name,
                          isTyping: true,
                        },
                      })

                      setTimeout(() => {
                        sendMessage({
                          type: "typing",
                          groupId,
                          payload: {
                            userName: user.name,
                            isTyping: false,
                          },
                        })
                      }, 3000)
                    }}
                    disabled={!isConnected}
                  >
                    Show Typing (3s)
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      simulatedUsers.slice(0, 2).forEach((user, index) => {
                        setTimeout(() => {
                          sendMessage({
                            type: "typing",
                            groupId,
                            payload: {
                              userName: user.name,
                              isTyping: true,
                            },
                          })
                        }, index * 500)
                      })

                      setTimeout(() => {
                        simulatedUsers.slice(0, 2).forEach((user) => {
                          sendMessage({
                            type: "typing",
                            groupId,
                            payload: {
                              userName: user.name,
                              isTyping: false,
                            },
                          })
                        })
                      }, 4000)
                    }}
                    disabled={!isConnected}
                  >
                    Multiple Users Typing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Test Notifications
                {notifications.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {notifications.filter((n) => !n.read).length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => simulateNotification("session")}
                  disabled={!isConnected}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="font-medium">Session Reminder</div>
                  <div className="text-sm text-muted-foreground">Study session starting soon</div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => simulateNotification("reminder")}
                  disabled={!isConnected}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="font-medium">Assignment Due</div>
                  <div className="text-sm text-muted-foreground">Quiz deadline approaching</div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => simulateNotification("achievement")}
                  disabled={!isConnected}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="font-medium">Achievement</div>
                  <div className="text-sm text-muted-foreground">Progress milestone reached</div>
                </Button>
              </div>

              {notifications.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Recent Notifications</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-2 rounded border text-sm ${notification.read ? "bg-muted/50" : "bg-background"}`}
                      >
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-muted-foreground">{notification.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
