"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ModerationPanel } from "@/components/moderation-panel"

export default function ModerationPage() {
  const params = useParams()
  const groupId = params.groupId as string

  // Mock user role - in a real app, this would come from the group membership
  const userRole = "owner" as "owner" | "moderator" | "member"

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/study-groups/${groupId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Group
          </Link>
        </Button>
      </div>

      <ModerationPanel groupId={groupId} userRole={userRole} />
    </div>
  )
}
