"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Copy, Check, MailCheck, AlertCircle, Users, Pencil, X, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  _id: string
  fullName: string
  email: string
  phone: string
  role: string
  chapterName: string
  membershipId: string
  isVerified: boolean
  isActive: boolean
  createdAt: string
}

interface CreateUserResponse {
  message: string
  user: User
  tempPassword: string
  emailSent: boolean
  emailError?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<Partial<User>>({})
  const [savingUserId, setSavingUserId] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    membershipId: "",
    role: "member",
  })
  const [createdUserInfo, setCreatedUserInfo] = useState<{
    tempPassword: string
    emailSent: boolean
    emailError?: string
  } | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log("Fetching users...")

      const response = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Fetch users response status:", response.status)

      if (!response.ok) {
        let errorMessage = "Failed to fetch users"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = (await response.text()) || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Users fetched successfully:", data.length)
      setUsers(data)

      toast({
        title: "Success",
        description: `Loaded ${data.length} users successfully`,
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!newUser.fullName.trim()) {
      errors.fullName = "Full name is required"
    }

    if (!newUser.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!newUser.phone.trim()) {
      errors.phone = "Phone number is required"
    }

    if (!newUser.membershipId.trim()) {
      errors.membershipId = "Membership ID is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateUser = async () => {
    console.log("Create user button clicked")

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      setCreating(true)
      console.log("Creating user with data:", newUser)

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newUser),
      })

      console.log("Create user response status:", response.status)
      console.log("Create user response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorMessage = "Failed to create user"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.error("Create user error data:", errorData)
        } catch {
          errorMessage = (await response.text()) || errorMessage
          console.error("Create user error text:", errorMessage)
        }
        throw new Error(errorMessage)
      }

      const data: CreateUserResponse = await response.json()
      console.log("User created successfully:", { ...data, tempPassword: "[HIDDEN]" })

      // Set created user info for display
      setCreatedUserInfo({
        tempPassword: data.tempPassword,
        emailSent: data.emailSent,
        emailError: data.emailError,
      })

      // Add new user to the list
      setUsers((prev) => [data.user, ...prev])

      // Reset form
      setNewUser({
        fullName: "",
        email: "",
        phone: "",
        membershipId: "",
        role: "member",
      })
      setFormErrors({})

      // Show success toast
      if (data.emailSent) {
        toast({
          title: "Success!",
          description: "User created successfully and welcome email sent!",
        })
      } else {
        toast({
          title: "User Created",
          description: `User created successfully, but email failed to send: ${data.emailError || "Unknown error"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const startEditing = (user: User) => {
    setEditingUserId(user._id)
    setEditingUser({
      fullName: user.fullName,
      phone: user.phone,
      membershipId: user.membershipId,
      role: user.role,
    })
  }

  const cancelEditing = () => {
    setEditingUserId(null)
    setEditingUser({})
  }

  const handleEditChange = (field: keyof User, value: string) => {
    setEditingUser((prev) => ({ ...prev, [field]: value }))
  }

  const saveUserChanges = async (userId: string) => {
    try {
      setSavingUserId(userId)
      console.log("Saving user changes:", editingUser)

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editingUser),
      })

      if (!response.ok) {
        let errorMessage = "Failed to update user"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = (await response.text()) || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("User updated successfully:", data)

      // Update the users list with the updated user
      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, ...data.user } : user)))

      // Clear editing state
      setEditingUserId(null)
      setEditingUser({})

      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setSavingUserId(null)
    }
  }

  const copyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedPassword(true)
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      })
      setTimeout(() => setCopiedPassword(false), 2000)
    } catch (error) {
      console.error("Failed to copy password:", error)
      toast({
        title: "Error",
        description: "Failed to copy password to clipboard",
        variant: "destructive",
      })
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setCreatedUserInfo(null)
    setCopiedPassword(false)
    setFormErrors({})
    setNewUser({
      fullName: "",
      email: "",
      phone: "",
      membershipId: "",
      role: "member",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage users in your chapter</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account. All fields are required. The user will be automatically verified and receive
                login credentials via email.
              </DialogDescription>
            </DialogHeader>

            {!createdUserInfo ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={newUser.fullName}
                    onChange={(e) => {
                      setNewUser({ ...newUser, fullName: e.target.value })
                      if (formErrors.fullName) {
                        setFormErrors({ ...formErrors, fullName: "" })
                      }
                    }}
                    placeholder="Enter full name"
                    className={formErrors.fullName ? "border-red-500" : ""}
                  />
                  {formErrors.fullName && <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => {
                      setNewUser({ ...newUser, email: e.target.value })
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: "" })
                      }
                    }}
                    placeholder="Enter email address"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => {
                      setNewUser({ ...newUser, phone: e.target.value })
                      if (formErrors.phone) {
                        setFormErrors({ ...formErrors, phone: "" })
                      }
                    }}
                    placeholder="Enter phone number"
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="membershipId">Membership ID *</Label>
                  <Input
                    id="membershipId"
                    value={newUser.membershipId}
                    onChange={(e) => {
                      setNewUser({ ...newUser, membershipId: e.target.value })
                      if (formErrors.membershipId) {
                        setFormErrors({ ...formErrors, membershipId: "" })
                      }
                    }}
                    placeholder="Enter membership ID"
                    className={formErrors.membershipId ? "border-red-500" : ""}
                  />
                  {formErrors.membershipId && <p className="text-sm text-red-500 mt-1">{formErrors.membershipId}</p>}
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="exco">Exco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser} disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {creating ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Created Successfully!</h3>
                  <p className="text-sm text-gray-500 mb-4">The user account has been created and is ready to use.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Temporary Password:</span>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-2 py-1 rounded text-sm font-mono">
                        {createdUserInfo.tempPassword}
                      </code>
                      <Button size="sm" variant="outline" onClick={() => copyPassword(createdUserInfo.tempPassword)}>
                        {copiedPassword ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {createdUserInfo.emailSent ? (
                      <>
                        <MailCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Welcome email sent successfully</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">
                          Email failed to send - please share password manually
                        </span>
                      </>
                    )}
                  </div>

                  {!createdUserInfo.emailSent && createdUserInfo.emailError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Email Error: {createdUserInfo.emailError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> The user should change their password after first login for security.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={closeDialog}>Done</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.isVerified).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>List of all users in your chapter</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found in your chapter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Membership ID</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {editingUserId === user._id ? (
                          <Input
                            value={editingUser.fullName || ""}
                            onChange={(e) => handleEditChange("fullName", e.target.value)}
                            className="max-w-[200px]"
                          />
                        ) : (
                          user.fullName
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {editingUserId === user._id ? (
                          <Input
                            value={editingUser.phone || ""}
                            onChange={(e) => handleEditChange("phone", e.target.value)}
                            className="max-w-[150px]"
                          />
                        ) : (
                          user.phone
                        )}
                      </TableCell>
                      <TableCell>
                        {editingUserId === user._id ? (
                          <Input
                            value={editingUser.membershipId || ""}
                            onChange={(e) => handleEditChange("membershipId", e.target.value)}
                            className="max-w-[150px]"
                          />
                        ) : (
                          user.membershipId
                        )}
                      </TableCell>
                      <TableCell>{user.chapterName}</TableCell>
                      <TableCell>
                        {editingUserId === user._id ? (
                          <Select
                            value={editingUser.role || user.role}
                            onValueChange={(value) => handleEditChange("role", value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="exco">Exco</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Badge variant={user.isActive ? "default" : "destructive"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant={user.isVerified ? "default" : "secondary"}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {editingUserId === user._id ? (
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEditing}
                              className="h-8 w-8 p-0 bg-transparent"
                              disabled={savingUserId === user._id}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => saveUserChanges(user._id)}
                              disabled={savingUserId === user._id}
                              className="h-8 w-8 p-0"
                            >
                              {savingUserId === user._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(user)}
                            className="h-8 w-8 p-0"
                            disabled={user.email === "debozki@gmail.com"}
                          >
                            <Pencil className="h-4 w-4" />
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
  )
}
