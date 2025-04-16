"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface Meeting {
  _id: string
  title: string
  description: string
  date: string
  location: string
  meantFor: string[]
}

export default function UpcomingMeetingsAnnouncements() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData = await response.json()
        setUserRole(userData.role)
        return userData.role
      } catch (err: any) {
        console.error("Error fetching user role:", err)
        return null
      }
    }

    const fetchMeetings = async () => {
      try {
        setLoading(true)

        // First get the user role
        const role = await fetchUserRole()
        console.log(role)
        // Then fetch meetings
        const response = await fetch("/api/meetings")
        console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch meetings")
        }
        let data = await response.json()
        console.log(data)
        const adminResponse = await fetch("/api/admin/meetings");
        let adminData = await adminResponse.json();
        console.log(adminData)

        // Filter meetings based on user role
        if (role !== "admin") {
            console.log("user not Admin")
            console.log(data)
            data = data.filter((meeting: Meeting) => meeting.meantFor.includes("members"))
            console.log(data)
          }
          console.log(data)
          // Sort by date (most recent first) and take only the first 3
          data.sort((a: Meeting, b: Meeting) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setMeetings(data.slice(0, 3))
        if (role === "admin"){
            data = adminData
            data.sort((a: Meeting, b: Meeting) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setMeetings(data.slice(0, 3))
        }
       
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "Error",
          description: "Failed to load upcoming meetings",
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
    })
  }
// 
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#C8A97E]" />
        <span className="ml-2">Loading announcements...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Unable to load announcements</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming meetings to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting._id} className="border-l-4 border-[#C8A97E] pl-4 py-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#C8A97E]" />
            <h4 className="font-medium">{meeting.title}</h4>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{meeting.description}</p>
          <p className="text-xs text-gray-500 mt-1">Date: {formatDate(meeting.date)}</p>
          <p className="text-xs text-gray-500">Location: {meeting.location}</p>
          {userRole === "admin" && !meeting.meantFor.includes("members") && (
            <p className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded mt-1 inline-block">
              {meeting.meantFor.join(", ")} only
            </p>
          )}
        </div>
      ))}

      <div className="pt-2">
        <Button
          variant="outline"
          className="w-full text-[#C8A97E] hover:bg-[#C8A97E]/10"
          onClick={() => router.push("/members/meetings")}
        >
          View All Meetings
        </Button>
      </div>
    </div>
  )
}
