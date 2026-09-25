"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ExternalLink, FileText, ImageIcon, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { pdfCoverFromUrl, uploadToCloudinary, validateImage, validatePdf } from "@/lib/cloudinary-upload"
import { formatDateUTC, toDateInputValue } from "@/lib/format-date"

interface Magazine {
  _id: string
  title: string
  issueNumber: string
  publishedDate: string
  description: string
  coverImage: string
  pdfUrl: string
  pdfPublicId: string
}

type MagazineForm = Omit<Magazine, "_id">

const emptyForm: MagazineForm = {
  title: "",
  issueNumber: "",
  publishedDate: "",
  description: "",
  coverImage: "",
  pdfUrl: "",
  pdfPublicId: "",
}

export default function ManageEkoCommunicatorPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<MagazineForm>(emptyForm)
  const [pdfName, setPdfName] = useState("")
  const [pdfProgress, setPdfProgress] = useState<number | null>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isUploading = pdfProgress !== null || coverUploading

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "admin") {
      router.push("/")
      return
    }
    fetchMagazines()
  }, [user, loading, router])

  const fetchMagazines = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/eko-communicator")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load magazines")
      setMagazines(data)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setPdfName("")
    setDialogOpen(true)
  }

  const openEdit = (m: Magazine) => {
    setEditingId(m._id)
    setForm({
      title: m.title,
      issueNumber: m.issueNumber || "",
      publishedDate: toDateInputValue(m.publishedDate),
      description: m.description || "",
      coverImage: m.coverImage || "",
      pdfUrl: m.pdfUrl,
      pdfPublicId: m.pdfPublicId || "",
    })
    setPdfName("Current PDF")
    setDialogOpen(true)
  }

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const invalid = validatePdf(file)
    if (invalid) {
      toast({ title: "PDF rejected", description: invalid, variant: "destructive" })
      return
    }

    try {
      setPdfProgress(0)
      const { url, publicId } = await uploadToCloudinary(file, "eko-communicator", setPdfProgress)
      setForm((prev) => ({ ...prev, pdfUrl: url, pdfPublicId: publicId }))
      setPdfName(file.name)
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" })
    } finally {
      setPdfProgress(null)
    }
  }

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const invalid = validateImage(file)
    if (invalid) {
      toast({ title: "Image rejected", description: invalid, variant: "destructive" })
      return
    }

    try {
      setCoverUploading(true)
      const { url } = await uploadToCloudinary(file, "eko-communicator")
      setForm((prev) => ({ ...prev, coverImage: url }))
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" })
    } finally {
      setCoverUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast({ title: "Title is required", variant: "destructive" })
    if (!form.publishedDate) return toast({ title: "Publication date is required", variant: "destructive" })
    if (!form.pdfUrl) return toast({ title: "Please upload the magazine PDF", variant: "destructive" })

    try {
      setIsSaving(true)
      const res = await fetch(editingId ? `/api/admin/eko-communicator/${editingId}` : "/api/admin/eko-communicator", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save magazine")

      toast({ title: "Saved", description: editingId ? "Publication updated" : "Publication added" })
      setDialogOpen(false)
      fetchMagazines()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (m: Magazine) => {
    if (!window.confirm(`Delete "${m.title}"? The PDF will be permanently removed.`)) return

    try {
      setDeletingId(m._id)
      const res = await fetch(`/api/admin/eko-communicator/${m._id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete magazine")
      toast({ title: "Deleted", description: `"${m.title}" was deleted` })
      setMagazines((prev) => prev.filter((x) => x._id !== m._id))
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A97E]" />
      </div>
    )
  }

  const coverPreview = form.coverImage || pdfCoverFromUrl(form.pdfUrl, 300)

  return (
    <main className="container mx-auto px-4 py-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Eko Communicator</h1>
          <p className="text-muted-foreground mt-2">Publish magazine editions for readers on the Eko Communicator page</p>
        </div>
        <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Publication
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publications</CardTitle>
          <CardDescription>{magazines.length} publication(s), newest first</CardDescription>
        </CardHeader>
        <CardContent>
          {magazines.length === 0 ? (
            <p className="text-sm text-muted-foreground">No publications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Edition</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {magazines.map((m) => (
                    <TableRow key={m._id}>
                      <TableCell>
                        <div className="w-12 h-16 rounded overflow-hidden bg-gray-100">
                          {(m.coverImage || pdfCoverFromUrl(m.pdfUrl, 120)) && (
                            <img src={m.coverImage || pdfCoverFromUrl(m.pdfUrl, 120)} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{m.title}</TableCell>
                      <TableCell>{m.issueNumber || "—"}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDateUTC(m.publishedDate)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/projects/eko-communicator/${m._id}`} target="_blank" aria-label="View on site">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEdit(m)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(m)}
                          disabled={deletingId === m._id}
                          aria-label="Delete"
                        >
                          {deletingId === m._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => !isUploading && !isSaving && setDialogOpen(open)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Publication" : "Add Publication"}</DialogTitle>
            <DialogDescription>PDF files up to 10 MB. Readers can read online but cannot download.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mag-title">Title *</Label>
              <Input
                id="mag-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Convention Special"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mag-edition">Edition / Volume</Label>
                <Input
                  id="mag-edition"
                  value={form.issueNumber}
                  onChange={(e) => setForm((p) => ({ ...p, issueNumber: e.target.value }))}
                  placeholder="e.g. Vol. 5, No. 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mag-date">Publication date *</Label>
                <Input
                  id="mag-date"
                  type="date"
                  value={form.publishedDate}
                  onChange={(e) => setForm((p) => ({ ...p, publishedDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mag-desc">Description</Label>
              <Textarea
                id="mag-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What's in this publication?"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Magazine PDF *</Label>
              <input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handlePdfSelect} />
              {pdfProgress !== null ? (
                <div className="rounded-md border p-4 space-y-2">
                  <p className="text-sm">Uploading PDF... {pdfProgress}%</p>
                  <Progress value={pdfProgress} />
                </div>
              ) : form.pdfUrl ? (
                <div className="flex items-center justify-between gap-3 rounded-md border p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-5 w-5 text-red-600 shrink-0" />
                    <span className="text-sm truncate">{pdfName || "PDF uploaded"}</span>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => pdfInputRef.current?.click()}>
                    Replace
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-24 flex flex-col gap-1 border-dashed"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span>Select PDF</span>
                  <span className="text-xs text-gray-500">Max 10 MB</span>
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cover image</Label>
              <p className="text-xs text-muted-foreground">Optional. If none is uploaded, page 1 of the PDF is used as the cover.</p>
              <input ref={coverInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleCoverSelect} />
              <div className="flex items-start gap-4">
                <div className="w-24 aspect-[3/4] rounded border bg-gray-50 overflow-hidden flex items-center justify-center">
                  {coverUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-300" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()} disabled={coverUploading}>
                    <Upload className="h-4 w-4 mr-2" /> {form.coverImage ? "Change cover" : "Upload cover"}
                  </Button>
                  {form.coverImage && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setForm((p) => ({ ...p, coverImage: "" }))}>
                      <X className="h-4 w-4 mr-2" /> Use PDF page 1
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isUploading || isSaving}>
              Cancel
            </Button>
            <Button
              className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white"
              onClick={handleSave}
              disabled={isUploading || isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? "Save Changes" : "Add Publication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
