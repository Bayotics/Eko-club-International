"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function MembersUpcomingMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch("/api/meetings")
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
      <h1 className="mb-8 text-3xl font-bold mt-10">Upcoming Meetings</h1>

      {meetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <Card key={meeting._id} className="overflow-hidden">
              <CardHeader className="bg-green-50">
                <CardTitle>{meeting.title}</CardTitle>
                <CardDescription>
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
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">{meeting.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{meeting.location}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/members/meetings/${meeting._id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No upcoming meetings</h2>
          <p className="text-gray-500">Check back later for new meetings</p>
        </div>
      )}
    </div>
  )
}
