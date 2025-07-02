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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { createStudySession } from "@/lib/study-groups"
import { getLearningPathById } from "@/lib/learning-paths"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateStudySessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSessionCreated: () => void
  groupId: string
  userId: string
}

export function CreateStudySessionDialog({
  open,
  onOpenChange,
  onSessionCreated,
  groupId,
  userId,
}: CreateStudySessionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    videoIds: [] as string[],
  })

  // Get videos from the learning path associated with this group
  const group = groupId.split("-")[0] // Extract the path ID from the group ID
  const path = getLearningPathById(group)
  const videos = path?.videos || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setFormData((prev) => ({ ...prev, duration: value }))
    }
  }

  const handleVideoToggle = (videoId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        videoIds: [...prev.videoIds, videoId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        videoIds: prev.videoIds.filter((id) => id !== videoId),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time) {
      alert("Please select a date and time for the session")
      return
    }

    setIsSubmitting(true)

    try {
      // Combine date and time
      const [hours, minutes] = time.split(":").map(Number)
      const scheduledDate = new Date(date)
      scheduledDate.setHours(hours, minutes)

      await createStudySession({
        groupId,
        title: formData.title,
        description: formData.description,
        scheduledFor: scheduledDate.toISOString(),
        duration: formData.duration,
        videoIds: formData.videoIds,
        hostId: userId,
        attendees: [userId],
        status: "scheduled",
      })

      onSessionCreated()
      onOpenChange(false)
      setFormData({
        title: "",
        description: "",
        duration: 60,
        videoIds: [],
      })
      setDate(undefined)
      setTime("")
    } catch (error) {
      console.error("Error creating study session:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule a Study Session</DialogTitle>
            <DialogDescription>Create a new study session for your group.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter session title"
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
                placeholder="Describe what you'll cover in this session"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="15"
                max="240"
                step="15"
                value={formData.duration}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Videos to Cover</Label>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <div key={video.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`video-${video.id}`}
                        checked={formData.videoIds.includes(video.id)}
                        onCheckedChange={(checked) => handleVideoToggle(video.id, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`video-${video.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {video.title}
                        </label>
                        <p className="text-xs text-muted-foreground">{video.duration}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No videos available for this learning path.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
