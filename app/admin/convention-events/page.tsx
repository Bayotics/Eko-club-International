"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Video, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Section {
  _id?: string
  title: string
  video: string
}

interface ConventionEvent {
  _id: string
  name: string
  location: string
  dateFrom: string
  dateTo: string
  year: number
  type: "Single" | "Sectioned"
  title?: string
  video?: string
  sections?: Section[]
  createdAt: string
  updatedAt: string
}

interface ConventionEventFormData {
  name: string
  location: string
  dateFrom: string
  dateTo: string
  year: string
  type: "Single" | "Sectioned"
  title: string
  video: string
  sections: Section[]
}

// Separate EventForm component defined outside to prevent recreation
const EventForm = React.memo<{
  formData: ConventionEventFormData
  onFormDataChange: (data: ConventionEventFormData) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  submitting: boolean
  editingEvent: ConventionEvent | null
}>(({ formData, onFormDataChange, onSubmit, onCancel, submitting, editingEvent }) => {
  const { toast } = useToast()

  const handleInputChange = useCallback(
    (field: keyof ConventionEventFormData, value: string) => {
      onFormDataChange({
        ...formData,
        [field]: value,
      })
    },
    [formData, onFormDataChange],
  )

  const handleSectionChange = useCallback(
    (index: number, field: "title" | "video", value: string) => {
      const newSections = [...formData.sections]
      newSections[index] = { ...newSections[index], [field]: value }
      onFormDataChange({
        ...formData,
        sections: newSections,
      })
    },
    [formData, onFormDataChange],
  )

  const addSection = useCallback(() => {
    onFormDataChange({
      ...formData,
      sections: [...formData.sections, { title: "", video: "" }],
    })
  }, [formData, onFormDataChange])

  const removeSection = useCallback(
    (index: number) => {
      if (formData.sections.length > 1) {
        const newSections = formData.sections.filter((_, i) => i !== index)
        onFormDataChange({
          ...formData,
          sections: newSections,
        })
      }
    },
    [formData, onFormDataChange],
  )

  const handleVideoUpload = useCallback(
    async (file: File, isSingle = true, sectionIndex?: number) => {
      try {
        const formDataUpload = new FormData()
        formDataUpload.append("file", file)
        formDataUpload.append("upload_preset", "convention_videos")

        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formDataUpload,
        })

        const data = await response.json()

        if (response.ok) {
          if (isSingle) {
            handleInputChange("video", data.secure_url)
          } else if (sectionIndex !== undefined) {
            handleSectionChange(sectionIndex, "video", data.secure_url)
          }

          toast({
            title: "Success",
            description: "Video uploaded successfully",
          })
        } else {
          throw new Error(data.error || "Upload failed")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload video",
          variant: "destructive",
        })
      }
    },
    [handleInputChange, handleSectionChange, toast],
  )

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event-name">Event Name *</Label>
          <Input
            id="event-name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter event name"
            required
          />
        </div>
        <div>
          <Label htmlFor="event-location">Location *</Label>
          <Input
            id="event-location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="event-date-from">Date From *</Label>
          <Input
            id="event-date-from"
            type="date"
            value={formData.dateFrom}
            onChange={(e) => handleInputChange("dateFrom", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="event-date-to">Date To *</Label>
          <Input
            id="event-date-to"
            type="date"
            value={formData.dateTo}
            onChange={(e) => handleInputChange("dateTo", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="event-year">Year *</Label>
          <Input
            id="event-year"
            type="number"
            value={formData.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            placeholder="2024"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="event-type">Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "Single" | "Sectioned") => handleInputChange("type", value)}
        >
          <SelectTrigger id="event-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Sectioned">Sectioned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "Single" && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium">Single Video Content</h4>
          <div>
            <Label htmlFor="single-title">Title *</Label>
            <Input
              id="single-title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>
          <div>
            <Label htmlFor="single-video">Video *</Label>
            <div className="space-y-2">
              <Input
                id="single-video"
                value={formData.video}
                onChange={(e) => handleInputChange("video", e.target.value)}
                placeholder="Enter video URL or upload file"
                required
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Or upload file:</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleVideoUpload(file, true)
                  }}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {formData.type === "Sectioned" && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Video Sections</h4>
            <Button type="button" onClick={addSection} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>

          {formData.sections.map((section, index) => (
            <div key={`section-${index}`} className="space-y-3 p-3 border rounded bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Section {index + 1}</span>
                {formData.sections.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSection(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor={`section-title-${index}`}>Title *</Label>
                <Input
                  id={`section-title-${index}`}
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                  placeholder="Enter section title"
                  required
                />
              </div>

              <div>
                <Label htmlFor={`section-video-${index}`}>Video *</Label>
                <div className="space-y-2">
                  <Input
                    id={`section-video-${index}`}
                    value={section.video}
                    onChange={(e) => handleSectionChange(index, "video", e.target.value)}
                    placeholder="Enter video URL or upload file"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Or upload file:</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleVideoUpload(file, false, index)
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
})

EventForm.displayName = "EventForm"

export default function ManageConventionEvents() {
  const [events, setEvents] = useState<ConventionEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ConventionEvent | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<ConventionEventFormData>({
    name: "",
    location: "",
    dateFrom: "",
    dateTo: "",
    year: "",
    type: "Single",
    title: "",
    video: "",
    sections: [{ title: "", video: "" }],
  })

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (yearFilter && yearFilter !== "all") params.append("year", yearFilter)
      if (typeFilter && typeFilter !== "all") params.append("type", typeFilter)
      params.append("limit", "50")

      const response = await fetch(`/api/admin/convention-events?${params}`)
      const data = await response.json()

      if (response.ok) {
        setEvents(data.events)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch convention events",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch convention events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [searchTerm, yearFilter, typeFilter, toast])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      location: "",
      dateFrom: "",
      dateTo: "",
      year: "",
      type: "Single",
      title: "",
      video: "",
      sections: [{ title: "", video: "" }],
    })
  }, [])

  const handleFormDataChange = useCallback((newFormData: ConventionEventFormData) => {
    setFormData(newFormData)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitting(true)

      try {
        // Validation
        if (!formData.name || !formData.location || !formData.dateFrom || !formData.dateTo || !formData.year) {
          throw new Error("Please fill in all required fields")
        }

        if (formData.type === "Single" && (!formData.title || !formData.video)) {
          throw new Error("Title and video are required for Single type events")
        }

        if (formData.type === "Sectioned") {
          const validSections = formData.sections.filter((section) => section.title && section.video)
          if (validSections.length === 0) {
            throw new Error("At least one complete section is required for Sectioned type events")
          }
        }

        const url = editingEvent ? `/api/admin/convention-events/${editingEvent._id}` : "/api/admin/convention-events"
        const method = editingEvent ? "PUT" : "POST"

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          toast({
            title: "Success",
            description: data.message,
          })

          resetForm()
          setIsCreateDialogOpen(false)
          setIsEditDialogOpen(false)
          setEditingEvent(null)
          fetchEvents()
        } else {
          throw new Error(data.error || "Failed to save convention event")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save convention event",
          variant: "destructive",
        })
      } finally {
        setSubmitting(false)
      }
    },
    [formData, editingEvent, toast, resetForm, fetchEvents],
  )

  const handleCancel = useCallback(() => {
    resetForm()
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setEditingEvent(null)
  }, [resetForm])

  const handleEdit = useCallback((event: ConventionEvent) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      location: event.location,
      dateFrom: event.dateFrom.split("T")[0],
      dateTo: event.dateTo.split("T")[0],
      year: event.year.toString(),
      type: event.type,
      title: event.title || "",
      video: event.video || "",
      sections: event.sections && event.sections.length > 0 ? event.sections : [{ title: "", video: "" }],
    })
    setIsEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (eventId: string) => {
      try {
        const response = await fetch(`/api/admin/convention-events/${eventId}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (response.ok) {
          toast({
            title: "Success",
            description: data.message,
          })
          fetchEvents()
        } else {
          throw new Error(data.error || "Failed to delete convention event")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete convention event",
          variant: "destructive",
        })
      }
    },
    [toast, fetchEvents],
  )

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }, [])

  const uniqueYears = useMemo(() => {
    const years = events.map((event) => event.year)
    return [...new Set(years)].sort((a, b) => b - a)
  }, [events])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading convention events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 mt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Convention Events</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Convention Event</DialogTitle>
            </DialogHeader>
            <EventForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitting={submitting}
              editingEvent={editingEvent}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Sectioned">Sectioned</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setYearFilter("")
                setTypeFilter("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
                <Badge variant={event.type === "Single" ? "default" : "secondary"}>{event.type}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.dateFrom)} - {formatDate(event.dateTo)}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Year:</span>
                  {event.year}
                </div>

                {event.type === "Single" && event.title && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Video className="h-4 w-4" />
                    {event.title}
                  </div>
                )}

                {event.type === "Sectioned" && event.sections && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Video className="h-4 w-4" />
                    {event.sections.length} section{event.sections.length !== 1 ? "s" : ""}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Convention Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{event.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(event._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No convention events found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || yearFilter || typeFilter
                ? "No events match your current filters."
                : "Get started by creating your first convention event."}
            </p>
            {!searchTerm && !yearFilter && !typeFilter && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create Your First Event</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Convention Event</DialogTitle>
          </DialogHeader>
          <EventForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
            editingEvent={editingEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
