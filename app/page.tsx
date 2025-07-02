"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FunFacts } from "@/components/fun-facts"
import { ProfileButton } from "@/components/profile-button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Adaptive AI Tutor</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ProfileButton />
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to Adaptive AI Tutor</h2>
            <p className="text-xl text-muted-foreground mb-8">
              A personalized learning experience designed to adapt to your unique needs
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mb-12">
            <FeatureCard
              title="Interactive Videos"
              description="Learn with engaging videos and ask questions to our AI chatbot"
              icon="🎬"
            />
            <FeatureCard
              title="AI-Powered Quizzes"
              description="Test your knowledge with personalized quizzes based on your progress"
              icon="📝"
            />
            <FeatureCard
              title="Automatic PPT Generation"
              description="Create presentations automatically from your learning materials"
              icon="📊"
            />
          </section>

          <section className="bg-card/80 backdrop-blur-sm p-8 rounded-lg border">
            <h3 className="text-2xl font-bold mb-4">Fun Facts About Your Subjects</h3>
            <FunFacts />
          </section>
        </div>
      </main>

      <footer className="border-t py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Adaptive AI Tutor. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
