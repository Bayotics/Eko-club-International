"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { format } from "date-fns"

interface Meeting {
  _id: string
  title: string
  date: string
}

interface MeetingMinutes {
  _id: string
  meetingId: string
  content: string
  title: string
  createdAt: string
  updatedAt: string
}

export default function MemberMeetingMinutesPage() {
  const [meetingMinutes, setMeetingMinutes] = useState<MeetingMinutes[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meeting minutes
        const minutesResponse = await fetch("/api/meeting-minutes")
        if (!minutesResponse.ok) {
          throw new Error("Failed to fetch meeting minutes")
        }
        const minutesData = await minutesResponse.json()
        setMeetingMinutes(minutesData)

        // Fetch meetings to get titles
        const meetingsResponse = await fetch("/api/meetings")
        if (!meetingsResponse.ok) {
          throw new Error("Failed to fetch meetings")
        }
        const meetingsData = await meetingsResponse.json()
        setMeetings(meetingsData)
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <span className="ml-2 text-xl">Loading meeting minutes...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 mt-20">
      <div className="flex items-center mb-8">
        <Link href="/members/dashboard">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Meeting Minutes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Meeting Minutes</CardTitle>
        </CardHeader>
        <CardContent>
          {meetingMinutes.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="p-4 font-medium text-left">Title</th>
                    <th className="p-4 font-medium text-left">Meeting Date</th>
                    <th className="p-4 font-medium text-left">Last Updated</th>
                    <th className="p-4 font-medium text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {meetingMinutes.map((minutes) => {
                    const meeting = meetings.find((m) => m._id === minutes.meetingId)
                    return (
                      <tr
                        key={minutes._id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4">{minutes.title}</td>
                        <td className="p-4">{meeting ? format(new Date(meeting.date), "PPP") : "Unknown"}</td>
                        <td className="p-4">{format(new Date(minutes.updatedAt), "PPP")}</td>
                        <td className="p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/members/meeting-minutes/${minutes._id}`)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No meeting minutes available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
