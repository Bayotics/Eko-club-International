"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar, MapPin, Clock, ArrowLeft, Save, Trash2, X, ImageIcon,
  Images, Video, FolderPlus, Plus, Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { formatEventDate, formatEventTime, isPastEventDay } from "@/lib/event-time"

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/avi"]
const VIDEO_MAX_BYTES = 5 * 1024 * 1024

interface MediaItem {
  url?: string
  type: "image" | "video"
  file?: File
  preview?: string
  isNew?: boolean
}

interface ImageGroup {
  albumTitle: string
  media: MediaItem[]
}

const categories = ["Medical", "Cultural", "Education", "Youth", "Business", "Fundraising", "Convention", "General"]

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const { id } = React.use(params)

  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editedEvent, setEditedEvent] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  // Image groups editing state
  const [editGroups, setEditGroups] = useState<ImageGroup[]>([])
  const groupFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isPastDate = (dateStr: string) => isPastEventDay(dateStr)

  useEffect(() => {
    if (!loading && !user) { router.push("/login"); return }
    if (user && user.role !== "admin") { router.push("/"); return }
    fetchEvent()
  }, [user, loading, router, id])

  const fetchEvent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/events/${id}`)
      if (!response.ok) throw new Error("Failed to fetch event")
      const data = await response.json()
      setEvent(data)
      setEditedEvent(data)
      setEditGroups(
        (data.imageGroups || []).map((g) => ({
          albumTitle: g.albumTitle || "",
          media: (g.media || []).map((m) => ({ url: m.url, type: m.type || "image" })),
        })),
      )
    } catch {
      toast({ title: "Error", description: "Failed to load event details.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (event?.image) setImagePreview(event.image)
  }, [event])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!IMAGE_TYPES.includes(file.type)) {
      toast({ title: "Error", description: "Please upload JPG, PNG or WEBP images.", variant: "destructive" })
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleGroupMediaSelect = (gIdx: number, files: FileList | null) => {
    if (!files) return
    const newItems: MediaItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const isImage = IMAGE_TYPES.includes(file.type)
      const isVideo = VIDEO_TYPES.includes(file.type)
      if (!isImage && !isVideo) { toast({ title: "Skipped", description: `${file.name}: unsupported type.`, variant: "destructive" }); continue }
      if (isVideo && file.size > VIDEO_MAX_BYTES) { toast({ title: "Skipped", description: `${file.name} exceeds 5 MB.`, variant: "destructive" }); continue }
      newItems.push({ file, preview: URL.createObjectURL(file), type: isImage ? "image" : "video", isNew: true })
    }
    setEditGroups((prev) => {
      const updated = [...prev]
      updated[gIdx] = { ...updated[gIdx], media: [...updated[gIdx].media, ...newItems] }
      return updated
    })
  }

  const uploadFile = async (file: File): Promise<{ url: string; type: "image" | "video" } | null> => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/upload", { method: "POST", body: formData })
    if (!response.ok) { const err = await response.json(); throw new Error(err.error || "Upload failed") }
    const data = await response.json()
    return { url: data.secure_url, type: data.mediaType === "video" ? "video" : "image" }
  }

  const handleSaveChanges = async () => {
    try {
      setIsUploading(true)

      let imageUrl = editedEvent.image
      if (imageFile) {
        const result = await uploadFile(imageFile)
        if (!result) { setIsUploading(false); return }
        imageUrl = result.url
      }

      // Upload any new media in groups
      const uploadedGroups = await Promise.all(
        editGroups.map(async (group) => {
          const media = await Promise.all(
            group.media.map(async (item) => {
              if (item.isNew && item.file) {
                const result = await uploadFile(item.file)
                if (!result) throw new Error("Media upload failed")
                return { url: result.url, type: result.type }
              }
              return { url: item.url, type: item.type }
            }),
          )
          return { albumTitle: group.albumTitle, media }
        }),
      )

      setIsUploading(false)
      setIsLoading(true)

      const response = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editedEvent,
          image: imageUrl,
          featured: isPastDate(editedEvent.date) ? false : editedEvent.featured,
          imageGroups: uploadedGroups,
        }),
      })

      if (!response.ok) throw new Error("Failed to update event")

      toast({ title: "Success", description: "Event updated successfully" })
      setEvent({ ...editedEvent, image: imageUrl, imageGroups: uploadedGroups })
      setIsEditing(false)
      setImageFile(null)
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to update event.", variant: "destructive" })
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete event")
      toast({ title: "Success", description: "Event deleted successfully" })
      router.push("/admin/events")
    } catch {
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E] mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Event not found</p>
          <Button onClick={() => router.push("/admin/events")} className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/events")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Event" : "Event Details"}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-0 shadow-md">
            {isEditing ? (
              <CardContent className="p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input value={editedEvent.title} onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })} required />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={editedEvent.description} onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                    className="min-h-[150px]" required />
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date"
                      value={editedEvent.date ? new Date(editedEvent.date).toISOString().split("T")[0] : ""}
                      onChange={(e) => {
                        const d = e.target.value
                        setEditedEvent({ ...editedEvent, date: d, featured: isPastDate(d) ? false : editedEvent.featured })
                      }} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Time (Eastern Time)</Label>
                    <Input type="time" value={editedEvent.time || ""}
                      onChange={(e) => setEditedEvent({ ...editedEvent, time: e.target.value })} />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={editedEvent.location} onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })} required />
                </div>

                {/* Registration link */}
                <div className="space-y-2">
                  <Label>Registration Link (optional)</Label>
                  <Input value={editedEvent.registrationLink || ""} placeholder="https://..."
                    onChange={(e) => setEditedEvent({ ...editedEvent, registrationLink: e.target.value })} />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editedEvent.category} onValueChange={(v) => setEditedEvent({ ...editedEvent, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cover image */}
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageSelect} className="hidden" />
                  {imagePreview ? (
                    <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <Button type="button" variant="destructive" size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => {
                          if (imageFile) { setImageFile(null); setImagePreview(editedEvent.image); if (fileInputRef.current) fileInputRef.current.value = "" }
                          else { setImagePreview(null); setEditedEvent({ ...editedEvent, image: "" }) }
                        }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline"
                      className="w-full h-36 flex flex-col gap-2 items-center justify-center border-dashed"
                      onClick={() => fileInputRef.current?.click()}>
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span>Click to select a cover image</span>
                    </Button>
                  )}
                </div>

                {/* Featured */}
                {!isPastDate(editedEvent.date) && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" checked={editedEvent.featured}
                      onCheckedChange={(c) => setEditedEvent({ ...editedEvent, featured: c === true })} />
                    <Label htmlFor="featured" className="cursor-pointer">Featured Event</Label>
                  </div>
                )}

                {/* Image groups */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Images className="h-4 w-4 text-[#C8A97E]" />
                    <Label className="font-medium">Image / Video Albums</Label>
                  </div>

                  {editGroups.map((group, gIdx) => (
                    <div key={gIdx} className="bg-gray-50 border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Group {gIdx + 1}</span>
                        <Button type="button" variant="ghost" size="sm" className="text-red-500 h-7 px-2"
                          onClick={() => setEditGroups((prev) => prev.filter((_, i) => i !== gIdx))}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input placeholder="Album Title" value={group.albumTitle}
                        onChange={(e) => {
                          const updated = [...editGroups]; updated[gIdx].albumTitle = e.target.value; setEditGroups(updated)
                        }} />
                      {group.media.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {group.media.map((item, mIdx) => (
                            <div key={mIdx} className="relative rounded overflow-hidden bg-gray-100 aspect-square">
                              {item.type === "image" ? (
                                <img src={item.isNew ? item.preview : item.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 gap-1">
                                  <Video className="h-7 w-7 text-gray-500" />
                                  <span className="text-xs text-gray-500">Video</span>
                                </div>
                              )}
                              <button type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                onClick={() => {
                                  const updated = [...editGroups]
                                  updated[gIdx].media = updated[gIdx].media.filter((_, i) => i !== mIdx)
                                  setEditGroups(updated)
                                }}>
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        ref={(el) => { groupFileInputRefs.current[gIdx] = el }}
                        type="file" multiple
                        accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm,.avi"
                        className="hidden"
                        onChange={(e) => { handleGroupMediaSelect(gIdx, e.target.files); e.target.value = "" }}
                      />
                      <Button type="button" variant="outline" size="sm" className="w-full border-dashed"
                        onClick={() => groupFileInputRefs.current[gIdx]?.click()}>
                        <Plus className="h-4 w-4 mr-1" /> Add Images / Videos
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline"
                    className="w-full border-dashed text-[#C8A97E] border-[#C8A97E] hover:bg-[#C8A97E]/10"
                    onClick={() => setEditGroups((prev) => [...prev, { albumTitle: "", media: [] }])}>
                    <FolderPlus className="h-4 w-4 mr-2" /> Add Image Group
                  </Button>
                </div>

                {/* Save / Cancel */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => {
                    setEditedEvent(event)
                    setIsEditing(false)
                    setImageFile(null)
                    setImagePreview(event.image)
                    setEditGroups((event.imageGroups || []).map((g) => ({
                      albumTitle: g.albumTitle || "",
                      media: (g.media || []).map((m) => ({ url: m.url, type: m.type || "image" })),
                    })))
                  }}>Cancel</Button>
                  <Button onClick={handleSaveChanges} className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white"
                    disabled={isLoading || isUploading}>
                    {isUploading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Uploading...</>
                      : isLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Saving...</>
                      : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                {/* View mode — cover image */}
                <div className="relative">
                  <img src={event.image || "/placeholder.svg?height=400&width=600"} alt={event.title}
                    className="w-full max-h-80 object-contain bg-gray-100" />
                  {event.featured && (
                    <div className="absolute top-4 right-4 bg-[#C8A97E] text-white px-3 py-1 text-sm font-medium rounded-md">
                      Featured Event
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-[#C8A97E] text-white">{event.category}</Badge>
                    {isPastEventDay(event.date) && (
                      <Badge variant="outline" className="border-red-500 text-red-500">Past Event</Badge>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-4">{event.title}</h2>

                  <div className="space-y-3 mb-6 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-[#C8A97E]" />
                      <span>{formatEventDate(event.date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-[#C8A97E]" />
                      <span>{formatEventTime(event.time)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-[#C8A97E]" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Separator className="my-6" />
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <div className="text-gray-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />

                  {/* Image groups display */}
                  {event.imageGroups?.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Images className="h-5 w-5 text-[#C8A97E]" /> Photo / Video Albums
                      </h3>
                      <div className="space-y-6">
                        {event.imageGroups.map((group, gIdx) => (
                          <div key={gIdx}>
                            {group.albumTitle && <p className="font-medium text-gray-700 mb-2">{group.albumTitle}</p>}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {(group.media || []).map((item, mIdx) => (
                                <div key={mIdx} className="rounded overflow-hidden bg-gray-100 aspect-square relative">
                                  {item.type === "video" ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 gap-1">
                                      <Play className="h-8 w-8 text-gray-600" />
                                      <span className="text-xs text-gray-500">Video</span>
                                    </div>
                                  ) : (
                                    <img src={item.url} alt={`${group.albumTitle} ${mIdx + 1}`}
                                      className="w-full h-full object-cover" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-2 mt-8">
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => setIsDeleteDialogOpen(true)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <Button onClick={() => setIsEditing(true)} className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white">
                      Edit Event
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Event Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{isPastEventDay(event.date) ? "Past" : "Upcoming"}</p>
                </div>
                <Separator />
                {event.imageGroups?.length > 0 && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Albums</p>
                      <p className="font-medium">{event.imageGroups.length} album{event.imageGroups.length > 1 ? "s" : ""}</p>
                    </div>
                    <Separator />
                  </>
                )}
                <div>
                  <p className="text-sm text-gray-500">Event ID</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-500 break-all">{event._id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this event? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>Delete Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
