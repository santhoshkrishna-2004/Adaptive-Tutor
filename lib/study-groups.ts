import { getLearningPathById, type LearningPath } from "./learning-paths"

export interface StudyGroup {
  id: string
  name: string
  description: string
  pathId: string
  createdAt: string
  createdBy: string
  isPrivate: boolean
  maxMembers: number
  meetingSchedule?: string
  tags: string[]
}

export interface StudyGroupMember {
  groupId: string
  userId: string
  name: string
  role: "owner" | "moderator" | "member"
  joinedAt: string
  lastActive: string
  completedVideos: string[]
}

export interface StudyGroupMessage {
  id: string
  groupId: string
  userId: string
  userName: string
  content: string
  timestamp: string
  attachmentUrl?: string
  attachmentType?: "note" | "question" | "resource" | "other"
}

export interface StudySession {
  id: string
  groupId: string
  title: string
  description: string
  scheduledFor: string
  duration: number // in minutes
  videoIds: string[]
  hostId: string
  attendees: string[]
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
}

// Mock data for study groups
const mockStudyGroups: StudyGroup[] = [
  {
    id: "cs-fundamentals-group-1",
    name: "CS Fundamentals Study Buddies",
    description: "A group for beginners learning computer science fundamentals together",
    pathId: "computer-science-fundamentals",
    createdAt: "2023-05-15T10:30:00Z",
    createdBy: "user-123",
    isPrivate: false,
    maxMembers: 10,
    meetingSchedule: "Tuesdays and Thursdays at 7 PM",
    tags: ["beginners", "programming", "algorithms"],
  },
  {
    id: "ml-study-group",
    name: "Machine Learning Enthusiasts",
    description: "Deep dive into machine learning concepts and applications",
    pathId: "machine-learning-basics",
    createdAt: "2023-06-20T14:45:00Z",
    createdBy: "user-456",
    isPrivate: false,
    maxMembers: 8,
    meetingSchedule: "Saturdays at 3 PM",
    tags: ["machine-learning", "neural-networks", "ai"],
  },
  {
    id: "math-masters",
    name: "Math Masters",
    description: "Group for mastering mathematics for engineering applications",
    pathId: "mathematics-foundation",
    createdAt: "2023-07-05T09:15:00Z",
    createdBy: "user-789",
    isPrivate: true,
    maxMembers: 5,
    meetingSchedule: "Mondays and Wednesdays at 6 PM",
    tags: ["calculus", "linear-algebra", "mathematics"],
  },
]

// Mock data for group members
const mockGroupMembers: StudyGroupMember[] = [
  {
    groupId: "cs-fundamentals-group-1",
    userId: "user-123",
    name: "Alex Johnson",
    role: "owner",
    joinedAt: "2023-05-15T10:30:00Z",
    lastActive: "2023-08-10T15:45:00Z",
    completedVideos: ["YAXLy4jNhAs", "rfscVS0vtbw"],
  },
  {
    groupId: "cs-fundamentals-group-1",
    userId: "user-234",
    name: "Jamie Smith",
    role: "member",
    joinedAt: "2023-05-16T14:20:00Z",
    lastActive: "2023-08-09T11:30:00Z",
    completedVideos: ["YAXLy4jNhAs"],
  },
  {
    groupId: "ml-study-group",
    userId: "user-456",
    name: "Taylor Wilson",
    role: "owner",
    joinedAt: "2023-06-20T14:45:00Z",
    lastActive: "2023-08-11T09:15:00Z",
    completedVideos: ["8mAITcNt710"],
  },
  {
    groupId: "math-masters",
    userId: "user-789",
    name: "Jordan Lee",
    role: "owner",
    joinedAt: "2023-07-05T09:15:00Z",
    lastActive: "2023-08-10T16:20:00Z",
    completedVideos: ["byHcYRpMgI4", "WUvTyaaNkzM"],
  },
]

