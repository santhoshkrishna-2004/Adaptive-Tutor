"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RealTimeChat } from "@/components/real-time-chat"
import { ChatTestPanel } from "@/components/chat-test-panel"
import { mockStudyGroupMessages } from "@/lib/study-groups"

export default function TestChatPage() {
  const [activeDemo, setActiveDemo] = useState<"chat" | "test">("chat")

  // Mock data for testing
  const groupId = "test-group-123"
  const userId = "current-user-123"
  const userName = "Test User"
  const initialMessages = mockStudyGroupMessages.filter((msg) => msg.groupId === groupId)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/study-groups">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Study Groups
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Chat Testing</h1>
          <p className="text-muted-foreground mt-2">Test real-time messaging, typing indicators, and notifications</p>
        </div>

        <div className="flex gap-2">
          <Button variant={activeDemo === "chat" ? "default" : "outline"} onClick={() => setActiveDemo("chat")}>
            Live Chat
          </Button>
          <Button variant={activeDemo === "test" ? "default" : "outline"} onClick={() => setActiveDemo("test")}>
            Test Controls
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Interface</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RealTimeChat groupId={groupId} initialMessages={initialMessages} userId={userId} userName={userName} />
            </CardContent>
          </Card>
        </div>

        {/* Test Controls */}
        <div className="space-y-4">
          <ChatTestPanel groupId={groupId} />
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test Real-Time Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🚀 Testing Real-Time Chat:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Type in the chat input to see typing indicators</li>
                <li>• Send messages to see instant delivery</li>
                <li>• Use test controls to simulate other users</li>
                <li>• Watch for online/offline status changes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🔔 Testing Notifications:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Click notification buttons to trigger alerts</li>
                <li>• Check the notification center for updates</li>
                <li>• Watch for unread badge counts</li>
                <li>• Test different notification types</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">👥 Testing User Interactions:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Simulate users joining/leaving groups</li>
                <li>• Test multiple users typing simultaneously</li>
                <li>• Watch online presence indicators</li>
                <li>• Try sending messages as different users</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">⚡ Connection Testing:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Monitor connection status indicator</li>
                <li>• Test features when connected/disconnected</li>
                <li>• Watch for automatic reconnection attempts</li>
                <li>• Verify message delivery reliability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
