"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  category: string
}

export default function UpcomingEventsAnnouncements() {
  const [events, setEvents] = useState<Event[]>([])
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

    const fetchEvents = async () => {
      try {
        setLoading(true)

        // First get the user role
        const role = await fetchUserRole()
        console.log(role)
        // Then fetch events
        const response = await fetch("/api/events")
        console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        let data = await response.json()
        console.log(data)
          // Sort by date (most recent first) and take only the first 3
          data.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setEvents(data)
          console.log(data)
          console.log(events)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "Error",
          description: "Failed to load upcoming events",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [toast])
  console.log(events)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#C8A97E]" />
        <span className="ml-2">Loading events...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Unable to load events</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming events to display</p>
      </div>
    )
  }
  console.log(formatDate(events.date))
  
  return (
    <div className="space-y-6">
        {events.map((event) => (
            <div className="flex flex-col md:flex-row gap-4 border-b pb-4">
            <div className="bg-[#C8A97E] text-white rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm">June</div>
            </div>
            <div>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {event.description}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{event.location}</span>
                <span className="mx-2">•</span>
                <span>6:00 PM</span>
              </div>
            </div>
          </div>

        ))}
        <div className="pt-2">
        <Button
          variant="outline"
          className="w-full text-[#C8A97E] hover:bg-[#C8A97E]/10"
          onClick={() => router.push("#")}
        >
          View All Events
        </Button>
      </div>
    </div>
  )
}
