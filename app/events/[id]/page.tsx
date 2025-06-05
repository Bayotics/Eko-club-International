"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { format, parseISO, isSameDay } from "date-fns"
import { Calendar, MapPin, Clock, ArrowLeft, Share2, CalendarIcon, Users, Tag, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"

// Define Event type
interface Event {
  _id: string
  title: string
  description: string
  image: string
  date: string
  endDate?: string
  location: string
  time: string
  category: string
  featured: boolean
  capacity?: number
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  registrationRequired?: boolean
  registrationUrl?: string
  registrationDeadline?: string
  price?: string
  virtualEvent?: boolean
  virtualEventUrl?: string
  tags?: string[]
  registrationLink?: string
}

const relatedEvents = []

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/events/${eventId}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Event not found")
          }
          throw new Error(`Failed to fetch event: ${response.status}`)
        }

        const data = await response.json()
        setEvent(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError(err instanceof Error ? err.message : "Failed to load event. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  // Fetch related events
  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        setLoadingRelated(true)
        const response = await fetch("/api/events")

        if (response.ok) {
          const data = await response.json()
          // Filter out current event and only show upcoming events
          const currentDate = new Date()
          const filteredEvents = data.events
            .filter((e: Event) => e._id !== eventId && new Date(e.date) > currentDate)
            .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3) // Limit to 3 events

          setRelatedEvents(filteredEvents)
        }
      } catch (error) {
        console.error("Error fetching related events:", error)
        setRelatedEvents([])
      } finally {
        setLoadingRelated(false)
      }
    }

    if (eventId && !loading) {
      fetchRelatedEvents()
    }
  }, [eventId, loading])

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!registrationForm.name || !registrationForm.email) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsRegistering(true)

    try {
      // In a real app, you would submit this to your API
      // const response = await fetch("/api/event-registration", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ eventId, ...registrationForm }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Registration successful! You will receive a confirmation email shortly.")
      setRegistrationForm({ name: "", email: "", phone: "" })
    } catch (err) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || "Eko Club Event",
          text: `Check out this event: ${event?.title}`,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "MMMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Loading...</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg mb-6" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />

            <div className="space-y-4 mb-8">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Error</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/events")} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Events
        </Button>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>Event not found</AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/events")} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Events
        </Button>
      </div>
    )
  }

  return (
    <main className="pt-20 overflow-hidden">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] py-5">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/events">Events</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-[#2cc72c] font-medium truncate max-w-[200px]">
                  {event.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Button
              variant="ghost"
              className="mb-6 flex items-center gap-2 hover:bg-gray-100"
              onClick={() => router.push("/events")}
            >
              <ArrowLeft size={16} />
              Back to Events
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
                <Image
                  src={event.image || "/placeholder.svg?height=800&width=1200"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                {event.featured && (
                  <div className="absolute top-4 right-4 bg-[#2cc72c] text-white px-4 py-1 rounded-full font-medium text-sm">
                    Featured
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleShare}>
                  <Share2 size={16} />
                  Share
                </Button>
              </div>

              <Badge className="bg-[#2cc72c] mb-6">{event.category}</Badge>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-[#2cc72c]/10 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-[#2cc72c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {formatEventDate(event.date)}
                      {event.endDate && !isSameDay(parseISO(event.date), parseISO(event.endDate)) && (
                        <> - {formatEventDate(event.endDate)}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-[#2cc72c]/10 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-[#2cc72c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-[#2cc72c]/10 p-2 rounded-full">
                    <MapPin className="h-6 w-6 text-[#2cc72c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              </div>

              {event.capacity && (
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <Users size={18} />
                  <span>Capacity: {event.capacity} attendees</span>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <Tag size={18} className="text-gray-600" />
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
              </div>

              {event.organizer && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Organizer</h2>
                  <p className="text-gray-700">{event.organizer}</p>
                  {(event.contactEmail || event.contactPhone) && (
                    <div className="mt-2 text-gray-600">
                      <p>
                        Contact: {event.contactEmail} {event.contactPhone && `| ${event.contactPhone}`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {event.virtualEvent && event.virtualEventUrl && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2">Virtual Event Information</h3>
                  <p className="mb-2">This event will be held online.</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">Join Virtual Event</Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8 overflow-hidden border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Event Details</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="h-5 w-5 text-[#2cc72c] mt-0.5" />
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p className="text-gray-600">
                          {formatEventDate(event.date)}
                          {event.endDate && !isSameDay(parseISO(event.date), parseISO(event.endDate)) && (
                            <> - {formatEventDate(event.endDate)}</>
                          )}
                        </p>
                        <p className="text-gray-600">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#2cc72c] mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-600">{event.location}</p>
                      </div>
                    </div>

                    {event.registrationLink && (
                      <div className="flex items-start gap-3">
                        <LinkIcon className="h-5 w-5 text-[#2cc72c] mt-0.5" />
                        <div>
                          <p className="font-medium">Registration link</p>
                          <Link href={event.registrationLink} target="_blank">
                            <p className="text-gray-600">{event.registrationLink}</p>
                          </Link>
                        </div>
                      </div>
                    )}
                    {event.price && (
                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-[#2cc72c] mt-0.5" />
                        <div>
                          <p className="font-medium">Price</p>
                          <p className="text-gray-600">{event.price}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Related Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-semibold mb-6">Similar Events You May Like</h2>
          {loadingRelated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-3" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : relatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <Card
                  key={relatedEvent._id}
                  className="overflow-hidden border-0 shadow-md cursor-pointer transition-transform hover:-translate-y-1"
                  onClick={() => router.push(`/events/${relatedEvent._id}`)}
                >
                  <div className="relative h-48">
                    <Image
                      src={relatedEvent.image || "/placeholder.svg?height=400&width=600"}
                      alt={relatedEvent.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-[#2cc72c]">{relatedEvent.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 line-clamp-1">{relatedEvent.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {relatedEvent.description.length > 50
                        ? `${relatedEvent.description.substring(0, 50)}...`
                        : relatedEvent.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatEventDate(relatedEvent.date)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
                <p className="text-gray-600">
                  There are currently no other upcoming events available. Check back soon for new events!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
