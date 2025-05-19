"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import dayjs from "dayjs"

interface Event {
  _id: string
  title: string
  description: string
  image: string
  date: string
  location: string
  featured: boolean
  createdAt: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/events")

        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        console.log(data)
        // Filter for featured events, sort by date (newest first), and take the first 3
        const featuredEvents = data
          .filter((event: Event) => event.featured)
          .sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
        setEvents(featuredEvents)
        console.log(featuredEvents)
        console.log(events)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])
  console.log(events)

  return (
    <section id="events" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            UPCOMING <span className="text-[red] font-medium">EVENTS</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-[red] mx-auto mb-6"
          />
          <p className="text-gray-600 max-w-3xl mx-auto">
            Join us at our upcoming events and be part of our mission to make a difference in our communities.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-[#C8A97E] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No featured events available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 overflow-hidden shadow-lg h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg?height=400&width=600"}
                      alt={event.title}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 flex-grow">
                    <h3 className="text-xl font-medium mb-3">{event.title}</h3>
                    <div
                      className="text-gray-600 text-sm mb-4 line-clamp-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-[#f33a3a] mr-2" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#f33a3a] mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-[#f33a3a] mr-2" />
                        <span>{dayjs(event.date).format('HH mm A')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/events">
            <Button className=" text-white hover:bg-[#C8A97E] hover:text-black transition-colors duration-300 rounded-none px-8 py-6 uppercase">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
