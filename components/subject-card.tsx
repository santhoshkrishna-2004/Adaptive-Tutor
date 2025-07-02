import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SubjectCardProps {
  subject: {
    id: number
    name: string
    progress: number
    weakTopics: string[]
  }
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{subject.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} />
        </div>

        <div className="space-y-2">
          <div className="text-sm">Areas to improve:</div>
          <div className="flex flex-wrap gap-2">
            {subject.weakTopics.map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Link
            href={`/dashboard/videos?subject=${encodeURIComponent(subject.name)}`}
            className="text-xs text-center py-1 px-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          >
            Videos
          </Link>
          <Link
            href={`/dashboard/quizzes?subject=${encodeURIComponent(subject.name)}`}
            className="text-xs text-center py-1 px-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          >
            Quizzes
          </Link>
          <Link
            href={`/dashboard/ppt?subject=${encodeURIComponent(subject.name)}`}
            className="text-xs text-center py-1 px-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          >
            PPT
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
