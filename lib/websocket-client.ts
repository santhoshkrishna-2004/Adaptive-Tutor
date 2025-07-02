"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface WebSocketMessage {
  type: "chat_message" | "notification" | "user_joined" | "user_left" | "session_update" | "typing" | "heartbeat"
  payload: any
  timestamp: string
  userId?: string
  groupId?: string
}

export interface NotificationData {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  groupId?: string
  sessionId?: string
  timestamp: string
  read: boolean
}

export interface ChatMessage {
  id: string
  groupId: string
  userId: string
  userName: string
  content: string
  timestamp: string
  attachmentUrl?: string
  attachmentType?: string
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private messageHandlers: Map<string, Set<(message: WebSocketMessage) => void>> = new Map()
  private connectionState: "connecting" | "connected" | "disconnected" | "error" = "disconnected"
  private stateChangeHandlers: Set<(state: string) => void> = new Set()

  constructor(private userId: string) {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.connectionState = "connecting"
    this.notifyStateChange()

    // In a real implementation, this would connect to your WebSocket server
    // For demo purposes, we'll simulate WebSocket behavior
    this.simulateWebSocket()
  }

  private simulateWebSocket() {
    // Simulate WebSocket connection
    setTimeout(() => {
      this.connectionState = "connected"
      this.notifyStateChange()
      this.startHeartbeat()

      // Simulate receiving messages periodically
      this.simulateIncomingMessages()
    }, 1000)
  }

  private simulateIncomingMessages() {
    // Simulate random notifications and messages
    const messageTypes = ["notification", "user_joined", "session_update"]

    setInterval(() => {
      if (this.connectionState === "connected" && Math.random() > 0.7) {
        const type = messageTypes[Math.floor(Math.random() * messageTypes.length)]
        let payload: any

        switch (type) {
          case "notification":
            payload = {
              id: `notif-${Date.now()}`,
              type: "info",
              title: "Study Reminder",
              message: "Your study session starts in 15 minutes!",
              timestamp: new Date().toISOString(),
              read: false,
            }
            break
          case "user_joined":
            payload = {
              groupId: "cs-fundamentals-group-1",
              userName: "New Student",
              userId: `user-${Date.now()}`,
            }
            break
          case "session_update":
            payload = {
              sessionId: "session-123",
              groupId: "cs-fundamentals-group-1",
              message: "Study session has been rescheduled",
            }
            break
        }

        this.handleMessage({
          type: type as any,
          payload,
          timestamp: new Date().toISOString(),
          userId: this.userId,
        })
      }
    }, 10000) // Every 10 seconds
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connectionState === "connected") {
        // Send heartbeat
        this.handleMessage({
          type: "heartbeat",
          payload: { userId: this.userId },
          timestamp: new Date().toISOString(),
        })
      }
    }, 30000) // Every 30 seconds
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.messageHandlers.get(message.type)
    if (handlers) {
      handlers.forEach((handler) => handler(message))
    }

    // Also notify wildcard handlers
    const wildcardHandlers = this.messageHandlers.get("*")
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => handler(message))
    }
  }

  subscribe(messageType: string, handler: (message: WebSocketMessage) => void) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set())
    }
    this.messageHandlers.get(messageType)!.add(handler)

    return () => {
      const handlers = this.messageHandlers.get(messageType)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.messageHandlers.delete(messageType)
        }
      }
    }
  }

  subscribeToStateChanges(handler: (state: string) => void) {
    this.stateChangeHandlers.add(handler)
    return () => {
      this.stateChangeHandlers.delete(handler)
    }
  }

  private notifyStateChange() {
    this.stateChangeHandlers.forEach((handler) => handler(this.connectionState))
  }

  sendMessage(message: Omit<WebSocketMessage, "timestamp">) {
    if (this.connectionState !== "connected") {
      console.warn("WebSocket not connected")
      return
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: new Date().toISOString(),
      userId: this.userId,
    }

    // In a real implementation, you would send this to the server
    // For demo, we'll just handle it locally and simulate echo
    setTimeout(() => {
      if (message.type === "chat_message") {
        this.handleMessage(fullMessage)
      }
    }, 100)
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.connectionState = "disconnected"
    this.notifyStateChange()
  }

  getConnectionState() {
    return this.connectionState
  }
}

// Singleton instance
let wsManager: WebSocketManager | null = null

export function useWebSocket(userId: string) {
  const [connectionState, setConnectionState] = useState<string>("disconnected")
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const wsRef = useRef<WebSocketManager | null>(null)

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocketManager(userId)
      wsManager = wsRef.current
    }

    const ws = wsRef.current

    // Subscribe to connection state changes
    const unsubscribeState = ws.subscribeToStateChanges(setConnectionState)

    // Subscribe to notifications
    const unsubscribeNotifications = ws.subscribe("notification", (message) => {
      const notification = message.payload as NotificationData
      setNotifications((prev) => [notification, ...prev].slice(0, 50)) // Keep last 50 notifications
    })

    // Connect
    ws.connect()

    return () => {
      unsubscribeState()
      unsubscribeNotifications()
    }
  }, [userId])

  const sendMessage = useCallback((message: Omit<WebSocketMessage, "timestamp">) => {
    wsRef.current?.sendMessage(message)
  }, [])

  const subscribe = useCallback((messageType: string, handler: (message: WebSocketMessage) => void) => {
    return wsRef.current?.subscribe(messageType, handler) || (() => {})
  }, [])

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    connectionState,
    notifications,
    sendMessage,
    subscribe,
    markNotificationAsRead,
    clearNotifications,
    isConnected: connectionState === "connected",
  }
}

export { wsManager }
