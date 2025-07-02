"use client"

import { ModeratedChat } from "./moderated-chat"
import type { StudyGroupMessage } from "@/lib/study-groups"

interface StudyGroupChatProps {
  groupId: string
  messages: StudyGroupMessage[]
  userId: string
  userName: string
}

export function StudyGroupChat({ groupId, messages, userId, userName }: StudyGroupChatProps) {
  // Default to member role, in a real app this would come from the group membership
  const userRole = "member" as "owner" | "moderator" | "member"

  return (
    <ModeratedChat
      groupId={groupId}
      initialMessages={messages}
      userId={userId}
      userName={userName}
      userRole={userRole}
    />
  )
}
