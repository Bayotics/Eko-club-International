"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface Meeting {
  _id: string
  title: string
  description: string
  date: string
  location: string
  meantFor: string[]
}

export default function ManageMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    meantFor: [] as string[],
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch("/api/admin/meetings")
        if (!response.ok) {
          throw new Error("Failed to fetch meetings")
        }
        const data = await response.json()
        setMeetings(data)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMeeting((prev) => ({ ...prev, [name]: value }))
  }

  const handleMeantForChange = (value: string, checked: boolean) => {
    setNewMeeting((prev) => {
      if (checked) {
        return { ...prev, meantFor: [...prev.meantFor, value] }
      } else {
        return { ...prev, meantFor: prev.meantFor.filter((item) => item !== value) }
      }
    })
  }

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMeeting),
      })

      if (!response.ok) {
        throw new Error("Failed to create meeting")
      }

      const data = await response.json()
      setMeetings([...meetings, data])
      setNewMeeting({
        title: "",
        description: "",
        date: "",
        location: "",
        meantFor: [],
      })
      setShowNewMeetingForm(false)
      toast({
        title: "Success",
        description: "Meeting created successfully",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <span className="ml-2 text-xl">Loading meetings...</span>
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
      <h1 className="mb-8 text-3xl font-bold mt-10">Manage Upcoming Meetings</h1>

      <div className="rounded-md border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-4 font-medium text-left">Title</th>
              <th className="p-4 font-medium text-left">Date</th>
              <th className="p-4 font-medium text-left">Location</th>
              <th className="p-4 font-medium text-left">Meant For</th>
            </tr>
          </thead>
          <tbody>
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <tr
                  key={meeting._id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4">
                    <Link href={`/admin/meetings/${meeting._id}`} className="hover:underline">
                      {meeting.title}
                    </Link>
                  </td>
                  <td className="p-4">{new Date(meeting.date).toLocaleDateString()}</td>
                  <td className="p-4">{meeting.location}</td>
                  <td className="p-4">{meeting.meantFor.join(", ")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No upcoming meetings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Button onClick={() => setShowNewMeetingForm(!showNewMeetingForm)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        {showNewMeetingForm ? "Cancel" : "Add New Meeting"}
      </Button>

      {showNewMeetingForm && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Create New Meeting</h2>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={newMeeting.title} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newMeeting.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={newMeeting.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newMeeting.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>Meant For</Label>
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excos"
                        checked={newMeeting.meantFor.includes("excos")}
                        onCheckedChange={(checked) => handleMeantForChange("excos", checked === true)}
                      />
                      <Label htmlFor="excos" className="cursor-pointer">
                        Excos Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="members"
                        checked={newMeeting.meantFor.includes("members")}
                        onCheckedChange={(checked) => handleMeantForChange("members", checked === true)}
                      />
                      <Label htmlFor="members" className="cursor-pointer">
                        All Members
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="public"
                        checked={newMeeting.meantFor.includes("public")}
                        onCheckedChange={(checked) => handleMeantForChange("public", checked === true)}
                      />
                      <Label htmlFor="public" className="cursor-pointer">
                        Public
                      </Label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  Create Meeting
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
