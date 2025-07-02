"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarPlus, ArrowLeft, Users, Calendar, Clock, Shield } from "lucide-react"
import Link from "next/link"
import { getStudyGroupWithDetails, joinStudySession, leaveStudySession, leaveStudyGroup } from "@/lib/study-groups"
import { ModeratedChat } from "@/components/moderated-chat"
import { StudySessionCard } from "@/components/study-session-card"
import { CreateStudySessionDialog } from "@/components/create-study-session-dialog"

export default function StudyGroupDetailPage() {
  const params = useParams()
  const groupId = params.groupId as string

  const [createSessionDialogOpen, setCreateSessionDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user ID for demo purposes
  const currentUserId = "user-123"
  const currentUserName = "Alex Johnson"
  const currentUserRole = "owner" // or "moderator" or "member"

  const { group, members, messages, sessions, path } = getStudyGroupWithDetails(groupId)

  if (!group || !path) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Study Group Not Found</h1>
          <p className="text-gray-600 mt-2">The requested study group could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/study-groups">Back to Study Groups</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentUserMember = members.find((member) => member.userId === currentUserId)
  const isOwner = currentUserMember?.role === "owner"
  const isModerator = currentUserMember?.role === "moderator"
  const canModerate = isOwner || isModerator

  const upcomingSessions = sessions.filter(
    (session) => session.status === "scheduled" && new Date(session.scheduledFor) > new Date(),
  )

  const pastSessions = sessions.filter(
    (session) =>
      session.status === "completed" || (session.status === "scheduled" && new Date(session.scheduledFor) < new Date()),
  )

  const handleJoinSession = async (sessionId: string) => {
    try {
      await joinStudySession(sessionId, currentUserId)
      // In a real app, you'd refresh the sessions data
    } catch (error) {
      console.error("Error joining session:", error)
    }
  }

  const handleLeaveSession = async (sessionId: string) => {
    try {
      await leaveStudySession(sessionId, currentUserId)
      // In a real app, you'd refresh the sessions data
    } catch (error) {
      console.error("Error leaving session:", error)
    }
  }

  const handleLeaveGroup = async () => {
    if (confirm("Are you sure you want to leave this group?")) {
      try {
        await leaveStudyGroup(groupId, currentUserId)
        // Redirect to study groups page
        window.location.href = "/dashboard/study-groups"
      } catch (error) {
        console.error("Error leaving group:", error)
      }
    }
  }

  const handleSessionCreated = () => {
    // In a real app, you'd refresh the sessions data
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/study-groups">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{path.title}</Badge>
            {group.isPrivate && <Badge variant="outline">Private</Badge>}
            <Badge variant="outline" className="text-green-600">
              <Shield className="h-3 w-3 mr-1" />
              Moderated
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {canModerate && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/study-groups/${groupId}/moderation`}>
                <Shield className="mr-2 h-4 w-4" />
                Moderation
              </Link>
            </Button>
          )}

          {(isOwner || isModerator) && (
            <Button onClick={() => setCreateSessionDialogOpen(true)}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          )}

          {!isOwner && (
            <Button variant="outline" onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chat">Group Chat</TabsTrigger>
          <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>About this Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{group.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Learning Path</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${path.color} flex items-center justify-center text-white`}>
                        {path.icon}
                      </div>
                      <span>{path.title}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Group Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-fore ground" />
                        <span>
                          {members.length} / {group.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                      </div>
                      {group.meetingSchedule && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{group.meetingSchedule}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{upcomingSessions.length}</div>
                  <div className="text-sm text-muted-foreground">Upcoming Sessions</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">{pastSessions.length}</div>
                  <div className="text-sm text-muted-foreground">Completed Sessions</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <div className="text-sm text-muted-foreground">Messages</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <ModeratedChat
            groupId={groupId}
            initialMessages={messages}
            userId={currentUserId}
            userName={currentUserName}
            userRole={currentUserRole}
          />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="space-y-6">
            {upcomingSessions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingSessions.map((session) => (
                    <StudySessionCard
                      key={session.id}
                      session={session}
                      members={members}
                      currentUserId={currentUserId}
                      onJoin={handleJoinSession}
                      onLeave={handleLeaveSession}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastSessions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastSessions.map((session) => (
                    <StudySessionCard
                      key={session.id}
                      session={session}
                      members={members}
                      currentUserId={currentUserId}
                      onJoin={handleJoinSession}
                      onLeave={handleLeaveSession}
                    />
                  ))}
                </div>
              </div>
            )}

            {sessions.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No study sessions yet</h3>
                <p className="mt-2 text-muted-foreground">Schedule your first study session to get started</p>
                {(isOwner || isModerator) && (
                  <Button className="mt-4" onClick={() => setCreateSessionDialogOpen(true)}>
                    Schedule Session
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.userId}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                    </div>
                    {member.role === "owner" && <Badge variant="outline">Owner</Badge>}
                    {member.role === "moderator" && <Badge variant="outline">Moderator</Badge>}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <div>Joined {new Date(member.joinedAt).toLocaleDateString()}</div>
                    <div>Last active {new Date(member.lastActive).toLocaleDateString()}</div>
                    <div>{member.completedVideos.length} videos completed</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateStudySessionDialog
        open={createSessionDialogOpen}
        onOpenChange={setCreateSessionDialogOpen}
        onSessionCreated={handleSessionCreated}
        groupId={groupId}
        userId={currentUserId}
      />
    </div>
  )
}