// Mock data for group messages
const mockGroupMessages: StudyGroupMessage[] = [
  {
    id: "msg-1",
    groupId: "cs-fundamentals-group-1",
    userId: "user-123",
    userName: "Alex Johnson",
    content: "Welcome everyone to our CS Fundamentals study group! Let's introduce ourselves.",
    timestamp: "2023-05-15T10:35:00Z",
  },
  {
    id: "msg-2",
    groupId: "cs-fundamentals-group-1",
    userId: "user-234",
    userName: "Jamie Smith",
    content: "Hi everyone! I'm Jamie and I'm excited to learn programming fundamentals with you all.",
    timestamp: "2023-05-15T10:40:00Z",
  },
  {
    id: "msg-3",
    groupId: "cs-fundamentals-group-1",
    userId: "user-123",
    userName: "Alex Johnson",
    content: "I've created a shared notes document for our first video. Check it out!",
    timestamp: "2023-05-16T09:20:00Z",
    attachmentUrl: "https://docs.example.com/shared-notes-1",
    attachmentType: "note",
  },
]

// Mock data for study sessions
const mockStudySessions: StudySession[] = [
  {
    id: "session-1",
    groupId: "cs-fundamentals-group-1",
    title: "Introduction to Programming - Group Review",
    description: "Let's watch and discuss the first video together",
    scheduledFor: "2023-05-18T19:00:00Z",
    duration: 60,
    videoIds: ["YAXLy4jNhAs"],
    hostId: "user-123",
    attendees: ["user-123", "user-234"],
    status: "completed",
  },
  {
    id: "session-2",
    groupId: "cs-fundamentals-group-1",
    title: "Algorithms Deep Dive",
    description: "Focusing on the algorithm video and solving practice problems",
    scheduledFor: "2023-05-25T19:00:00Z",
    duration: 90,
    videoIds: ["yQP4UJhNn0I"],
    hostId: "user-123",
    attendees: ["user-123", "user-234"],
    status: "completed",
  },
  {
    id: "session-3",
    groupId: "cs-fundamentals-group-1",
    title: "Internet Architecture Discussion",
    description: "Understanding how the internet works and its protocols",
    scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    duration: 60,
    videoIds: ["kO2x8wSpmWc"],
    hostId: "user-123",
    attendees: ["user-123"],
    status: "scheduled",
  },
]

// Functions to interact with study groups
export function getAllStudyGroups(): StudyGroup[] {
  return mockStudyGroups
}

export function getStudyGroupsByPathId(pathId: string): StudyGroup[] {
  return mockStudyGroups.filter((group) => group.pathId === pathId)
}

export function getStudyGroupById(groupId: string): StudyGroup | undefined {
  return mockStudyGroups.find((group) => group.id === groupId)
}

export function getStudyGroupMembers(groupId: string): StudyGroupMember[] {
  return mockGroupMembers.filter((member) => member.groupId === groupId)
}

export function getStudyGroupMessages(groupId: string): StudyGroupMessage[] {
  return mockGroupMessages.filter((message) => message.groupId === groupId)
}

export function getStudyGroupSessions(groupId: string): StudySession[] {
  return mockStudySessions.filter((session) => session.groupId === groupId)
}

export function getUpcomingStudySessions(groupId: string): StudySession[] {
  const now = new Date().toISOString()
  return mockStudySessions.filter(
    (session) => session.groupId === groupId && session.scheduledFor > now && session.status === "scheduled",
  )
}

export function getPastStudySessions(groupId: string): StudySession[] {
  const now = new Date().toISOString()
  return mockStudySessions.filter(
    (session) =>
      session.groupId === groupId &&
      (session.scheduledFor < now || session.status === "completed" || session.status === "cancelled"),
  )
}

export function getStudyGroupWithDetails(groupId: string): {
  group: StudyGroup | undefined
  members: StudyGroupMember[]
  messages: StudyGroupMessage[]
  sessions: StudySession[]
  path: LearningPath | undefined
} {
  const group = getStudyGroupById(groupId)
  const members = getStudyGroupMembers(groupId)
  const messages = getStudyGroupMessages(groupId)
  const sessions = getStudyGroupSessions(groupId)
  const path = group ? getLearningPathById(group.pathId) : undefined

  return {
    group,
    members,
    messages,
    sessions,
    path,
  }
}

