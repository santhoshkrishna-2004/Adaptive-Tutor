"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, FileQuestion, Home, Play, Presentation, Users, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Videos", href: "/dashboard/videos", icon: Play },
  { name: "Learning Paths", href: "/dashboard/learning-paths", icon: BookOpen },
  { name: "Study Groups", href: "/dashboard/study-groups", icon: Users },
  { name: "Quizzes", href: "/dashboard/quizzes", icon: FileQuestion },
  { name: "PPT Generator", href: "/dashboard/ppt", icon: Presentation },
  { name: "Test Results", href: "/dashboard/test-results", icon: BarChart3 },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
