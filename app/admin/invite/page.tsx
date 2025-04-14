"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Copy, X, RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

export default function InviteUsersPage() {
  const [email, setEmail] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [invites, setInvites] = useState<any[]>([])
  const [isLoadingInvites, setIsLoadingInvites] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/members/dashboard")
    }
  }, [user, router])

  // Fetch existing invites
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await fetch("/api/admin/invites")
        if (!response.ok) {
          throw new Error("Failed to fetch invites")
        }
        const data = await response.json()
        setInvites(data.invites || [])
      } catch (error) {
        console.error("Error fetching invites:", error)
        toast({
          title: "Error",
          description: "Failed to load existing invites. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingInvites(false)
      }
    }

    fetchInvites()
  }, [toast])

  const handleAddEmail = () => {
    if (!email) return

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (!emails.includes(email)) {
      setEmails([...emails, email])
      setEmail("")
    } else {
      toast({
        title: "Duplicate Email",
        description: "This email has already been added to the list.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove))
  }

  const handleSendInvites = async () => {
    if (emails.length === 0) {
      toast({
        title: "No Emails",
        description: "Please add at least one email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send invites")
      }

      const data = await response.json()

      toast({
        title: "Success!",
        description: `Invitations sent to ${data.successCount} email(s).`,
      })

      // Clear the emails list and refresh invites
      setEmails([])

      // Refresh the invites list
      const invitesResponse = await fetch("/api/admin/invites")
      if (invitesResponse.ok) {
        const invitesData = await invitesResponse.json()
        setInvites(invitesData.invites || [])
      }
    } catch (error) {
      console.error("Error sending invites:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendInvite = async (inviteId: string) => {
    try {
      const response = await fetch(`/api/admin/invites/${inviteId}/resend`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to resend invite")
      }

      toast({
        title: "Success!",
        description: "Invitation has been resent.",
      })

      // Refresh the invites list
      const invitesResponse = await fetch("/api/admin/invites")
      if (invitesResponse.ok) {
        const invitesData = await invitesResponse.json()
        setInvites(invitesData.invites || [])
      }
    } catch (error) {
      console.error("Error resending invite:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend invite. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard.",
      })
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Error",
        description: "Failed to copy invite code. Please try manually.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Invite Users</h1>
        <p className="text-gray-600 mb-8">
          Send invitation emails to new users. They will receive a unique code to register.
        </p>

        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="send">Send Invites</TabsTrigger>
            <TabsTrigger value="manage">Manage Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle>Send Invitations</CardTitle>
                <CardDescription>
                  Enter email addresses to send invitation codes. You can add multiple emails.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddEmail()
                      }
                    }}
                  />
                  <Button onClick={handleAddEmail} type="button">
                    Add
                  </Button>
                </div>

                {emails.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Email List ({emails.length})</h3>
                    <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                      {emails.map((email, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <span className="text-sm">{email}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEmail(email)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSendInvites} disabled={emails.length === 0 || isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Invitations
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Invitations</CardTitle>
                <CardDescription>
                  View and manage all sent invitations. You can resend or copy invitation codes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInvites ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : invites.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No invitations have been sent yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invites.map((invite) => (
                      <div key={invite._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#C8A97E] text-white">
                            {invite.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{invite.email}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Code: {invite.code}</span>
                            <Badge variant={invite.isUsed ? "secondary" : "outline"} className="ml-2">
                              {invite.isUsed ? "Used" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Expires: {formatDate(invite.expiresAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyInviteCode(invite.code)}
                            title="Copy invite code"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {!invite.isUsed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvite(invite._id)}
                              title="Resend invitation"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
