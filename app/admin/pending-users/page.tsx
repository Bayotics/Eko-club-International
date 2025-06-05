"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, UserCheck, UserX } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"

export default function PendingUsersPage() {
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [membershipId, setMembershipId] = useState("")
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false)
  const [processingUserId, setProcessingUserId] = useState(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== "admin") {
      router.push("/members/dashboard")
      return
    }

    fetchPendingUsers()
  }, [user, router])

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/pending-users")
      if (!response.ok) {
        throw new Error("Failed to fetch pending users")
      }
      const data = await response.json()
      setPendingUsers(data.users || [])
    } catch (error) {
      console.error("Error fetching pending users:", error)
      setError("Failed to fetch pending users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = (user) => {
    setSelectedUser(user)
    setMembershipId("")
    setApproveDialogOpen(true)
  }

  const handleDeclineUser = (user) => {
    setSelectedUser(user)
    setDeclineDialogOpen(true)
  }

  const confirmApprove = async () => {
    if (!membershipId.trim()) {
      setError("Membership ID is required")
      return
    }

    try {
      setProcessingUserId(selectedUser._id)
      setError("")
      setSuccess("")

      const response = await fetch(`/api/admin/pending-users/${selectedUser._id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ membershipId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve user")
      }

      setSuccess(`User ${selectedUser.fullName} has been approved successfully`)
      setApproveDialogOpen(false)
      // Remove the approved user from the list
      setPendingUsers(pendingUsers.filter((user) => user._id !== selectedUser._id))
    } catch (error) {
      console.error("Error approving user:", error)
      setError(error.message || "Failed to approve user. Please try again.")
    } finally {
      setProcessingUserId(null)
    }
  }

  const confirmDecline = async () => {
    try {
      setProcessingUserId(selectedUser._id)
      setError("")
      setSuccess("")

      const response = await fetch(`/api/admin/pending-users/${selectedUser._id}/decline`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to decline user")
      }

      setSuccess(`User ${selectedUser.fullName} has been declined`)
      setDeclineDialogOpen(false)
      // Remove the declined user from the list
      setPendingUsers(pendingUsers.filter((user) => user._id !== selectedUser._id))
    } catch (error) {
      console.error("Error declining user:", error)
      setError(error.message || "Failed to decline user. Please try again.")
    } finally {
      setProcessingUserId(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Pending Users</h1>

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

      <Card>
        <CardHeader>
          <CardTitle>Pending User Registrations</CardTitle>
          <CardDescription>Review and manage users who have registered and are awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-500 mr-2" />
              <span>Loading pending users...</span>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending users found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Registered On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.chapterName || "Not specified"}</TableCell>
                      <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveUser(user)}
                            disabled={processingUserId === user._id}
                          >
                            {processingUserId === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <UserCheck className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeclineUser(user)}
                            disabled={processingUserId === user._id}
                          >
                            {processingUserId === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <UserX className="h-4 w-4 mr-1" />
                            )}
                            Decline
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve User Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve User</DialogTitle>
            <DialogDescription>
              Assign a membership ID to approve this user. The user will be notified via email.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name:</div>
                <div>{selectedUser.fullName}</div>
                <div className="font-medium">Email:</div>
                <div>{selectedUser.email}</div>
                <div className="font-medium">Phone:</div>
                <div>{selectedUser.phone}</div>
                <div className="font-medium">Chapter:</div>
                <div>{selectedUser.chapterName || "Not specified"}</div>
              </div>

              <div className="space-y-2">
                <label htmlFor="membershipId" className="text-sm font-medium">
                  Membership ID <span className="text-red-500">*</span>
                </label>
                <Input
                  id="membershipId"
                  value={membershipId}
                  onChange={(e) => setMembershipId(e.target.value)}
                  placeholder="Enter membership ID"
                  required
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} disabled={processingUserId === selectedUser?._id}>
              {processingUserId === selectedUser?._id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Approve User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline User Dialog */}
      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline User</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this user? The user will be blocked and notified via email.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name:</div>
                <div>{selectedUser.fullName}</div>
                <div className="font-medium">Email:</div>
                <div>{selectedUser.email}</div>
                <div className="font-medium">Phone:</div>
                <div>{selectedUser.phone}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDecline} disabled={processingUserId === selectedUser?._id}>
              {processingUserId === selectedUser?._id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Decline User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
