"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { format, isBefore, isAfter, parseISO, isSameMonth } from "date-fns"
import { CalendarIcon, MapPin, Clock, ChevronRight, ChevronLeft, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define Event type
interface Event {
  _id: string
  title: string
  description: string
  image: string
  date: string
  location: string
  time: string
  category: string
  featured: boolean
  registrationLink: string
}

// Define News type
interface News {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  featured: boolean
}

// Sample data for news (keep this until you have a news API)
const newsArticles = [
  {
    id: 1,
    title: "Eko Club International Completes Successful Medical Mission",
    excerpt:
      "Over 2,000 patients received free medical care during our recent mission to Lagos. Learn about the impact and outcomes.",
    image: "/placeholder.svg?height=400&width=600",
    date: "June 15, 2024",
    category: "Medical",
    featured: true,
  },
  {
    id: 2,
    title: "New Scholarship Program Launches for Diaspora Students",
    excerpt:
      "Eko Club International announces a new scholarship program aimed at supporting students of Nigerian descent in pursuing higher education.",
    image: "/placeholder.svg?height=400&width=600",
    date: "May 28, 2024",
    category: "Education",
    featured: true,
  },
  {
    id: 3,
    title: "Annual Gala Raises Record Funds for Community Projects",
    excerpt:
      "This year's gala event raised over $250,000 to support various community development initiatives in Lagos.",
    image: "/placeholder.svg?height=400&width=600",
    date: "April 10, 2024",
    category: "Fundraising",
    featured: false,
  },
  {
    id: 4,
    title: "Eko Club International Expands to Three New Chapters",
    excerpt:
      "We're excited to announce the establishment of three new chapters in Canada, Australia, and the United Kingdom.",
    image: "/placeholder.svg?height=400&width=600",
    date: "March 22, 2024",
    category: "Organization",
    featured: false,
  },
]

// Sample data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Dr. Adebayo Johnson",
    role: "Medical Mission Volunteer",
    quote:
      "Participating in the Eko Club medical mission was one of the most rewarding experiences of my career. The impact we made on the community was immeasurable.",
    image: "/images/portrait.png?height=100&width=100",
  },
  {
    id: 2,
    name: "Sarah Ogunlesi",
    role: "Scholarship Recipient",
    quote:
      "The scholarship from Eko Club International changed my life. I was able to complete my education and now I'm giving back to my community as a teacher.",
    image: "/images/portrait.png?height=100&width=100",
  },
  {
    id: 3,
    name: "Chief Michael Adeniyi",
    role: "Gala Attendee",
    quote:
      "The annual gala is always a highlight of my year. It's a wonderful opportunity to connect with fellow Lagosians and support important causes.",
    image: "/images/portrait.png?height=100&width=100",
  },
]

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const heroRef = useRef(null)
  const featuredRef = useRef(null)
  const newsRef = useRef(null)
  const calendarRef = useRef(null)
  const pastEventsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.3 })
  const newsInView = useInView(newsRef, { once: true, amount: 0.3 })
  const calendarInView = useInView(calendarRef, { once: true, amount: 0.3 })
  const pastEventsInView = useInView(pastEventsRef, { once: true, amount: 0.3 })
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error state
    setError(null)

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      toast.error("Please enter a valid email address")
      return
    }

    // Set loading state
    setIsLoading(true)

    try {
      // Submit to API
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      // Show success message
      toast.success(data.message || "Thank you for subscribing to our newsletter!")

      // Reset form
      setEmail("")
    } catch (error) {
      // Show error message
      const errorMessage = error instanceof Error ? error.message : "Failed to subscribe. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      // Reset loading state
      setIsLoading(false)
    }
  }

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/events")

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Extract unique categories from events
  const eventCategories = ["All", ...Array.from(new Set(events.map((event) => event.category)))]

  // Filter upcoming events (events with dates in the future)
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return isAfter(eventDate, new Date()) || isSameMonth(eventDate, new Date())
  })

  // Filter past events (events with dates in the past)
  const pastEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return isBefore(eventDate, new Date()) && !isSameMonth(eventDate, new Date())
  })

  // Filter events based on search and category
  const filteredUpcomingEvents = upcomingEvents.filter((event) => {
    if (activeCategory !== "All" && event.category !== activeCategory) return false
    if (
      searchQuery &&
      !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  const filteredNews = newsArticles.filter((article) => {
    if (activeCategory !== "All" && article.category !== activeCategory) return false
    if (
      searchQuery &&
      !article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  const filteredPastEvents = pastEvents.filter((event) => {
    if (activeCategory !== "All" && event.category !== activeCategory) return false
    if (
      searchQuery &&
      !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  // Create calendar events from real events data
  const calendarEvents = events.map((event) => ({
    date: parseISO(event.date),
    title: event.title,
    category: event.category,
  }))

  const monthEventsMap = calendarEvents.reduce(
    (acc, event) => {
      const monthYear = `${event.date.getMonth()}-${event.date.getFullYear()}`
      if (!acc[monthYear]) acc[monthYear] = []
      acc[monthYear].push(event)
      return acc
    },
    {} as Record<string, typeof calendarEvents>,
  )

  const currentMonthYear = `${currentMonth.getMonth()}-${currentMonth.getFullYear()}`
  const currentMonthEvents = monthEventsMap[currentMonthYear] || []

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const calendarPadding = Array.from({ length: firstDayOfMonth }, (_, i) => null)
  const calendarGrid = [...calendarPadding, ...calendarDays]

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getEventForDay = (day: number | null) => {
    if (!day) return null
    return currentMonthEvents.find((event) => event.date.getDate() === day)
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

  return (
    <main className="pt-20 overflow-hidden mt-4">
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
                <BreadcrumbLink href="/events" className="text-[#2cc72c] font-medium">
                  News & Events
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16 md:py-24 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/events-bg.jpg?height=1080&width=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
          animate={{ scale: heroInView ? 1.05 : 1 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-3xl mx-auto text-center" style={{ scale: heroScale }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                NEWS & <span className="text-[#2cc72c] font-medium">EVENTS</span>
              </h1>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={heroInView ? { opacity: 1, width: "120px" } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-0.5 bg-[#2cc72c] mx-auto mb-8"
              />
            </motion.div>

            <motion.p
              className="text-lg md:text-xl mb-8 text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Stay updated with the latest news and upcoming events from Eko Club International. Join us in our mission
              to make a positive impact in our communities.
            </motion.p>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-[#2cc72c] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none px-8 py-6">
                Upcoming Events
              </Button>
              <Button className="bg-transparent border-2 border-white hover:bg-white hover:text-[#16213e] text-white transition-colors duration-300 rounded-none px-8 py-6">
                Latest News
              </Button>
            </motion.div> */}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search events and news..."
                className="pl-10 rounded-full border-gray-300 focus:border-[#2cc72c] focus:ring-[#2cc72c]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
              {eventCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                >
                  <Badge
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      activeCategory === category
                        ? "bg-[#2cc72c] hover:bg-[#8A6D3B] text-white"
                        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section ref={featuredRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              UPCOMING <span className="text-[#2cc72c] font-medium">EVENTS</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={featuredInView ? { opacity: 1, width: "80px" } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-[#2cc72c] mx-auto mb-6"
            />
            <p className="text-gray-600 max-w-3xl mx-auto">
              Join us at our upcoming events and be part of our mission to make a difference in our communities.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#2cc72c]" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredUpcomingEvents.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={featuredInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUpcomingEvents.map((event, index) => (
                <div key={event._id}>
                  <Card className="border-0 overflow-hidden shadow-lg h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      {event.featured && (
                        <div className="absolute top-0 right-0 bg-[#2cc72c] text-white px-4 py-1 z-10 font-medium text-sm">
                          Featured
                        </div>
                      )}
                      <Image
                        src={event.image || "/placeholder.svg?height=400&width=600"}
                        alt={event.title}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-6">
                          <Badge className="bg-[#2cc72c] text-white mb-2">{event.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-grow">
                      <h3 className="text-xl font-medium mb-3">{event.title}</h3>
                      <div
                        className="text-gray-600 text-sm mb-4 line-clamp-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-[#2cc72c] mr-2" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-[#2cc72c] mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-[#2cc72c] mr-2" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        className="w-full bg-[#2cc72c] hover:bg-[#1a6e1a] text-white transition-colors duration-300 rounded-none uppercase"
                        onClick={() => (window.location.href = `/events/${event._id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Section */}
      <section ref={newsRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={newsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              LATEST <span className="text-[#2cc72c] font-medium">NEWS</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={newsInView ? { opacity: 1, width: "80px" } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-[#2cc72c] mx-auto mb-6"
            />
            <p className="text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news and announcements from Eko Club International.
            </p>
          </motion.div>
          <h1 className="text-center font-semibold text-3xl">Coming Soon...</h1>
          {/* {filteredNews.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={newsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-gray-500 text-lg">No news articles found matching your criteria.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredNews.slice(0, 2).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  animate={newsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white shadow-lg overflow-hidden"
                >
                  <div className="md:flex h-full">
                    <div className="md:w-2/5 relative">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      {article.featured && (
                        <div className="absolute top-0 left-0 bg-[#2cc72c] text-white px-4 py-1 z-10 font-medium text-sm">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="md:w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <Badge className="bg-[#2cc72c] text-white mb-3">{article.category}</Badge>
                        <h3 className="text-xl font-medium mb-3">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 inline mr-2" />
                          {article.date}
                        </div>
                        <Button className="bg-transparent hover:bg-[#2cc72c] text-[#2cc72c] hover:text-white border border-[#2cc72c] transition-colors duration-300 rounded-none">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredNews.length > 2 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {filteredNews.slice(2).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={newsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="border-0 overflow-hidden shadow-lg h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4">
                          <Badge className="bg-[#2cc72c] text-white mb-2">{article.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5 flex-grow">
                      <h3 className="text-lg font-medium mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        {article.date}
                      </span>
                      <Button variant="link" className="text-[#2cc72c] p-0 hover:text-[#8A6D3B]">
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )} */}
        </div>
      </section>

      {/* Calendar Section */}
      <section ref={calendarRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={calendarInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              EVENTS <span className="text-[#2cc72c] font-medium">CALENDAR</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={calendarInView ? { opacity: 1, width: "80px" } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-[#2cc72c] mx-auto mb-6"
            />
            <p className="text-gray-600 max-w-3xl mx-auto">
              Plan ahead with our events calendar and never miss an important date.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#2cc72c]" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <motion.div
              className="bg-gray-50 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={calendarInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" size="sm" onClick={prevMonth} className="text-gray-600 hover:text-[#2cc72c]">
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <h3 className="text-xl font-medium">{format(currentMonth, "MMMM yyyy")}</h3>

                <Button variant="ghost" size="sm" onClick={nextMonth} className="text-gray-600 hover:text-[#2cc72c]">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarGrid.map((day, index) => {
                  const event = getEventForDay(day)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={calendarInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.01 }}
                      className={`
                        h-24 sm:h-28 p-1 border ${day ? "border-gray-200" : "border-transparent"} 
                        ${event ? "bg-[#2cc72c]/10" : day ? "bg-white" : "bg-transparent"}
                        ${event ? "hover:bg-[#2cc72c]/20" : day ? "hover:bg-gray-100" : ""}
                        transition-colors duration-200
                      `}
                    >
                      {day && (
                        <div className="h-full flex flex-col">
                          <div
                            className={`text-right text-sm ${
                              new Date().getDate() === day &&
                              new Date().getMonth() === currentMonth.getMonth() &&
                              new Date().getFullYear() === currentMonth.getFullYear()
                                ? "bg-[#2cc72c] text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                                : ""
                            }`}
                          >
                            {day}
                          </div>
                          {event && (
                            <div className="mt-1 text-xs bg-[#2cc72c] text-white p-1 rounded truncate">
                              {event.title}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          <motion.div
            className="mt-8 bg-gray-100 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={calendarInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h4 className="text-lg font-medium mb-4">Upcoming in {format(currentMonth, "MMMM")}</h4>
            {currentMonthEvents.length === 0 ? (
              <p className="text-gray-500">No events scheduled for this month.</p>
            ) : (
              <ul className="space-y-3">
                {currentMonthEvents.map((event, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={calendarInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-[#2cc72c] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      {format(event.date, "d")}
                    </div>
                    <div>
                      <h5 className="font-medium">{event.title}</h5>
                      <p className="text-sm text-gray-600">{format(event.date, "EEEE, MMMM d, yyyy")}</p>
                    </div>
                    <Badge className="ml-auto">{event.category}</Badge>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </section>

      {/* Past Events Section */}
      <section ref={pastEventsRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={pastEventsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              PAST <span className="text-[#2cc72c] font-medium">EVENTS</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={pastEventsInView ? { opacity: 1, width: "80px" } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-[#2cc72c] mx-auto mb-6"
            />
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore our past events and the impact we've made in our communities.
            </p>
          </motion.div>

          <Tabs defaultValue="gallery" className="w-full">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={pastEventsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TabsList className="bg-gray-200">
                <TabsTrigger
                  value="gallery"
                  className="data-[state=active]:bg-[#2cc72c] data-[state=active]:text-white"
                >
                  Gallery View
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-[#2cc72c] data-[state=active]:text-white">
                  List View
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="gallery">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2cc72c]" />
                </div>
              ) : error ? (
                <Alert variant="destructive" className="max-w-md mx-auto">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : filteredPastEvents.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={pastEventsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="text-gray-500 text-lg">No past events found matching your criteria.</p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredPastEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={pastEventsInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transition: { duration: 0.2 },
                      }}
                      className="bg-white overflow-hidden rounded-lg"
                    >
                      <div className="relative">
                        <Image
                          src={event.image || "/placeholder.svg?height=400&width=600"}
                          alt={event.title}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                            View Gallery
                          </Button>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-[#2cc72c]">{event.category}</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <CalendarIcon className="h-4 w-4 mr-2 text-[#2cc72c]" />
                          {formatEventDate(event.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-[#2cc72c]" />
                          {event.location}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2cc72c]" />
                </div>
              ) : error ? (
                <Alert variant="destructive" className="max-w-md mx-auto">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : filteredPastEvents.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={pastEventsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="text-gray-500 text-lg">No past events found matching your criteria.</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filteredPastEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={pastEventsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center"
                    >
                      <div className="md:w-1/6">
                        <Image
                          src={event.image || "/placeholder.svg?height=400&width=600"}
                          alt={event.title}
                          width={200}
                          height={200}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                      <div className="md:w-3/6">
                        <Badge className="mb-2 bg-[#2cc72c]">{event.category}</Badge>
                        <h3 className="font-medium mb-1">{event.title}</h3>
                        <div
                          className="text-gray-600 text-sm mb-4 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                      </div>
                      <div className="md:w-1/6 text-sm text-gray-600">
                        <div className="flex items-center mb-2">
                          <CalendarIcon className="h-4 w-4 mr-2 text-[#2cc72c]" />
                          {formatEventDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-[#2cc72c]" />
                          {event.location}
                        </div>
                      </div>
                      <div className="md:w-1/6 flex justify-end">
                        <Button className="bg-transparent hover:bg-[#2cc72c] text-[#2cc72c] hover:text-white border border-[#2cc72c] transition-colors duration-300 rounded-none">
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-16 bg-[#1a1a2e] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              EVENT <span className="text-[#2cc72c] font-medium">TESTIMONIALS</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={testimonialsInView ? { opacity: 1, width: "80px" } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-[#2cc72c] mx-auto mb-6"
            />
            <p className="text-gray-300 max-w-3xl mx-auto">
              Hear from those who have attended our events and experienced the impact firsthand.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-[#16213e] p-6 rounded-lg relative"
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#2cc72c] rounded-full p-1">
                  <div className="bg-white rounded-full p-0.5">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={100}
                      height={100}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="pt-12 text-center">
                  <p className="italic text-gray-300 mb-4">"{testimonial.quote}"</p>
                  <h4 className="font-medium text-[#2cc72c]">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section ref={ctaRef} className="py-16 bg-gradient-to-r from-[#2cc72c]/20 to-[#8A6D3B]/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              STAY <span className="text-[#2cc72c] font-medium">CONNECTED</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter to receive updates on upcoming events, news, and opportunities to get
              involved.
            </p>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
            >
              <div className="flex-grow relative rounded-full overflow-hidden border-2 border-green-300 focus-within:border-white/50">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-transparent border-none text-black placeholder:text-gray-400 h-14 px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>
              <Button
                type="submit"
                className="h-14 px-8 rounded-full bg-[#2cc72c] hover:bg-[#1a6e1a] text-black font-medium text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </motion.form>

            {error && (
              <p id="email-error" className="mt-2 text-red-400 text-sm">
                {error}
              </p>
            )}
            {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Button className="bg-[#2cc72c] hover:bg-[#8add8a] text-white transition-colors duration-300 rounded-none px-6">
                  Upcoming Events
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Button className="bg-[#16213e] hover:bg-[#1a1a2e] text-white transition-colors duration-300 rounded-none px-6">
                  Volunteer
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Button className="bg-transparent border-2 border-[#2cc72c] text-[#2cc72c] hover:bg-[#2cc72c] hover:text-white transition-colors duration-300 rounded-none px-6">
                  Contact Us
                </Button>
              </motion.div>
            </div> */}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
