"use client"

import { useState } from "react"
import { Bell, Check, X, Calendar, Users, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useWebSocketContext } from "./websocket-provider"
import type { NotificationData } from "@/lib/websocket-client"

export function NotificationCenter() {
  const { notifications, unreadCount, markNotificationAsRead, clearNotifications } = useWebSocketContext()
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "session_update":
        return <Calendar className="h-4 w-4" />
      case "user_joined":
        return <Users className="h-4 w-4" />
      case "chat_message":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
    }

    // Handle navigation based on notification type
    if (notification.groupId) {
      // Navigate to group
      window.location.href = `/dashboard/study-groups/${notification.groupId}`
    } else if (notification.sessionId) {
      // Navigate to session
      window.location.href = `/dashboard/study-groups/${notification.groupId}?tab=sessions`
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs">
                  Clear all
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>

                          <p className="text-xs text-muted-foreground mt-2">
                            {formatNotificationTime(notification.timestamp)}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            markNotificationAsRead(notification.id)
                          }}
                        >
                          {notification.read ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
