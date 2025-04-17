"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Calendar } from "lucide-react"
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

export default function ViewMeetingMinutesPage({ params }: { params: { id: string } }) {
  const [minutes, setMinutes] = useState<MeetingMinutes | null>(null)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meeting minutes
        const minutesResponse = await fetch(`/api/meeting-minutes/${params.id}`)
        if (!minutesResponse.ok) {
          throw new Error("Failed to fetch meeting minutes")
        }
        const minutesData = await minutesResponse.json()
        setMinutes(minutesData)

        // Fetch meeting details
        const meetingResponse = await fetch(`/api/meetings/${minutesData.meetingId}`)
        if (meetingResponse.ok) {
          const meetingData = await meetingResponse.json()
          setMeeting(meetingData)
        }
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
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <span className="ml-2 text-xl">Loading meeting minutes...</span>
      </div>
    )
  }

  if (!minutes) {
    return (
      <div className="container mx-auto py-10 mt-20">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-500">Meeting minutes not found</h1>
          <Button className="mt-4" onClick={() => router.push("/members/meeting-minutes")}>
            Return to Meeting Minutes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 mt-20">
      <div className="flex items-center mb-8">
        <Link href="/members/meeting-minutes">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meeting Minutes
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{minutes.title}</CardTitle>
            {meeting && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{format(new Date(meeting.date), "PPP")}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: minutes.content }} />
          <div className="mt-8 text-sm text-muted-foreground">
            Last updated: {format(new Date(minutes.updatedAt), "PPP 'at' p")}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
