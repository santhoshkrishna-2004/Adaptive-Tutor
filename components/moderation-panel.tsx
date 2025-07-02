"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, UserX, Trash2, History, Filter } from "lucide-react"
import { chatModerationService } from "@/lib/chat-moderation"

interface ModerationPanelProps {
  groupId: string
  userRole: "owner" | "moderator" | "member"
}

export function ModerationPanel({ groupId, userRole }: ModerationPanelProps) {
  const [autoModeration, setAutoModeration] = useState(true)
  const [profanityFilter, setProfanityFilter] = useState(true)
  const [spamFilter, setSpamFilter] = useState(true)
  const [linkFilter, setLinkFilter] = useState(false)

  const canModerate = userRole === "owner" || userRole === "moderator"

  if (!canModerate) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You need moderator permissions to access this panel.</p>
        </CardContent>
      </Card>
    )
  }

  const mutedUsers = chatModerationService.getMutedUsers(groupId)
  const deletedMessages = chatModerationService.getDeletedMessages(groupId)

  const handleUnmute = (userId: string) => {
    chatModerationService.unmuteUser(userId, groupId)
    // In a real app, you'd refresh the data
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Moderation Panel</h1>
        <Badge variant="outline">Group: {groupId}</Badge>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="muted">Muted Users</TabsTrigger>
          <TabsTrigger value="filters">Content Filters</TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Moderation</Label>
                  <div className="text-sm text-muted-foreground">Automatically filter and moderate messages</div>
                </div>
                <Switch checked={autoModeration} onCheckedChange={setAutoModeration} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profanity Filter</Label>
                  <div className="text-sm text-muted-foreground">Filter inappropriate language</div>
                </div>
                <Switch checked={profanityFilter} onCheckedChange={setProfanityFilter} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Spam Filter</Label>
                  <div className="text-sm text-muted-foreground">Detect and prevent spam messages</div>
                </div>
                <Switch checked={spamFilter} onCheckedChange={setSpamFilter} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Link Filter</Label>
                  <div className="text-sm text-muted-foreground">Require approval for external links</div>
                </div>
                <Switch checked={linkFilter} onCheckedChange={setLinkFilter} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muted">
          <Card>
            <CardHeader>
              <CardTitle>Muted Users ({mutedUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {mutedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No muted users</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mutedUsers.map((mutedUser) => (
                    <div key={mutedUser.userId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{mutedUser.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{mutedUser.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            Muted by {mutedUser.mutedBy} • {mutedUser.reason}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {mutedUser.mutedUntil
                              ? `Until ${new Date(mutedUser.mutedUntil).toLocaleString()}`
                              : "Permanent"}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleUnmute(mutedUser.userId)}>
                        Unmute
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters">
          <Card>
            <CardHeader>
              <CardTitle>Content Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Profanity Filter</span>
                    <Badge variant={profanityFilter ? "default" : "secondary"}>
                      {profanityFilter ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filters inappropriate language and replaces with asterisks
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Spam Detection</span>
                    <Badge variant={spamFilter ? "default" : "secondary"}>{spamFilter ? "Active" : "Inactive"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Detects repeated characters and excessive caps</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Rate Limiting</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Limits users to 10 messages per minute</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Length Limit</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Maximum 500 characters per message</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Moderation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deletedMessages.map((deletion) => (
                  <div key={deletion.messageId} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <div className="text-sm">Message deleted by {deletion.deletedBy}</div>
                      <div className="text-xs text-muted-foreground">
                        {deletion.reason} • {new Date(deletion.deletedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}

                {mutedUsers.map((mute) => (
                  <div key={mute.userId} className="flex items-center gap-3 p-3 border rounded-lg">
                    <UserX className="h-4 w-4 text-orange-500" />
                    <div className="flex-1">
                      <div className="text-sm">
                        {mute.userName} muted by {mute.mutedBy}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {mute.reason} • {new Date(mute.mutedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}

                {deletedMessages.length === 0 && mutedUsers.length === 0 && (
                  <div className="text-center py-8">
                    <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No moderation actions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
