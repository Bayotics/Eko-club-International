"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Pencil, Trash2, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Editor } from "@/components/meeting-minutes-editor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdminDocuments() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentDocument, setCurrentDocument] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    meantFor: ["admin", "exco", "member"],
  })
  const [submitting, setSubmitting] = useState(false)

  const roleOptions = [
    { id: "admin", label: "Admin" },
    { id: "exco", label: "Executive Committee" },
    { id: "member", label: "Members" },
    { id: "public", label: "Public" },
  ]

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("/api/admin/documents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch documents")
        }

        const data = await response.json()
        setDocuments(data)
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast.error("Failed to load documents")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleRoleChange = (roleId) => {
    setFormData((prev) => {
      const meantFor = [...prev.meantFor]
      if (meantFor.includes(roleId)) {
        return { ...prev, meantFor: meantFor.filter((id) => id !== roleId) }
      } else {
        return { ...prev, meantFor: [...meantFor, roleId] }
      }
    })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      meantFor: ["admin", "exco", "member"],
    })
  }

  const handleCreateDocument = async () => {
    try {
      setSubmitting(true)
      const token = localStorage.getItem("token")

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create document")
      }

      const newDocument = await response.json()
      setDocuments((prev) => [newDocument, ...prev])
      setIsCreating(false)
      resetForm()
      toast.success("Document created successfully")
    } catch (error) {
      console.error("Error creating document:", error)
      toast.error("Failed to create document")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditClick = (document) => {
    setCurrentDocument(document)
    setFormData({
      title: document.title,
      description: document.description,
      content: document.content,
      meantFor: document.meantFor,
    })
    setIsEditing(true)
  }

  const handleUpdateDocument = async () => {
    try {
      setSubmitting(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`/api/admin/documents/${currentDocument._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update document")
      }

      const updatedDocument = await response.json()
      setDocuments((prev) => prev.map((doc) => (doc._id === updatedDocument._id ? updatedDocument : doc)))
      setIsEditing(false)
      setCurrentDocument(null)
      resetForm()
      toast.success("Document updated successfully")
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error("Failed to update document")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (document) => {
    setCurrentDocument(document)
    setIsDeleting(true)
  }

  const handleDeleteDocument = async () => {
    try {
      setSubmitting(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`/api/admin/documents/${currentDocument._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      setDocuments((prev) => prev.filter((doc) => doc._id !== currentDocument._id))
      setIsDeleting(false)
      setCurrentDocument(null)
      toast.success("Document deleted successfully")
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A97E]" />
        <span className="ml-2 text-lg">Loading documents...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-sm py-4 mb-6">
          <div className="container mx-auto px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/documents">Documents</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Documents</h1>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Document
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage club documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No documents yet</h3>
                  <p className="mt-1 text-gray-500">Get started by creating a new document.</p>
                  <Button className="mt-4" onClick={() => setIsCreating(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Document
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document._id}>
                        <TableCell className="font-medium">{document.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{document.description}</TableCell>
                        <TableCell>
                          {document.meantFor.map((role) => (
                            <span
                              key={role}
                              className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                            >
                              {role}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>{new Date(document.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(document)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(document)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Document Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Create a new document that will be available to members based on their roles.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter document title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a brief description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Document Content</Label>
              <Editor content={formData.content} onChange={handleEditorChange} />
            </div>
            <div className="grid gap-2">
              <Label>Visible to</Label>
              <div className="flex flex-wrap gap-4">
                {roleOptions.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={formData.meantFor.includes(role.id)}
                      onCheckedChange={() => handleRoleChange(role.id)}
                    />
                    <Label htmlFor={`role-${role.id}`}>{role.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDocument} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Make changes to the document and its visibility settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter document title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a brief description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Document Content</Label>
              <Editor content={formData.content} onChange={handleEditorChange} />
            </div>
            <div className="grid gap-2">
              <Label>Visible to</Label>
              <div className="flex flex-wrap gap-4">
                {roleOptions.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-role-${role.id}`}
                      checked={formData.meantFor.includes(role.id)}
                      onCheckedChange={() => handleRoleChange(role.id)}
                    />
                    <Label htmlFor={`edit-role-${role.id}`}>{role.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDocument} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDocument} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
