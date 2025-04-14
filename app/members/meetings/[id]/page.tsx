"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/meetings/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch meeting details")
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
        <Button className="mt-4" onClick={() => router.push("/members/meetings")}>
          Return to Meetings
        </Button>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Meeting Not Found</h1>
        <Button className="mt-4" onClick={() => router.push("/members/meetings")}>
          Return to Meetings
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 mt-20">
      <Button variant="outline" onClick={() => router.push("/members/meetings")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Meetings
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-green-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{meeting.title}</CardTitle>
            {meeting.meantFor.includes("public") ? (
              <Badge variant="outline" className="bg-green-100">
                Public
              </Badge>
            ) : meeting.meantFor.includes("members") ? (
              <Badge variant="outline" className="bg-blue-100">
                All Members
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-100">
                Excos Only
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{meeting.description}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center text-gray-700 mb-3">
              <Calendar className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <p className="font-medium">Date and Time</p>
                <p>{formatDate(meeting.date)}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <p className="font-medium">Location</p>
                <p>{meeting.location}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Add to Calendar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
