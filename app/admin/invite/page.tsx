"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, RefreshCw, Send } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [email, setEmail] = useState("")
  const [bulkEmails, setBulkEmails] = useState("")
  const [sending, setSending] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const router = useRouter()

  useEffect(() => {
    fetchInvites()
  }, [])

  const fetchInvites = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/invites")
      if (!response.ok) {
        throw new Error("Failed to fetch invites")
      }
      const data = await response.json()
      setInvites(data)
    } catch (error) {
      console.error("Error fetching invites:", error)
      setError("Failed to fetch invites. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvite = async () => {
    if (!email) {
      setError("Please enter an email address")
      return
    }

    try {
      setSending(true)
      setError("")
      setSuccess("")

      const response = await fetch("/api/admin/send-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send invitation")
      }

      setSuccess(`Invitation sent successfully to ${email}`)
      setEmail("")
      fetchInvites() // Refresh the list
    } catch (error) {
      console.error("Error sending invite:", error)
      setError(error.message || "Failed to send invitation. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const handleSendBulkInvites = async () => {
    if (!bulkEmails) {
      setError("Please enter at least one email address")
      return
    }

    // Parse emails (split by commas, newlines, or spaces)
    const emails = bulkEmails
      .split(/[\s,;]+/)
      .map((email) => email.trim())
      .filter((email) => email)

    if (emails.length === 0) {
      setError("Please enter at least one valid email address")
      return
    }

    try {
      setSending(true)
      setError("")
      setSuccess("")

      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send invitations")
      }

      setSuccess(`Invitations sent: ${data.summary.successful}/${data.summary.total} (${data.summary.failed} failed)`)
      setBulkEmails("")
      fetchInvites() // Refresh the list
    } catch (error) {
      console.error("Error sending invites:", error)
      setError(error.message || "Failed to send invitations. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const handleResendInvite = async (id) => {
    try {
      setError("")
      setSuccess("")

      const response = await fetch(`/api/admin/invites/${id}/resend`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend invitation")
      }

      setSuccess("Invitation resent successfully")
      fetchInvites() // Refresh the list
    } catch (error) {
      console.error("Error resending invite:", error)
      setError(error.message || "Failed to resend invitation. Please try again.")
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Invitations</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Send Invitations</CardTitle>
              <CardDescription>Invite new members to join Eko Club International</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Invite</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Invites</TabsTrigger>
                </TabsList>
                <TabsContent value="single" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bulk" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bulkEmails" className="block text-sm font-medium mb-1">
                        Email Addresses
                      </label>
                      <Textarea
                        id="bulkEmails"
                        placeholder="Enter email addresses (separated by commas, spaces, or new lines)"
                        value={bulkEmails}
                        onChange={(e) => setBulkEmails(e.target.value)}
                        rows={5}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={activeTab === "single" ? handleSendInvite : handleSendBulkInvites}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitation{activeTab === "bulk" ? "s" : ""}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invitation History</CardTitle>
              <CardDescription>View and manage all sent invitations</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading invitations...</div>
              ) : invites.length === 0 ? (
                <div className="text-center py-4">No invitations found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invites.map((invite) => (
                        <TableRow key={invite._id}>
                          <TableCell>{invite.email}</TableCell>
                          <TableCell>
                            <code>{invite.code}</code>
                          </TableCell>
                          <TableCell>
                            {invite.isUsed ? (
                              <span className="text-green-500 font-medium">Used</span>
                            ) : new Date(invite.expiresAt) < new Date() ? (
                              <span className="text-red-500 font-medium">Expired</span>
                            ) : (
                              <span className="text-amber-500 font-medium">Pending</span>
                            )}
                          </TableCell>
                          <TableCell>{format(new Date(invite.expiresAt), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            {!invite.isUsed && (
                              <Button variant="outline" size="sm" onClick={() => handleResendInvite(invite._id)}>
                                Resend
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
