"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProfileImageUploadProps {
  initialImage?: string
  onImageChange: (imageUrl: string) => void
}

export function ProfileImageUpload({ initialImage, onImageChange }: ProfileImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setImagePreview(imageUrl)
      onImageChange(imageUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={imagePreview || ""} alt="Profile" />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
            {localStorage.getItem("userName") ? getInitials(localStorage.getItem("userName") || "") : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="rounded-full h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Upload image</span>
          </Button>
          {imagePreview && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="rounded-full h-8 w-8"
              onClick={handleRemoveImage}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile picture"
      />
    </div>
  )
}
