"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, CheckCircle, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validation
      if (!email) {
        throw new Error("Please enter your email address")
      }

      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Please enter a valid email address")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store recovery request
      const recoveryData = {
        email,
        requestTime: new Date().toISOString(),
        token: Math.random().toString(36).substring(2, 15),
      }

      localStorage.setItem("passwordRecovery", JSON.stringify(recoveryData))

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Failed to send recovery email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setIsSubmitted(false)
    setEmail("")
    setError("")
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/adaptive-ai-tutor-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Link href="/" className="absolute top-4 left-4 text-xl font-bold text-white bg-black/30 px-4 py-2 rounded-md">
        Adaptive AI Tutor
      </Link>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{!isSubmitted ? "Reset Password" : "Check Your Email"}</CardTitle>
          <CardDescription>
            {!isSubmitted
              ? "Enter your email address and we'll send you a link to reset your password"
              : "We've sent password reset instructions to your email"}
          </CardDescription>
        </CardHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full h-11" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6 pt-4 pb-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-lg">Reset link sent!</p>
                <p className="text-muted-foreground mt-1">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-11" onClick={handleResend}>
                Send Another Link
              </Button>
              <Button variant="outline" className="w-full h-11" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