export function getUserStudyGroups(userId: string): StudyGroup[] {
  const userGroupIds = mockGroupMembers.filter((member) => member.userId === userId).map((member) => member.groupId)

  return mockStudyGroups.filter((group) => userGroupIds.includes(group.id))
}

// In a real app, these would be async functions that interact with a database
export async function createStudyGroup(group: Omit<StudyGroup, "id" | "createdAt">): Promise<StudyGroup> {
  const newGroup: StudyGroup = {
    ...group,
    id: `group-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  mockStudyGroups.push(newGroup)

  // Add creator as a member and owner
  const newMember: StudyGroupMember = {
    groupId: newGroup.id,
    userId: group.createdBy,
    name: "Current User", // In a real app, you'd get the user's name
    role: "owner",
    joinedAt: newGroup.createdAt,
    lastActive: newGroup.createdAt,
    completedVideos: [],
  }

  mockGroupMembers.push(newMember)

  return newGroup
}

export async function joinStudyGroup(groupId: string, userId: string, userName: string): Promise<StudyGroupMember> {
  const newMember: StudyGroupMember = {
    groupId,
    userId,
    name: userName,
    role: "member",
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    completedVideos: [],
  }

  mockGroupMembers.push(newMember)
  return newMember
}

export async function leaveStudyGroup(groupId: string, userId: string): Promise<boolean> {
  const memberIndex = mockGroupMembers.findIndex((member) => member.groupId === groupId && member.userId === userId)

  if (memberIndex !== -1) {
    mockGroupMembers.splice(memberIndex, 1)
    return true
  }

  return false
}

export async function sendGroupMessage(
  groupId: string,
  userId: string,
  userName: string,
  content: string,
  attachmentUrl?: string,
  attachmentType?: "note" | "question" | "resource" | "other",
): Promise<StudyGroupMessage> {
  const newMessage: StudyGroupMessage = {
    id: `msg-${Date.now()}`,
    groupId,
    userId,
    userName,
    content,
    timestamp: new Date().toISOString(),
    attachmentUrl,
    attachmentType,
  }

  mockGroupMessages.push(newMessage)
  return newMessage
}

export async function createStudySession(session: Omit<StudySession, "id">): Promise<StudySession> {
  const newSession: StudySession = {
    ...session,
    id: `session-${Date.now()}`,
  }

  mockStudySessions.push(newSession)
  return newSession
}

export async function updateStudySession(
  sessionId: string,
  updates: Partial<Omit<StudySession, "id" | "groupId">>,
): Promise<StudySession | null> {
  const sessionIndex = mockStudySessions.findIndex((session) => session.id === sessionId)

  if (sessionIndex !== -1) {
    mockStudySessions[sessionIndex] = {
      ...mockStudySessions[sessionIndex],
      ...updates,
    }
    return mockStudySessions[sessionIndex]
  }

  return null
}

export async function joinStudySession(sessionId: string, userId: string): Promise<StudySession | null> {
  const sessionIndex = mockStudySessions.findIndex((session) => session.id === sessionId)

  if (sessionIndex !== -1) {
    if (!mockStudySessions[sessionIndex].attendees.includes(userId)) {
      mockStudySessions[sessionIndex].attendees.push(userId)
    }
    return mockStudySessions[sessionIndex]
  }

  return null
}

export async function leaveStudySession(sessionId: string, userId: string): Promise<StudySession | null> {
  const sessionIndex = mockStudySessions.findIndex((session) => session.id === sessionId)

  if (sessionIndex !== -1) {
    mockStudySessions[sessionIndex].attendees = mockStudySessions[sessionIndex].attendees.filter((id) => id !== userId)
    return mockStudySessions[sessionIndex]
  }

  return null
}
