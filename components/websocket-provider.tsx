"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useWebSocket, type NotificationData, type WebSocketMessage } from "@/lib/websocket-client"

interface WebSocketContextType {
  connectionState: string
  notifications: NotificationData[]
  sendMessage: (message: Omit<WebSocketMessage, "timestamp">) => void
  subscribe: (messageType: string, handler: (message: WebSocketMessage) => void) => () => void
  markNotificationAsRead: (notificationId: string) => void
  clearNotifications: () => void
  isConnected: boolean
  unreadCount: number
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: React.ReactNode
  userId: string
}

export function WebSocketProvider({ children, userId }: WebSocketProviderProps) {
  const webSocket = useWebSocket(userId)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unread = webSocket.notifications.filter((n) => !n.read).length
    setUnreadCount(unread)
  }, [webSocket.notifications])

  const contextValue: WebSocketContextType = {
    ...webSocket,
    unreadCount,
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider")
  }
  return context
}
