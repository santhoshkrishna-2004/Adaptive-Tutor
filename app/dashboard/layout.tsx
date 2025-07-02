"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { WebSocketProvider } from "@/components/websocket-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUserId, setCurrentUserId] = useState<string>("")

  useEffect(() => {
    // Get user ID from localStorage or session
    const userId = localStorage.getItem("currentUserId") || "user-123"
    setCurrentUserId(userId)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Adaptive AI Tutor</h2>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex">
        <DashboardNav />
        <main className="flex-1">
          {currentUserId ? (
            <WebSocketProvider userId={currentUserId}>{children}</WebSocketProvider>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div>Loading...</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
