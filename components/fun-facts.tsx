"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

const funFacts = [
  {
    subject: "Computer Science",
    fact: "The first computer bug was an actual bug. A moth was found trapped in a Harvard Mark II computer in 1947.",
  },
  {
    subject: "Mathematics",
    fact: "The number 0 wasn't a recognized number until the 7th century AD when it was introduced by Indian mathematicians.",
  },
  {
    subject: "Physics",
    fact: "If you could fold a piece of paper 42 times, it would reach the moon due to exponential growth.",
  },
  {
    subject: "Electronics",
    fact: "The average smartphone today has more computing power than the computers used for the Apollo 11 moon landing.",
  },
  {
    subject: "Chemistry",
    fact: "The human body contains enough carbon to make about 900 pencils.",
  },
]

export function FunFacts() {
  const [currentFact, setCurrentFact] = useState(0)

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % funFacts.length)
  }

  useEffect(() => {
    const interval = setInterval(nextFact, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-primary">{funFacts[currentFact].subject}</h4>
          <Button variant="ghost" size="icon" onClick={nextFact}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Next fact</span>
          </Button>
        </div>
        <p>{funFacts[currentFact].fact}</p>
      </CardContent>
    </Card>
  )
}
