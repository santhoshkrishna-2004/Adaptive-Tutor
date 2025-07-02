"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, Users } from "lucide-react"
import { StudyGroupCard } from "@/components/study-group-card"
import { CreateStudyGroupDialog } from "@/components/create-study-group-dialog"
import {
  getAllStudyGroups,
  getUserStudyGroups,
  getStudyGroupMembers,
  joinStudyGroup,
  type StudyGroup,
} from "@/lib/study-groups"
import { getLearningPathById } from "@/lib/learning-paths"

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([])

  // Mock user ID for demo purposes
  const currentUserId = "user-123"
  const currentUserName = "Alex Johnson"

  useEffect(() => {
    // In a real app, these would be API calls
    setGroups(getAllStudyGroups())
    setMyGroups(getUserStudyGroups(currentUserId))
  }, [])

  const handleJoinGroup = async (groupId: string) => {
    try {
      await joinStudyGroup(groupId, currentUserId, currentUserName)
      // Refresh groups
      setGroups(getAllStudyGroups())
      setMyGroups(getUserStudyGroups(currentUserId))
    } catch (error) {
      console.error("Error joining group:", error)
    }
  }

  const handleGroupCreated = () => {
    // Refresh groups
    setGroups(getAllStudyGroups())
    setMyGroups(getUserStudyGroups(currentUserId))
  }

  const filteredGroups = groups.filter((group) => {
    const path = getLearningPathById(group.pathId)
    const pathName = path?.title || ""

    return (
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pathName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const filteredMyGroups = myGroups.filter((group) => {
    const path = getLearningPathById(group.pathId)
    const pathName = path?.title || ""

    return (
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pathName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Study Groups</h1>
        <p className="text-gray-600">Join or create study groups to learn together with other students</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => {
                const path = getLearningPathById(group.pathId)
                const members = getStudyGroupMembers(group.id)

                return (
                  <StudyGroupCard
                    key={group.id}
                    group={group}
                    members={members}
                    pathName={path?.title || "Unknown Path"}
                    currentUserId={currentUserId}
                    onJoin={handleJoinGroup}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No study groups found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchQuery
                  ? "No groups match your search criteria"
                  : "There are no study groups available at the moment"}
              </p>
              <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                Create a Group
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-6">
          {filteredMyGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMyGroups.map((group) => {
                const path = getLearningPathById(group.pathId)
                const members = getStudyGroupMembers(group.id)

                return (
                  <StudyGroupCard
                    key={group.id}
                    group={group}
                    members={members}
                    pathName={path?.title || "Unknown Path"}
                    currentUserId={currentUserId}
                    onJoin={handleJoinGroup}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">You haven't joined any groups yet</h3>
              <p className="mt-2 text-muted-foreground">
                {searchQuery
                  ? "None of your groups match your search criteria"
                  : "Join an existing group or create your own to get started"}
              </p>
              <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                Create a Group
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateStudyGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onGroupCreated={handleGroupCreated}
        userId={currentUserId}
      />
    </div>
  )
}
