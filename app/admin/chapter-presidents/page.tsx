"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface ChapterPresident {
  _id: string
  name: string
  chapter: string
  image?: string
}

interface ChapterPresidentForm {
  name: string
  chapter: string
  image: string
}

const chapterOptions = [
  "Atlanta",
  "Austin",
  "California",
  "Dallas",
  "DC Metro",
  "Delaware Valley",
  "Detroit",
  "Eko Lagosians of Canada",
  "Florida",
  "Houston",
  "Eko club Houston Women",
  "London",
  "Louisiana",
  "Miami",
  "Minnesota",
  "Eko Lagosians of Minnesota",
  "New Jersey",
  "New York",
  "Ohio",
  "Pennsylvania",
  "Philadelphia",
  "Rhode Island",
  "San Antonio",
  "Lagosians of Chicago",
  "Eko Club Of Corpus Christi",
]

const OTHER_CHAPTER_OPTION = "Others"

const initialForm: ChapterPresidentForm = {
  name: "",
  chapter: "",
  image: "",
}

export default function ManageChapterPresidentsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const createFileInputRef = useRef<HTMLInputElement | null>(null)
  const editFileInputRef = useRef<HTMLInputElement | null>(null)

  const [presidents, setPresidents] = useState<ChapterPresident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const [newPresident, setNewPresident] = useState<ChapterPresidentForm>(initialForm)
  const [editingPresident, setEditingPresident] = useState<ChapterPresident | null>(null)
  const [newChapterSelection, setNewChapterSelection] = useState("")
  const [newCustomChapter, setNewCustomChapter] = useState("")
  const [editChapterSelection, setEditChapterSelection] = useState("")
  const [editCustomChapter, setEditCustomChapter] = useState("")
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false)
  const [isEditChapterOpen, setIsEditChapterOpen] = useState(false)

  const chapterOptionsWithOthers = [...chapterOptions, OTHER_CHAPTER_OPTION]

  const isKnownChapter = (chapter: string) => chapterOptions.includes(chapter)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user && user.role !== "admin") {
      router.push("/")
      return
    }

    fetchPresidents()
  }, [user, loading, router])

  const fetchPresidents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/chapter-presidents")

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch chapter presidents")
      }

      const data = await response.json()
      setPresidents(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load chapter presidents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const uploadImage = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG and PNG images are supported")
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to upload image")
      }

      return data.secure_url as string
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      setNewPresident((prev) => ({ ...prev, image: imageUrl }))
      toast({
        title: "Uploaded",
        description: "Image uploaded successfully",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Unable to upload image",
        variant: "destructive",
      })
    } finally {
      if (createFileInputRef.current) {
        createFileInputRef.current.value = ""
      }
    }
  }

  const handleEditUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editingPresident) return

    try {
      const imageUrl = await uploadImage(file)
      setEditingPresident((prev) => (prev ? { ...prev, image: imageUrl } : prev))
      toast({
        title: "Uploaded",
        description: "Image uploaded successfully",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Unable to upload image",
        variant: "destructive",
      })
    } finally {
      if (editFileInputRef.current) {
        editFileInputRef.current.value = ""
      }
    }
  }

  const handleCreate = async () => {
    if (!newPresident.name.trim() || !newPresident.chapter.trim()) {
      toast({
        title: "Validation error",
        description: "Name and chapter are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/admin/chapter-presidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPresident),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create chapter president")
      }

      toast({
        title: "Success",
        description: "Chapter president created successfully",
      })

      setIsCreateOpen(false)
      setNewPresident(initialForm)
      setNewChapterSelection("")
      setNewCustomChapter("")
      fetchPresidents()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create chapter president",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingPresident) return

    if (!editingPresident.name.trim() || !editingPresident.chapter.trim()) {
      toast({
        title: "Validation error",
        description: "Name and chapter are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/chapter-presidents/${editingPresident._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingPresident),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update chapter president")
      }

      toast({
        title: "Success",
        description: "Chapter president updated successfully",
      })

      setIsEditOpen(false)
      setEditingPresident(null)
      setEditChapterSelection("")
      setEditCustomChapter("")
      fetchPresidents()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update chapter president",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this chapter president?")
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/chapter-presidents/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete chapter president")
      }

      toast({
        title: "Success",
        description: "Chapter president deleted successfully",
      })

      fetchPresidents()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete chapter president",
        variant: "destructive",
      })
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
          <h1 className="text-3xl font-bold">Manage Chapter Presidents</h1>
          <p className="text-muted-foreground mt-2">Create, edit and delete chapter presidents</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add President
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Chapter President</DialogTitle>
              <DialogDescription>Add details for a chapter president.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  value={newPresident.name}
                  onChange={(e) => setNewPresident((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Hon. Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-chapter">Chapter</Label>
                <Popover open={isCreateChapterOpen} onOpenChange={setIsCreateChapterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="create-chapter"
                      variant="outline"
                      role="combobox"
                      aria-expanded={isCreateChapterOpen}
                      className="w-full justify-between font-normal"
                    >
                      {newChapterSelection || "Select chapter"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search chapter..." />
                      <CommandList
                        className="max-h-60 overflow-y-auto overscroll-contain"
                        onWheelCapture={(event) => event.stopPropagation()}
                      >
                        <CommandEmpty>No chapter found.</CommandEmpty>
                        <CommandGroup>
                          {chapterOptionsWithOthers.map((chapter) => (
                            <CommandItem
                              key={chapter}
                              value={chapter}
                              onSelect={() => {
                                setNewChapterSelection(chapter)
                                setIsCreateChapterOpen(false)

                                if (chapter === OTHER_CHAPTER_OPTION) {
                                  setNewPresident((prev) => ({ ...prev, chapter: newCustomChapter }))
                                  return
                                }

                                setNewPresident((prev) => ({ ...prev, chapter }))
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newChapterSelection === chapter ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {chapter}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {newChapterSelection === OTHER_CHAPTER_OPTION && (
                  <Input
                    id="create-custom-chapter"
                    value={newCustomChapter}
                    onChange={(e) => {
                      const chapter = e.target.value
                      setNewCustomChapter(chapter)
                      setNewPresident((prev) => ({ ...prev, chapter }))
                    }}
                    placeholder="Type chapter name"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-image">Image URL (optional)</Label>
                <Input
                  id="create-image"
                  value={newPresident.image}
                  onChange={(e) => setNewPresident((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                />
                <input
                  ref={createFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleCreateUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => createFileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload Image
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting || isUploading}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Presidents</CardTitle>
          <CardDescription>{presidents.length} record(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {presidents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chapter presidents added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presidents.map((president) => (
                    <TableRow key={president._id}>
                      <TableCell>{president.name}</TableCell>
                      <TableCell>{president.chapter}</TableCell>
                      <TableCell>
                        {president.image ? (
                          <a href={president.image} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            View image
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No image</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPresident(president)
                            if (isKnownChapter(president.chapter)) {
                              setEditChapterSelection(president.chapter)
                              setEditCustomChapter("")
                            } else {
                              setEditChapterSelection(OTHER_CHAPTER_OPTION)
                              setEditCustomChapter(president.chapter)
                            }
                            setIsEditOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(president._id)}>
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chapter President</DialogTitle>
            <DialogDescription>Update chapter president details.</DialogDescription>
          </DialogHeader>

          {editingPresident && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingPresident.name}
                  onChange={(e) => setEditingPresident((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-chapter">Chapter</Label>
                <Popover open={isEditChapterOpen} onOpenChange={setIsEditChapterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-chapter"
                      variant="outline"
                      role="combobox"
                      aria-expanded={isEditChapterOpen}
                      className="w-full justify-between font-normal"
                    >
                      {editChapterSelection || "Select chapter"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search chapter..." />
                      <CommandList
                        className="max-h-60 overflow-y-auto overscroll-contain"
                        onWheelCapture={(event) => event.stopPropagation()}
                      >
                        <CommandEmpty>No chapter found.</CommandEmpty>
                        <CommandGroup>
                          {chapterOptionsWithOthers.map((chapter) => (
                            <CommandItem
                              key={chapter}
                              value={chapter}
                              onSelect={() => {
                                setEditChapterSelection(chapter)
                                setIsEditChapterOpen(false)

                                if (chapter === OTHER_CHAPTER_OPTION) {
                                  setEditingPresident((prev) => (prev ? { ...prev, chapter: editCustomChapter } : prev))
                                  return
                                }

                                setEditingPresident((prev) => (prev ? { ...prev, chapter } : prev))
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  editChapterSelection === chapter ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {chapter}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {editChapterSelection === OTHER_CHAPTER_OPTION && (
                  <Input
                    id="edit-custom-chapter"
                    value={editCustomChapter}
                    onChange={(e) => {
                      const chapter = e.target.value
                      setEditCustomChapter(chapter)
                      setEditingPresident((prev) => (prev ? { ...prev, chapter } : prev))
                    }}
                    placeholder="Type chapter name"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL (optional)</Label>
                <Input
                  id="edit-image"
                  value={editingPresident.image || ""}
                  onChange={(e) => setEditingPresident((prev) => (prev ? { ...prev, image: e.target.value } : prev))}
                />
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleEditUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => editFileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload Image
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false)
                setEditingPresident(null)
                setEditChapterSelection("")
                setEditCustomChapter("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting || isUploading}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
