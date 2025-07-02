"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useWebSocketContext } from "./websocket-provider"
import type { NotificationData } from "@/lib/websocket-client"

export function RealTimeNotifications() {
  const { subscribe } = useWebSocketContext()
  const [lastNotificationId, setLastNotificationId] = useState<string>("")

  useEffect(() => {
    const unsubscribe = subscribe("notification", (message) => {
      const notification = message.payload as NotificationData

      // Avoid duplicate toasts
      if (notification.id === lastNotificationId) return
      setLastNotificationId(notification.id)

      // Show toast notification
      switch (notification.type) {
        case "success":
          toast.success(notification.title, {
            description: notification.message,
          })
          break
        case "warning":
          toast.warning(notification.title, {
            description: notification.message,
          })
          break
        case "error":
          toast.error(notification.title, {
            description: notification.message,
          })
          break
        default:
          toast.info(notification.title, {
            description: notification.message,
          })
      }
    })

    return unsubscribe
  }, [subscribe, lastNotificationId])

  return null // This component doesn't render anything
}
