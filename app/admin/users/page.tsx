"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Loader2, Pencil, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

interface User {
  _id: string
  fullName: string
  email: string
  role: string
  membershipId: string
  chapterName: string
  isActive: boolean
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<User>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      try {
        // First check if user is admin
        const meResponse = await fetch("/api/auth/me")
        if (!meResponse.ok) {
          throw new Error("Not authenticated")
        }

        const userData = await meResponse.json()
        if (userData.role !== "admin") {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          })
          router.push("/members/dashboard")
          return
        }

        // Fetch users if admin
        const response = await fetch("/api/admin/users")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch users: ${response.status}`)
        }

        const data = await response.json()
        setUsers(Array.isArray(data) ? data : data.users || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAdminAndFetchUsers()
  }, [router, toast])

  const startEditing = (user: User) => {
    setEditingId(user._id)
    setEditValues({
      fullName: user.fullName,
      role: user.role,
      membershipId: user.membershipId,
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleEditChange = (field: keyof User, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }))
  }

  const saveChanges = async (userId: string) => {
    try {
      setSavingId(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editValues),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      const updatedUser = await response.json()

      // Update the users list with the updated user
      setUsers(users.map((user) => (user._id === userId ? { ...user, ...updatedUser.user } : user)))

      toast({
        title: "Success",
        description: "User updated successfully",
      })

      setEditingId(null)
      setEditValues({})
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <span className="ml-2 text-xl">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <Button className="mt-4" onClick={() => router.push("/members/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 mt-20">
      <h1 className="mb-8 text-3xl font-bold">Manage Users</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Membership ID</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {editingId === user._id ? (
                      <Input
                        value={editValues.fullName || ""}
                        onChange={(e) => handleEditChange("fullName", e.target.value)}
                        className="max-w-[200px]"
                      />
                    ) : (
                      user.fullName
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editingId === user._id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-[130px] justify-between">
                            {editValues.role || user.role}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditChange("role", "admin")}>admin</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditChange("role", "member")}>member</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditChange("role", "exco")}>
                            exco
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user._id ? (
                      <Input
                        value={editValues.membershipId || ""}
                        onChange={(e) => handleEditChange("membershipId", e.target.value)}
                        className="max-w-[150px]"
                      />
                    ) : (
                      user.membershipId || "Not assigned"
                    )}
                  </TableCell>
                  <TableCell>{user.chapterName || "Not assigned"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === user._id ? (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={cancelEditing} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => saveChanges(user._id)}
                          disabled={savingId === user._id}
                          className="h-8 w-8 p-0"
                        >
                          {savingId === user._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => startEditing(user)} className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
