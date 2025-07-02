"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Users, Clock, ArrowRight } from "lucide-react"
import type { StudyGroup, StudyGroupMember } from "@/lib/study-groups"
import Link from "next/link"

interface StudyGroupCardProps {
  group: StudyGroup
  members: StudyGroupMember[]
  pathName: string
  currentUserId?: string
  onJoin?: (groupId: string) => void
}

export function StudyGroupCard({ group, members, pathName, currentUserId, onJoin }: StudyGroupCardProps) {
  const isUserMember = currentUserId ? members.some((member) => member.userId === currentUserId) : false

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{group.name}</CardTitle>
          {group.isPrivate && (
            <Badge variant="outline" className="text-xs">
              Private
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{pathName}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm mb-4 line-clamp-2">{group.description}</p>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {members.length} / {group.maxMembers} members
            </span>
          </div>

          {group.meetingSchedule && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{group.meetingSchedule}</span>
            </div>
          )}

          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-1">
            {group.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-0">
        <div className="flex -space-x-2 overflow-hidden w-full">
          {members.slice(0, 5).map((member, i) => (
            <Avatar key={member.userId} className="border-2 border-background">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {member.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {members.length > 5 && (
            <Avatar className="border-2 border-background">
              <AvatarFallback className="bg-muted text-muted-foreground">+{members.length - 5}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {isUserMember ? (
          <Button asChild className="w-full">
            <Link href={`/dashboard/study-groups/${group.id}`}>
              Go to Group
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button
            onClick={() => onJoin && onJoin(group.id)}
            disabled={members.length >= group.maxMembers}
            className="w-full"
          >
            {members.length >= group.maxMembers ? "Group Full" : "Join Group"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
