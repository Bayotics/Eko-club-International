"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar, MapPin, Clock, Plus, Edit, Trash2, Search, Filter,
  ChevronDown, X, ImageIcon, Images, Video, FolderPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { TipTapEditor } from "@/components/tiptap-editor"

interface MediaItem {
  file: File
  preview: string
  type: "image" | "video"
}

interface ImageGroup {
  albumTitle: string
  mediaItems: MediaItem[]
}

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/avi"]
const VIDEO_MAX_BYTES = 5 * 1024 * 1024

export default function AdminEventsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Cultural",
    image: "",
    imageFile: null,
    imagePreview: null,
    featured: false,
    registrationLink: "",
  })

  // Multiple image groups state
  const [addMultipleImages, setAddMultipleImages] = useState(false)
  const [imageGroups, setImageGroups] = useState<ImageGroup[]>([
    { albumTitle: "", mediaItems: [] },
  ])
  const groupFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const categories = [
    "All", "Medical", "Cultural", "Education", "Youth",
    "Business", "Fundraising", "Convention", "General",
  ]

  const isPastDate = (dateStr: string) => {
    if (!dateStr) return false
    return new Date(dateStr) < new Date()
  }

  useEffect(() => {
    if (!loading && !user) { router.push("/login"); return }
    if (user && user.role !== "admin") { router.push("/"); return }
    fetchEvents()
  }, [user, loading, router])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load events.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!IMAGE_TYPES.includes(file.type)) {
      toast({ title: "Error", description: "Please upload JPG, PNG or WEBP images.", variant: "destructive" })
      return
    }
    setNewEvent({ ...newEvent, imageFile: file, imagePreview: URL.createObjectURL(file) })
  }

  const handleGroupMediaSelect = (groupIdx: number, files: FileList | null) => {
    if (!files) return
    const newItems: MediaItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const isImage = IMAGE_TYPES.includes(file.type)
      const isVideo = VIDEO_TYPES.includes(file.type)
      if (!isImage && !isVideo) {
        toast({ title: "Skipped", description: `${file.name}: unsupported type.`, variant: "destructive" })
        continue
      }
      if (isVideo && file.size > VIDEO_MAX_BYTES) {
        toast({ title: "Skipped", description: `${file.name} exceeds 5 MB limit.`, variant: "destructive" })
        continue
      }
      newItems.push({ file, preview: URL.createObjectURL(file), type: isImage ? "image" : "video" })
    }
    setImageGroups((prev) => {
      const updated = [...prev]
      updated[groupIdx] = { ...updated[groupIdx], mediaItems: [...updated[groupIdx].mediaItems, ...newItems] }
      return updated
    })
  }

  const removeGroupMedia = (groupIdx: number, mediaIdx: number) => {
    setImageGroups((prev) => {
      const updated = [...prev]
      updated[groupIdx].mediaItems = updated[groupIdx].mediaItems.filter((_, i) => i !== mediaIdx)
      return updated
    })
  }

  const addImageGroup = () => {
    setImageGroups((prev) => [...prev, { albumTitle: "", mediaItems: [] }])
  }

  const removeImageGroup = (idx: number) => {
    setImageGroups((prev) => prev.filter((_, i) => i !== idx))
  }

  const uploadFile = async (file: File): Promise<{ url: string; type: "image" | "video" } | null> => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/upload", { method: "POST", body: formData })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || "Upload failed")
    }
    const data = await response.json()
    return { url: data.secure_url, type: data.mediaType === "video" ? "video" : "image" }
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      setIsUploading(true)

      // Upload cover image
      let imageUrl = newEvent.image
      if (newEvent.imageFile) {
        const result = await uploadFile(newEvent.imageFile)
        if (!result) return
        imageUrl = result.url
      }

      // Upload image groups
      let uploadedGroups = []
      if (addMultipleImages) {
        uploadedGroups = await Promise.all(
          imageGroups.map(async (group) => {
            const media = await Promise.all(
              group.mediaItems.map(async (item) => {
                const result = await uploadFile(item.file)
                if (!result) throw new Error("Media upload failed")
                return result
              }),
            )
            return { albumTitle: group.albumTitle, media }
          }),
        )
      }

      setIsUploading(false)
      setIsLoading(true)

      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        category: newEvent.category,
        image: imageUrl,
        featured: isPastDate(newEvent.date) ? false : newEvent.featured,
        registrationLink: newEvent.registrationLink,
        imageGroups: uploadedGroups,
      }

      console.log("ADMIN: Sending event data with imageGroups:", JSON.stringify(eventData, null, 2))

      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create event")

      toast({ title: "Success", description: "Event created successfully" })
      setIsCreateDialogOpen(false)
      resetCreateForm()
      fetchEvents()
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to create event.", variant: "destructive" })
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  const resetCreateForm = () => {
    setNewEvent({
      title: "", description: "", date: "", time: "", location: "",
      category: "Cultural", image: "", imageFile: null, imagePreview: null,
      featured: false, registrationLink: "",
    })
    setAddMultipleImages(false)
    setImageGroups([{ albumTitle: "", mediaItems: [] }])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return
    try {
      const response = await fetch(`/api/admin/events/${eventToDelete}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete event")
      toast({ title: "Success", description: "Event deleted successfully" })
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
      fetchEvents()
    } catch {
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" })
    }
  }

  const filteredEvents = events.filter((event) => {
    if (filterCategory !== "All" && event.category !== filterCategory) return false
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const upcomingEvents = filteredEvents.filter((event) => new Date(event.date) >= new Date())
  const pastEvents = filteredEvents.filter((event) => new Date(event.date) < new Date())

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E] mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const EventCard = ({ event, isPast = false }) => (
    <Card key={event._id} className={`overflow-hidden border-0 shadow-md ${isPast ? "opacity-80" : ""}`}>
      <div className="relative h-48 bg-gray-100">
        <img
          src={event.image || "/placeholder.svg?height=400&width=600"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {isPast && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Badge className="bg-gray-800 text-white">Past Event</Badge>
          </div>
        )}
        {!isPast && event.featured && (
          <div className="absolute top-0 right-0 bg-[#C8A97E] text-white px-3 py-1 text-sm font-medium">Featured</div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge className={isPast ? "" : "bg-[#C8A97E] text-white"} variant={isPast ? "outline" : "default"}>
            {event.category}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/admin/events/${event._id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => { setEventToDelete(event._id); setIsDeleteDialogOpen(true) }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
        <div className="text-gray-600 text-sm mb-4 line-clamp-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: event.description }} />
        <div className="space-y-1 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#C8A97E]" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          {event.time && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-[#C8A97E]" />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-[#C8A97E]" />
            <span>{event.location}</span>
          </div>
          {event.imageGroups?.length > 0 && (
            <div className="flex items-center">
              <Images className="h-4 w-4 mr-2 text-[#C8A97E]" />
              <span>{event.imageGroups.length} album{event.imageGroups.length > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/events/${event._id}`)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Management</h1>
          <p className="text-gray-600">Create and manage events for Eko Club International</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetCreateForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white">
              <Plus className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Fill in the details below to create a new event.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-5 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title" required />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <TipTapEditor content={newEvent.description}
                  onChange={(content) => setNewEvent({ ...newEvent, description: content })}
                  placeholder="Enter event description" />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={newEvent.date}
                    onChange={(e) => {
                      const d = e.target.value
                      setNewEvent({ ...newEvent, date: d, featured: isPastDate(d) ? false : newEvent.featured })
                    }} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} required />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter event location" required />
              </div>

              {/* Registration link */}
              <div className="space-y-2">
                <Label htmlFor="registrationLink">Registration Link (optional)</Label>
                <Input id="registrationLink" value={newEvent.registrationLink}
                  onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
                  placeholder="https://..." />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newEvent.category} onValueChange={(v) => setNewEvent({ ...newEvent, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== "All").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cover image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageSelect} className="hidden" />
                {newEvent.imagePreview ? (
                  <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                    <img src={newEvent.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <Button type="button" variant="destructive" size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => { setNewEvent({ ...newEvent, imageFile: null, imagePreview: null }); if (fileInputRef.current) fileInputRef.current.value = "" }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline"
                    className="w-full h-36 flex flex-col gap-2 items-center justify-center border-dashed"
                    onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span>Click to select a cover image</span>
                    <span className="text-xs text-gray-500">JPG, PNG, WEBP</span>
                  </Button>
                )}
              </div>

              {/* Featured — hidden for past dates */}
              {!isPastDate(newEvent.date) && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" checked={newEvent.featured}
                    onCheckedChange={(c) => setNewEvent({ ...newEvent, featured: c === true })} />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Event? (shown on homepage to non-members)
                  </Label>
                </div>
              )}

              {/* Multiple images toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox id="addMultiple" checked={addMultipleImages}
                  onCheckedChange={(c) => setAddMultipleImages(c === true)} />
                <Label htmlFor="addMultiple" className="cursor-pointer font-medium flex items-center gap-2">
                  <Images className="h-4 w-4" /> Add multiple images / videos?
                </Label>
              </div>

              {/* Image groups */}
              {addMultipleImages && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Group your images/videos into albums. Videos must be under 5 MB.
                  </p>
                  {imageGroups.map((group, gIdx) => (
                    <div key={gIdx} className="bg-white border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Image Group {gIdx + 1}</span>
                        {imageGroups.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" className="text-red-500 h-7 px-2"
                            onClick={() => removeImageGroup(gIdx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Album Title</Label>
                        <Input placeholder="e.g. Day 1 Highlights" value={group.albumTitle}
                          onChange={(e) => {
                            const updated = [...imageGroups]
                            updated[gIdx].albumTitle = e.target.value
                            setImageGroups(updated)
                          }} />
                      </div>

                      {/* Media previews */}
                      {group.mediaItems.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {group.mediaItems.map((item, mIdx) => (
                            <div key={mIdx} className="relative rounded overflow-hidden bg-gray-100 aspect-square">
                              {item.type === "image" ? (
                                <img src={item.preview} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Video className="h-8 w-8 text-gray-500" />
                                  <span className="sr-only">{item.file.name}</span>
                                </div>
                              )}
                              <button type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                onClick={() => removeGroupMedia(gIdx, mIdx)}>
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        ref={(el) => { groupFileInputRefs.current[gIdx] = el }}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm,.avi"
                        multiple
                        className="hidden"
                        onChange={(e) => { handleGroupMediaSelect(gIdx, e.target.files); e.target.value = "" }}
                      />
                      <Button type="button" variant="outline" size="sm"
                        className="w-full border-dashed"
                        onClick={() => groupFileInputRefs.current[gIdx]?.click()}>
                        <Plus className="h-4 w-4 mr-1" /> Add Images / Videos
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline"
                    className="w-full border-dashed text-[#C8A97E] border-[#C8A97E] hover:bg-[#C8A97E]/10"
                    onClick={addImageGroup}>
                    <FolderPlus className="h-4 w-4 mr-2" /> Add Another Image Group
                  </Button>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetCreateForm() }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white"
                  disabled={isLoading || isUploading}>
                  {isUploading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Uploading...</>
                  ) : isLoading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Creating...</>
                  ) : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input type="text" placeholder="Search events..." className="pl-10"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A97E] mx-auto mb-4" />
                <p>Loading events...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No upcoming events found</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white">
                  <Plus className="mr-2 h-4 w-4" /> Create New Event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => <EventCard key={event._id} event={event} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A97E] mx-auto mb-4" />
                <p>Loading events...</p>
              </div>
            ) : pastEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No past events found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => <EventCard key={event._id} event={event} isPast />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete dialog */}
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
