"use client"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { useWebSocketContext } from "./websocket-provider"

export function ConnectionStatus() {
  const { connectionState, isConnected } = useWebSocketContext()

  const getStatusIcon = () => {
    switch (connectionState) {
      case "connected":
        return <Wifi className="h-3 w-3" />
      case "connecting":
        return <Loader2 className="h-3 w-3 animate-spin" />
      default:
        return <WifiOff className="h-3 w-3" />
    }
  }

  const getStatusText = () => {
    switch (connectionState) {
      case "connected":
        return "Online"
      case "connecting":
        return "Connecting..."
      case "error":
        return "Connection Error"
      default:
        return "Offline"
    }
  }

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    switch (connectionState) {
      case "connected":
        return "default"
      case "connecting":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Badge variant={getStatusVariant()} className="text-xs flex items-center gap-1">
      {getStatusIcon()}
      {getStatusText()}
    </Badge>
  )
}
