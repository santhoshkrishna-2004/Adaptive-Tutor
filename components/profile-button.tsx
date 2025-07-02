"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function ProfileButton() {
  return (
    <Button variant="outline" size="icon" asChild>
      <Link href="/profile" aria-label="View profile">
        <User className="h-[1.2rem] w-[1.2rem]" />
      </Link>
    </Button>
  )
}
