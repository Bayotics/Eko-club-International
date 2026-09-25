"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ExternalLink, ImagePlus, Loader2, Pencil, Plus, Trash2, Upload, UserRound, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { TipTapEditor } from "@/components/tiptap-editor"
import { uploadToCloudinary, validateImage } from "@/lib/cloudinary-upload"
import { formatDateUTC, toDateInputValue } from "@/lib/format-date"

interface Memorial {
  _id: string
  name: string
  photo: string
  dateOfBirth: string | null
  dateOfPassing: string
  chapter: string
  role: string
  biography: string
  gallery: string[]
}

type MemorialForm = Omit<Memorial, "_id" | "dateOfBirth"> & { dateOfBirth: string }

const emptyForm: MemorialForm = {
  name: "",
  photo: "",
  dateOfBirth: "",
  dateOfPassing: "",
  chapter: "",
  role: "",
  biography: "",
  gallery: [],
}

export default function ManageMemorialsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const photoInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [form, setForm] = useState<MemorialForm>(emptyForm)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isUploading = photoUploading || galleryUploading > 0

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
    fetchMemorials()
  }, [user, loading, router])

  const fetchMemorials = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/memorials")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load entries")
      setMemorials(data)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setEditorKey((k) => k + 1)
    setDialogOpen(true)
  }

  const openEdit = (m: Memorial) => {
    setEditingId(m._id)
    setForm({
      name: m.name,
      photo: m.photo || "",
      dateOfBirth: toDateInputValue(m.dateOfBirth),
      dateOfPassing: toDateInputValue(m.dateOfPassing),
      chapter: m.chapter || "",
      role: m.role || "",
      biography: m.biography || "",
      gallery: m.gallery || [],
    })
    setEditorKey((k) => k + 1)
    setDialogOpen(true)
  }

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const invalid = validateImage(file)
    if (invalid) {
      toast({ title: "Image rejected", description: invalid, variant: "destructive" })
      return
    }

    try {
      setPhotoUploading(true)
      const { url } = await uploadToCloudinary(file, "in-loving-memory")
      setForm((p) => ({ ...p, photo: url }))
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" })
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return

    const valid: File[] = []
    for (const file of files) {
      const invalid = validateImage(file)
      if (invalid) toast({ title: "Image skipped", description: invalid, variant: "destructive" })
      else valid.push(file)
    }

    setGalleryUploading((n) => n + valid.length)
    await Promise.all(
      valid.map(async (file) => {
        try {
          const { url } = await uploadToCloudinary(file, "in-loving-memory")
          setForm((p) => ({ ...p, gallery: [...p.gallery, url] }))
        } catch (error: any) {
          toast({ title: "Upload failed", description: `${file.name}: ${error.message}`, variant: "destructive" })
        } finally {
          setGalleryUploading((n) => n - 1)
        }
      }),
    )
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast({ title: "Name is required", variant: "destructive" })
    if (!form.dateOfPassing) return toast({ title: "Date of passing is required", variant: "destructive" })
    if (form.dateOfBirth && form.dateOfBirth > form.dateOfPassing) {
      return toast({ title: "Date of birth must be before date of passing", variant: "destructive" })
    }

    try {
      setIsSaving(true)
      const res = await fetch(editingId ? `/api/admin/memorials/${editingId}` : "/api/admin/memorials", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save entry")

      toast({ title: "Saved", description: editingId ? "Entry updated" : "Entry added" })
      setDialogOpen(false)
      fetchMemorials()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (m: Memorial) => {
    if (!window.confirm(`Delete the entry for ${m.name}? This cannot be undone.`)) return

    try {
      setDeletingId(m._id)
      const res = await fetch(`/api/admin/memorials/${m._id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete entry")
      toast({ title: "Deleted", description: `Entry for ${m.name} was deleted` })
      setMemorials((prev) => prev.filter((x) => x._id !== m._id))
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

  return (
    <main className="container mx-auto px-4 py-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage In Loving Memory</h1>
          <p className="text-muted-foreground mt-2">Add and edit tributes to departed members</p>
        </div>
        <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Entry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
          <CardDescription>{memorials.length} entr{memorials.length === 1 ? "y" : "ies"}, most recent passing first</CardDescription>
        </CardHeader>
        <CardContent>
          {memorials.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date of passing</TableHead>
                    <TableHead>Chapter / Role</TableHead>
                    <TableHead>Gallery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memorials.map((m) => (
                    <TableRow key={m._id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {m.photo ? (
                            <img src={m.photo} alt="" className="w-full h-full object-cover object-top" />
                          ) : (
                            <UserRound className="h-6 w-6 text-gray-300" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDateUTC(m.dateOfPassing)}</TableCell>
                      <TableCell>{[m.chapter, m.role].filter(Boolean).join(" · ") || "—"}</TableCell>
                      <TableCell>{m.gallery?.length ? `${m.gallery.length} photo(s)` : "—"}</TableCell>
                      <TableCell className="text-right whitespace-nowrap space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/projects/in-loving-memory/${m._id}`} target="_blank" aria-label="View on site">
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
        <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Entry" : "Add Entry"}</DialogTitle>
            <DialogDescription>Fields marked * are required.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-24 aspect-[4/5] rounded-md border bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                {photoUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : form.photo ? (
                  <img src={form.photo} alt="Portrait preview" className="w-full h-full object-cover object-top" />
                ) : (
                  <UserRound className="h-8 w-8 text-gray-300" />
                )}
              </div>
              <div className="space-y-2">
                <Label>Portrait photo</Label>
                <input ref={photoInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handlePhotoSelect} />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()} disabled={photoUploading}>
                    <Upload className="h-4 w-4 mr-2" /> {form.photo ? "Change photo" : "Upload photo"}
                  </Button>
                  {form.photo && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setForm((p) => ({ ...p, photo: "" }))}>
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">JPG, PNG or WEBP, up to 10 MB.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mem-name">Full name *</Label>
              <Input
                id="mem-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Chief Adebayo Johnson"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mem-dob">Date of birth</Label>
                <Input
                  id="mem-dob"
                  type="date"
                  value={form.dateOfBirth}
                  max={form.dateOfPassing || undefined}
                  onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mem-dop">Date of passing *</Label>
                <Input
                  id="mem-dop"
                  type="date"
                  value={form.dateOfPassing}
                  min={form.dateOfBirth || undefined}
                  onChange={(e) => setForm((p) => ({ ...p, dateOfPassing: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mem-chapter">Chapter</Label>
                <Input
                  id="mem-chapter"
                  value={form.chapter}
                  onChange={(e) => setForm((p) => ({ ...p, chapter: e.target.value }))}
                  placeholder="e.g. Houston Chapter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mem-role">Role in the club</Label>
                <Input
                  id="mem-role"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  placeholder="e.g. Former Treasurer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Biography / tribute</Label>
              <TipTapEditor
                key={editorKey}
                content={form.biography}
                onChange={(html) => setForm((p) => ({ ...p, biography: html }))}
                placeholder="Write a tribute or life story"
              />
            </div>

            <div className="space-y-2">
              <Label>Photo gallery</Label>
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleGallerySelect}
              />
              {(form.gallery.length > 0 || galleryUploading > 0) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {form.gallery.map((url, i) => (
                    <div key={url + i} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }))}
                        className="absolute top-1 right-1 rounded-full bg-red-600 text-white p-1 hover:bg-red-700"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: galleryUploading }).map((_, i) => (
                    <div key={`uploading-${i}`} className="aspect-square rounded bg-gray-100 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => galleryInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-2" /> Add photos
              </Button>
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
              {isUploading ? "Uploading..." : editingId ? "Save Changes" : "Add Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
