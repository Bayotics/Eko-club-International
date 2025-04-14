"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Meeting {
  _id: string
  title: string
  description: string
  date: string
  location: string
  meantFor: string[]
}

export default function MeetingDetailsPage({ params }: { params: { id: string } }) {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/admin/meetings/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch meeting")
        }
        const data = await response.json()
        setMeeting(data)
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

    fetchMeeting()
  }, [params.id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (!meeting) return
    setMeeting({ ...meeting, [name]: value })
  }

  const handleMeantForChange = (value: string, checked: boolean) => {
    if (!meeting) return
    setMeeting({
      ...meeting,
      meantFor: checked ? [...meeting.meantFor, value] : meeting.meantFor.filter((item) => item !== value),
    })
  }

  const handleUpdateMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meeting) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/meetings/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meeting),
      })

      if (!response.ok) {
        throw new Error("Failed to update meeting")
      }

      toast({
        title: "Success",
        description: "Meeting updated successfully",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMeeting = async () => {
    try {
      const response = await fetch(`/api/admin/meetings/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete meeting")
      }

      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      })
      router.push("/admin/meetings")
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
        <span className="ml-2 text-xl">Loading meeting details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <Button className="mt-4" onClick={() => router.push("/admin/meetings")}>
          Return to Meetings
        </Button>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Meeting Not Found</h1>
        <Button className="mt-4" onClick={() => router.push("/admin/meetings")}>
          Return to Meetings
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 mt-20">
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => router.push("/admin/meetings")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Meetings
        </Button>
        <h1 className="text-3xl font-bold">Edit Meeting</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleUpdateMeeting} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={meeting.title} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={meeting.description}
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
                value={meeting.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={meeting.location} onChange={handleInputChange} required />
            </div>
            <div>
              <Label>Meant For</Label>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excos"
                    checked={meeting.meantFor.includes("excos")}
                    onCheckedChange={(checked) => handleMeantForChange("excos", checked === true)}
                  />
                  <Label htmlFor="excos" className="cursor-pointer">
                    Excos Only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="members"
                    checked={meeting.meantFor.includes("members")}
                    onCheckedChange={(checked) => handleMeantForChange("members", checked === true)}
                  />
                  <Label htmlFor="members" className="cursor-pointer">
                    All Members
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="public"
                    checked={meeting.meantFor.includes("public")}
                    onCheckedChange={(checked) => handleMeantForChange("public", checked === true)}
                  />
                  <Label htmlFor="public" className="cursor-pointer">
                    Public
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button type="button" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Meeting
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMeeting} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
