"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Loader2, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Editor } from "@/components/meeting-minutes-editor"

interface Meeting {
  _id: string
  title: string
  date: string
  location: string
}

interface MeetingMinutes {
  _id: string
  meetingId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function ManageMeetingMinutes() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [meetingMinutes, setMeetingMinutes] = useState<MeetingMinutes[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<string>("")
  const [selectedMinutes, setSelectedMinutes] = useState<MeetingMinutes | null>(null)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("create")
  const { toast } = useToast()
  const router = useRouter()

  // Fetch meetings and meeting minutes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch meetings
        const meetingsRes = await fetch("/api/admin/meetings")
        if (!meetingsRes.ok) throw new Error("Failed to fetch meetings")
        const meetingsData = await meetingsRes.json()
        setMeetings(meetingsData)

        // Fetch meeting minutes
        const minutesRes = await fetch("/api/admin/meeting-minutes")
        if (!minutesRes.ok) throw new Error("Failed to fetch meeting minutes")
        const minutesData = await minutesRes.json()
        setMeetingMinutes(minutesData)

        setIsLoading(false)
      } catch (err) {
        setError((err as Error).message)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle create meeting minutes
  const handleCreateMinutes = async () => {
    if (!selectedMeeting || !title || !content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/meeting-minutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId: selectedMeeting,
          title,
          content,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create meeting minutes")
      }

      const newMinutes = await res.json()
      setMeetingMinutes([...meetingMinutes, newMinutes])

      toast({
        title: "Success",
        description: "Meeting minutes created successfully",
        variant: "default",
      })

      // Reset form
      setSelectedMeeting("")
      setTitle("")
      setContent("")
      setActiveTab("manage")
      setIsLoading(false)
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Handle update meeting minutes
  const handleUpdateMinutes = async () => {
    if (!selectedMinutes || !title || !content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/meeting-minutes/${selectedMinutes._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId: selectedMinutes.meetingId,
          title,
          content,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update meeting minutes")
      }

      const updatedMinutes = await res.json()
      setMeetingMinutes(
        meetingMinutes.map((minutes) => (minutes._id === updatedMinutes._id ? updatedMinutes : minutes)),
      )

      toast({
        title: "Success",
        description: "Meeting minutes updated successfully",
        variant: "default",
      })

      setIsLoading(false)
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Handle delete meeting minutes
  const handleDeleteMinutes = async (id: string) => {
    if (!confirm("Are you sure you want to delete these meeting minutes?")) {
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/meeting-minutes/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to delete meeting minutes")
      }

      setMeetingMinutes(meetingMinutes.filter((minutes) => minutes._id !== id))

      if (selectedMinutes && selectedMinutes._id === id) {
        setSelectedMinutes(null)
        setTitle("")
        setContent("")
      }

      toast({
        title: "Success",
        description: "Meeting minutes deleted successfully",
        variant: "default",
      })

      setIsLoading(false)
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Handle edit meeting minutes
  const handleEditMinutes = (minutes: MeetingMinutes) => {
    setSelectedMinutes(minutes)
    setTitle(minutes.title)
    setContent(minutes.content)
    setActiveTab("edit")
  }

  // Find meeting title by ID
  const getMeetingTitle = (id: string) => {
    const meeting = meetings.find((m) => m._id === id)
    return meeting ? meeting.title : "Unknown Meeting"
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Manage Meeting Minutes</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create">Create Minutes</TabsTrigger>
          <TabsTrigger value="manage">Manage Minutes</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Meeting Minutes</CardTitle>
              <CardDescription>Create minutes for a meeting that doesn't have minutes yet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meeting">Select Meeting</Label>
                <Select value={selectedMeeting} onValueChange={setSelectedMeeting} disabled={isLoading}>
                  <SelectTrigger id="meeting">
                    <SelectValue placeholder="Select a meeting" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetings.map((meeting) => (
                      <SelectItem key={meeting._id} value={meeting._id}>
                        {meeting.title} - {new Date(meeting.date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Minutes Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for these minutes"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Minutes Content</Label>
                <Editor content={content} onChange={setContent} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateMinutes} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Create Minutes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Meeting Minutes</CardTitle>
              <CardDescription>Update the selected meeting minutes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Minutes Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for these minutes"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Minutes Content</Label>
                <Editor content={content} onChange={setContent} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("manage")} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMinutes} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Update Minutes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Meeting Minutes</CardTitle>
              <CardDescription>View, edit, or delete existing meeting minutes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : meetingMinutes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No meeting minutes found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {meetingMinutes.map((minutes) => (
                    <Card key={minutes._id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle>{minutes.title}</CardTitle>
                        <CardDescription>Meeting: {getMeetingTitle(minutes.meetingId)}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-muted-foreground">
                          <p>Created: {formatDate(minutes.createdAt)}</p>
                          <p>Last Updated: {formatDate(minutes.updatedAt)}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="outline" onClick={() => handleEditMinutes(minutes)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteMinutes(minutes._id)}
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
