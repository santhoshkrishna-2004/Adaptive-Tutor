"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLearningPaths } from "@/lib/learning-paths"
import { createStudyGroup } from "@/lib/study-groups"

interface CreateStudyGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGroupCreated: () => void
  userId: string
  initialPathId?: string
}

export function CreateStudyGroupDialog({
  open,
  onOpenChange,
  onGroupCreated,
  userId,
  initialPathId,
}: CreateStudyGroupDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pathId: initialPathId || "",
    isPrivate: false,
    maxMembers: 10,
    meetingSchedule: "",
    tags: "",
  })

  const learningPaths = getLearningPaths()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPrivate: checked }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, pathId: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setFormData((prev) => ({ ...prev, maxMembers: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await createStudyGroup({
        name: formData.name,
        description: formData.description,
        pathId: formData.pathId,
        createdBy: userId,
        isPrivate: formData.isPrivate,
        maxMembers: formData.maxMembers,
        meetingSchedule: formData.meetingSchedule || undefined,
        tags: tagsArray,
      })

      onGroupCreated()
      onOpenChange(false)
      setFormData({
        name: "",
        description: "",
        pathId: initialPathId || "",
        isPrivate: false,
        maxMembers: 10,
        meetingSchedule: "",
        tags: "",
      })
    } catch (error) {
      console.error("Error creating study group:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Study Group</DialogTitle>
            <DialogDescription>Create a new study group for a learning path.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your study group"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pathId">Learning Path</Label>
              <Select value={formData.pathId} onValueChange={handleSelectChange} required>
                <SelectTrigger id="pathId">
                  <SelectValue placeholder="Select a learning path" />
                </SelectTrigger>
                <SelectContent>
                  {learningPaths.map((path) => (
                    <SelectItem key={path.id} value={path.id}>
                      {path.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxMembers">Maximum Members</Label>
              <Input
                id="maxMembers"
                name="maxMembers"
                type="number"
                min="2"
                max="50"
                value={formData.maxMembers}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meetingSchedule">Meeting Schedule (Optional)</Label>
              <Input
                id="meetingSchedule"
                name="meetingSchedule"
                value={formData.meetingSchedule}
                onChange={handleChange}
                placeholder="e.g., Tuesdays and Thursdays at 7 PM"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., beginners, programming, algorithms"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isPrivate" checked={formData.isPrivate} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isPrivate">Private Group</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
