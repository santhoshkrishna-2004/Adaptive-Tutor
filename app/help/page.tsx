import type { Metadata } from "next"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help with using the Adaptive AI Tutor platform",
}

export default function HelpPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions or contact our support team for assistance.
        </p>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search for help topics..." className="pl-10 h-12" />
      </div>

      <Tabs defaultValue="faq" className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>How do I create a quiz?</CardTitle>
                <CardDescription>Quiz generation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Navigate to the Quizzes section from the dashboard sidebar. Click on "Create New Quiz" and select your
                  preferred topic. You can customize the difficulty level and number of questions before generating.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/quizzes">
                  <Button variant="outline">Go to Quizzes</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I generate a presentation?</CardTitle>
                <CardDescription>PPT generation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Go to the PPT Generation section from the dashboard. Enter your topic and select the number of slides
                  you want. You can customize the style and content before generating your presentation.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/ppt">
                  <Button variant="outline">Go to PPT Generation</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I update my profile?</CardTitle>
                <CardDescription>Profile management</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Click on your profile picture in the top right corner and select "Profile" from the dropdown menu. You
                  can update your personal information, change your profile picture, and manage your account settings.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/profile">
                  <Button variant="outline">Go to Profile</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I find educational videos?</CardTitle>
                <CardDescription>Video search</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Navigate to the Videos section from the dashboard sidebar. Use the search bar to find videos on
                  specific topics. You can filter results by subject, duration, and difficulty level.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/videos">
                  <Button variant="outline">Go to Videos</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
                <CardDescription>5 min read</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Learn how to set up your account, customize your dashboard, and start using the Adaptive AI Tutor
                  platform effectively.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Read Guide</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creating Effective Presentations</CardTitle>
                <CardDescription>8 min read</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Master the art of creating engaging presentations using our AI-powered PPT generation tool with tips
                  and best practices.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Read Guide</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mastering Quiz Creation</CardTitle>
                <CardDescription>6 min read</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Learn how to create customized quizzes that help reinforce learning and track progress effectively.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Read Guide</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Learning Strategies</CardTitle>
                <CardDescription>7 min read</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Discover effective strategies for learning from educational videos, taking notes, and using our AI
                  chatbot to enhance understanding.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Read Guide</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out the form below and our support team will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Please describe your issue in detail" className="min-h-[150px]" />
                </div>
                <Button type="submit" className="w-full">
                  Submit Request
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground mb-2">Alternatively, you can reach us at:</p>
              <p className="text-sm">
                Email: support@adaptiveaitutor.com
                <br />
                Phone: +1 (555) 123-4567
                <br />
                Hours: Monday-Friday, 9am-5pm EST
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
