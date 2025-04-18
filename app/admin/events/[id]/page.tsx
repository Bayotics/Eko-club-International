"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Clock, ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function EventDetailsPage({ params }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const { id } = params
  
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editedEvent, setEditedEvent] = useState(null)
  
  const categories = ["Medical", "Cultural", "Education", "Youth", "Business", "Fundraising", "Other"]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user && user.role !== "admin") {
      router.push("/")
      return
    }

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
    } catch (error) {
      console.error("Error fetching event:", error)
      toast({
        title: "Error",
        description: "Failed to load event details. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedEvent),
      })

      if (!response.ok) throw new Error("Failed to update event")
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      })
      
      setEvent(editedEvent)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating event:", error)
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete event")
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
      
      router.push("/admin/events")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E] mx-auto mb-4"></div>
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
          <Button 
            onClick={() => router.push("/admin/events")}
            className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/events")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Event" : "Event Details"}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-0 shadow-md">
            {isEditing ? (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={editedEvent.title}
                      onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedEvent.description}
                      onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                      placeholder="Enter event description"
                      required
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={editedEvent.date ? new Date(editedEvent.date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={editedEvent.time}
                        onChange={(e) => setEditedEvent({ ...editedEvent, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedEvent.location}
                      onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
                      placeholder="Enter event location"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editedEvent.category}
                      onValueChange={(value) => setEditedEvent({ ...editedEvent, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={editedEvent.image}
                      onChange={(e) => setEditedEvent({ ...editedEvent, image: e.target.value })}
                      placeholder="Enter image URL or leave default"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={editedEvent.featured}
                      onCheckedChange={(checked) => 
                        setEditedEvent({ ...editedEvent, featured: checked === true })
                      }
                    />
                    <Label htmlFor="featured">Featured Event</Label>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditedEvent(event)
                        setIsEditing(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveChanges}
                      className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <>
                <div className="relative h-64 md:h-80">
                  <img
                    src={event.image || "/placeholder.svg?height=400&width=600"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.featured && (
                    <div className="absolute top-4 right-4 bg-[#C8A97E] text-white px-3 py-1 text-sm font-medium rounded-md">
                      Featured Event
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-[#C8A97E] text-white">{event.category}</Badge>
                    {new Date(event.date) < new Date() && (
                      <Badge variant="outline" className="border-red-500 text-red-500">Past Event</Badge>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
                  
                  <div className="space-y-3 mb-6 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-[#C8A97E]" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-[#C8A97E]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-[#C8A97E]" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Description</h3>
                    <p className="whitespace-pre-line">{event.description}</p>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-8">
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white"
                    >
                      Edit Event
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Event Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p>{new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}</p>
                </div>
                
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Event ID</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">{event._id}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(`/events?highlight=${event._id}`, '_blank')}
                  >
                    View on Public Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEvent}
            >
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
