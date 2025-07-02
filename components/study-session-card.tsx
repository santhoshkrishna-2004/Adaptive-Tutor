"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Users, Video } from "lucide-react"
import type { StudySession, StudyGroupMember } from "@/lib/study-groups"
import { getLearningPathById } from "@/lib/learning-paths"

interface StudySessionCardProps {
  session: StudySession
  members: StudyGroupMember[]
  currentUserId: string
  onJoin: (sessionId: string) => void
  onLeave: (sessionId: string) => void
}

export function StudySessionCard({ session, members, currentUserId, onJoin, onLeave }: StudySessionCardProps) {
  const isUserAttending = session.attendees.includes(currentUserId)
  const isUserHost = session.hostId === currentUserId
  const host = members.find((member) => member.userId === session.hostId)

  const sessionDate = new Date(session.scheduledFor)
  const isPast = sessionDate < new Date()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get video titles
  const getVideoTitles = () => {
    if (session.videoIds.length === 0) return "No videos selected"

    const titles: string[] = []
    session.videoIds.forEach((videoId) => {
      const path = getLearningPathById(session.groupId.split("-")[0])
      if (path) {
        const video = path.videos.find((v) => v.id === videoId)
        if (video) {
          titles.push(video.title)
        }
      }
    })

    return titles.length > 0 ? titles.join(", ") : "Unknown videos"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <Badge className={getStatusColor(session.status)}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{session.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(sessionDate)}</span>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {formatTime(sessionDate)} ({session.duration} minutes)
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {session.attendees.length} {session.attendees.length === 1 ? "attendee" : "attendees"}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Video className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="line-clamp-1">{getVideoTitles()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Host:</span>
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {host ? host.name.substring(0, 2).toUpperCase() : "??"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{host ? host.name : "Unknown"}</span>
          </div>
        </div>

        <div className="flex -space-x-2 overflow-hidden">
          {session.attendees.slice(0, 5).map((attendeeId) => {
            const attendee = members.find((m) => m.userId === attendeeId)
            return (
              <Avatar key={attendeeId} className="border-2 border-background">
                <AvatarFallback className="text-xs">
                  {attendee ? attendee.name.substring(0, 2).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
            )
          })}
          {session.attendees.length > 5 && (
            <Avatar className="border-2 border-background">
              <AvatarFallback className="bg-muted text-muted-foreground">
                +{session.attendees.length - 5}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {session.status === "scheduled" &&
          !isPast &&
          (isUserAttending ? (
            <Button variant="outline" onClick={() => onLeave(session.id)} className="w-full">
              {isUserHost ? "Cancel Session" : "Leave Session"}
            </Button>
          ) : (
            <Button onClick={() => onJoin(session.id)} className="w-full">
              Join Session
            </Button>
          ))}

        {session.status === "in-progress" && <Button className="w-full">Join Live Session</Button>}

        {(session.status === "completed" || isPast) && (
          <Button variant="outline" disabled className="w-full">
            Session {session.status === "completed" ? "Completed" : "Ended"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
