"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error")
        setMessage("Invalid verification link. Please check your email and try again.")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok && data.verified) {
          setVerificationStatus("success")
          setMessage(
            data.message || "Your email has been verified successfully. Your account is now pending admin approval.",
          )
        } else {
          setVerificationStatus("error")
          setMessage(data.message || "Failed to verify your email. The link may be expired or invalid.")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setVerificationStatus("error")
        setMessage("An error occurred during verification. Please try again later.")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "loading" ? "Verifying your email address..." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
              <p className="text-center text-gray-600">Please wait while we verify your email address. If it doesn't work at first trial, don't fret, Just refresh the page..</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <Alert className="border-green-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {verificationStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {verificationStatus === "success" && (
            <Button className="w-full" onClick={() => router.push("/login")}>
              Proceed to Login
            </Button>
          )}

          {verificationStatus === "error" && (
            <Button className="w-full" variant="outline" onClick={() => router.push("/login")}>
              Back to Registration
            </Button>
          )}

          <div className="text-center text-sm">
            <Link href="/" className="underline font-medium">
              Return to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
