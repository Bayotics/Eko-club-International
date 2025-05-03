"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  Play,
  X,
  Globe,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  ExternalLink,
  Heart,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DiasporaOutreachPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState({ title: "", description: "", url: "" })
  const videoRef = useRef(null)

  const openVideoModal = (video) => {
    setCurrentVideo(video)
    setVideoModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
    document.body.style.overflow = "auto"
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const videos = [
    {
      title: "Global Diaspora Network",
      description:
        "ECI Community Outreach at the Heritage at Turner Park Health and Rehab in Irving, TX (12/14/19)",
      thumbnail: "/images/diaspora_outreach/thumbnail1.png?height=600&width=800",
      url: "https://www.youtube.com/embed/bkp-oHW1laQ?si=1ky6FVKYfVySoHk1",
      location: "Texas",
      date: "Ongoing Initiative",
    },
    {
      title: "ECI 2022 National Community Outreach Day",
      description:
        "ECI 2022 National Community Outreach Day - Eko Club Minnesota",
      thumbnail: "/images/diaspora_outreach/thumbnail2.png?height=600&width=800",
      url: "https://www.youtube.com/embed/GuiN7s6iyfU?si=0f-1KzfXwoSbF4T9",
      location: "Lagos, London, New York",
      date: "Annual Program",
    },
  ]

  const globalLocations = [
    { name: "North America", members: 1200, events: 15, projects: 8 },
    { name: "Europe", members: 950, events: 12, projects: 6 },
    { name: "Africa", members: 2500, events: 25, projects: 12 },
  ]

  const initiatives = [
    {
      title: "Knowledge Transfer",
      description: "Facilitating knowledge and skill sharing between diaspora professionals and local communities",
      icon: "🧠",
    },
    {
      title: "Investment Network",
      description: "Creating channels for diaspora investment in local businesses and development projects",
      icon: "💰",
    },
    {
      title: "Cultural Preservation",
      description: "Supporting programs that help preserve and promote Nigerian cultural heritage abroad",
      icon: "🏛️",
    },
    {
      title: "Youth Connection",
      description: "Connecting young Nigerians in the diaspora with their roots through mentorship and exchange",
      icon: "👨‍👩‍👧‍👦",
    },
  ]

  const testimonials = [
    {
      quote:
        "The diaspora network has been instrumental in helping me maintain my connection to Nigeria while building a successful career abroad.",
      name: "Dr. Adebayo Johnson",
      location: "Toronto, Canada",
      image: "/images/portrait.png?height=100&width=100",
    },
    {
      quote:
        "Through the cultural exchange program, my children have developed a deep appreciation for their Nigerian heritage despite being born overseas.",
      name: "Mrs. Folake Williams",
      location: "London, UK",
      image: "/images/portrait.png?height=100&width=100",
    },
    {
      quote:
        "The investment network connected me with the right partners to launch my tech startup in Lagos while I remained based in San Francisco.",
      name: "Mr. Oluwaseun Adeyemi",
      location: "San Francisco, USA",
      image: "/images/portrait.png?height=100&width=100",
    },
  ]

  const upcomingEvents = [
    {
      title: "Global Diaspora Summit",
      date: "June 15-17, 2023",
      location: "London, UK",
      description: "Annual gathering of Nigerian diaspora leaders from around the world",
    },
    {
      title: "Cultural Heritage Festival",
      date: "August 22-24, 2023",
      location: "Toronto, Canada",
      description: "Celebration of Nigerian culture, food, music and arts",
    },
    {
      title: "Diaspora Investment Forum",
      date: "October 5-6, 2023",
      location: "Dubai, UAE",
      description: "Connecting diaspora investors with opportunities in Nigeria",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  const slideRight = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  const slideLeft = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  const pulse = {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
  }

  return (
    <div className="min-h-screen bg-white pt-20 mt-4">
      {/* Breadcrumb with proper spacing */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-[#bcbe3a] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/#projects" className="hover:text-[#bcbe3a] transition-colors">
              Our Projects
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-[#bcbe3a] font-medium">Diaspora Outreach</span>
          </div>
        </div>
      </div>

      {/* Hero Section with World Map Background */}
      <section className="relative overflow-hidden bg-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/map.png?height=1080&width=1920" alt="World Map" fill className="object-cover" />
        </div>

        {/* Connection Lines Animation */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="opacity-10">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
              <motion.div variants={slideRight}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-[#bcbe3a]">Connecting</span> Across Borders
                </h1>
              </motion.div>

              <motion.p variants={slideRight} className="text-lg md:text-xl opacity-90 max-w-lg">
                Building bridges between Nigerian communities worldwide through cultural exchange, knowledge sharing,
                and collaborative initiatives.
              </motion.p>

              <motion.div variants={slideRight} className="flex flex-wrap gap-4">
                <Button className="bg-[#bcbe3a] hover:bg-[#8A6D3B] text-white rounded-full px-8 py-6">
                  Get Involved
                </Button>
                {/* <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8 py-6"
                >
                  Learn More
                </Button> */}
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="relative">
              <motion.div
                animate={pulse}
                className="relative h-[300px] md:h-[400px] w-full rounded-full overflow-hidden border-4 border-[#bcbe3a]/30"
              >
                <Image
                  src="/images/diaspora_outreach/1.png?height=800&width=800"
                  alt="Global Community"
                  fill
                  className="object-cover rounded-full"
                />
              </motion.div>

              {/* Floating Connection Points */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-10 -left-5 bg-[#bcbe3a] text-white p-3 rounded-full shadow-lg"
              >
                <Globe className="h-6 w-6" />
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute bottom-10 -right-5 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
              >
                <Users className="h-6 w-6" />
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute top-1/2 right-0 bg-white text-indigo-900 p-3 rounded-full shadow-lg"
              >
                <Heart className="h-6 w-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-[#bcbe3a]">Global</span> Presence
            </motion.h2>
            <motion.p variants={slideUp} className="text-gray-600 max-w-2xl mx-auto">
              With active communities across three continents, we're building a worldwide network that celebrates
              Nigerian heritage and creates opportunities for collaboration.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex diaspora-cards justify-center grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10"
          >
            {globalLocations.map((location, index) => (
              <motion.div
                key={location.name}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-gradient-to-br diaspora-card px-10 py-6 from-indigo-50 to-blue-50 rounded-xl shadow-md border border-indigo-100"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100 text-indigo-800">
                    <Globe className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">{location.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-medium">{location.members}</span> Members
                    </p>
                    <p>
                      <span className="font-medium">{location.events}</span> Annual Events
                    </p>
                    <p>
                      <span className="font-medium">{location.projects}</span> Active Projects
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">
              Diaspora <span className="text-[#bcbe3a]">Stories</span>
            </motion.h2>
            <motion.p variants={slideUp} className="text-gray-600 max-w-2xl mx-auto">
              Watch how our diaspora initiatives are making an impact across the globe, connecting communities and
              preserving cultural heritage.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {videos.map((video, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                className="relative overflow-hidden rounded-xl shadow-lg group"
              >
                <div className="aspect-video relative">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent opacity-90"></div>

                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-[#bcbe3a]" />
                      <span className="text-sm">{video.location}</span>
                    </div>

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h3>
                      <p className="text-sm text-white/80 mb-4 line-clamp-2">{video.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#bcbe3a]" />
                          {video.date}
                        </span>

                        <button
                          onClick={() => openVideoModal(video)}
                          className="bg-[#bcbe3a] hover:bg-[#8A6D3B] text-white rounded-full p-3 transition-transform duration-300 group-hover:scale-110"
                        >
                          <Play className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Initiatives Section */}
      <section className="py-16 md:py-24 bg-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">
              Key <span className="text-[#bcbe3a]">Initiatives</span>
            </motion.h2>
            <motion.p variants={slideUp} className="text-gray-600 max-w-2xl mx-auto">
              Our diaspora outreach program focuses on these key areas to strengthen connections and create meaningful
              impact.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {initiatives.map((initiative, index) => (
              <motion.div
                key={index}
                variants={index % 2 === 0 ? slideRight : slideLeft}
                className="flex gap-6 items-start bg-white rounded-xl p-6 shadow-md"
              >
                <div className="text-4xl">{initiative.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-indigo-900">{initiative.title}</h3>
                  <p className="text-gray-600">{initiative.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">
              Diaspora <span className="text-[#bcbe3a]">Voices</span>
            </motion.h2>
            <motion.p variants={slideUp} className="text-gray-600 max-w-2xl mx-auto">
              Hear from members of our global community about how our initiatives have impacted their lives.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="relative"
          >
            {/* Decorative Elements */}
            <div className="absolute -left-20 top-1/4 w-40 h-40 bg-indigo-100 rounded-full opacity-30"></div>
            <div className="absolute -right-20 bottom-1/4 w-40 h-40 bg-[#bcbe3a]/20 rounded-full opacity-30"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-gradient-to-br from-white to-indigo-50 rounded-xl p-6 shadow-md border border-indigo-100"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14 4.93333 12.2667 6.13333 10.5333C7.33333 8.8 9.06667 7.33333 11.3333 6.13333L13.3333 8.66667C11.7333 9.46667 10.5333 10.3333 9.73333 11.2667C8.93333 12.2 8.53333 13.0667 8.53333 13.8667C8.53333 14.2 8.6 14.4667 8.73333 14.6667C8.86667 14.8667 9.06667 15 9.33333 15.0667C10.0667 15.2 10.6667 15.5333 11.1333 16.0667C11.6 16.6 11.8333 17.2 11.8333 17.8667C11.8333 18.8 11.5 19.6 10.8333 20.2667C10.1667 20.9333 9.33333 21.2667 8.33333 21.2667L9.33333 21.3333ZM21.3333 21.3333C19.8667 21.3333 18.6667 20.8 17.7333 19.7333C16.8 18.6667 16.3333 17.3333 16.3333 15.7333C16.3333 14 16.9333 12.2667 18.1333 10.5333C19.3333 8.8 21.0667 7.33333 23.3333 6.13333L25.3333 8.66667C23.7333 9.46667 22.5333 10.3333 21.7333 11.2667C20.9333 12.2 20.5333 13.0667 20.5333 13.8667C20.5333 14.2 20.6 14.4667 20.7333 14.6667C20.8667 14.8667 21.0667 15 21.3333 15.0667C22.0667 15.2 22.6667 15.5333 23.1333 16.0667C23.6 16.6 23.8333 17.2 23.8333 17.8667C23.8333 18.8 23.5 19.6 22.8333 20.2667C22.1667 20.9333 21.3333 21.2667 20.3333 21.2667L21.3333 21.3333Z"
                          fill="#bcbe3a"
                        />
                      </svg>
                    </div>

                    <p className="text-gray-700 italic mb-6 flex-grow">{testimonial.quote}</p>

                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {/* <section className="py-16 md:py-24 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image src="/placeholder.svg?height=1080&width=1920" alt="World Map" fill className="object-cover" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming <span className="text-[#bcbe3a]">Global</span> Events
            </motion.h2>
            <motion.p variants={slideUp} className="text-white/80 max-w-2xl mx-auto">
              Join us at these upcoming events to connect with the Nigerian diaspora community worldwide.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#bcbe3a]">{event.title}</h3>
                    <div className="bg-[#bcbe3a] text-white text-xs font-bold px-2 py-1 rounded-full">Upcoming</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-[#bcbe3a]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-[#bcbe3a]" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-white/80 mb-6 flex-grow">{event.description}</p>

                  <Button className="bg-transparent hover:bg-white/10 border border-[#bcbe3a] text-[#bcbe3a] rounded-full flex items-center">
                    <span>Register Now</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <motion.h2 variants={slideRight} className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Join Our Global <span className="text-[#bcbe3a]">Network</span>
                </motion.h2>

                <motion.p variants={slideRight} className="text-white/80 mb-8">
                  Whether you're in the diaspora or in Nigeria, there are many ways to get involved and contribute to
                  our mission of building bridges across borders.
                </motion.p>

                <motion.div variants={slideRight} className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-[#bcbe3a]/20 p-2 rounded-full mr-4">
                      <Globe className="h-5 w-5 text-[#bcbe3a]" />
                    </div>
                    <span className="text-white">Connect with local chapters worldwide</span>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-[#bcbe3a]/20 p-2 rounded-full mr-4">
                      <Users className="h-5 w-5 text-[#bcbe3a]" />
                    </div>
                    <span className="text-white">Participate in cultural exchange programs</span>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-[#bcbe3a]/20 p-2 rounded-full mr-4">
                      <Heart className="h-5 w-5 text-[#bcbe3a]" />
                    </div>
                    <span className="text-white">Contribute to community development projects</span>
                  </div>
                </motion.div>

                <motion.div variants={slideRight} className="mt-8">
                  <Button className="bg-[#bcbe3a] hover:bg-[#8A6D3B] text-white rounded-full px-8 py-6">
                    <Link href="/membership">Become a Member</Link>
                </Button>
                </motion.div>
              </div>

              <motion.div variants={fadeIn} className="relative h-full min-h-[300px]">
                <Image
                  src="/images/diaspora_outreach/2.jpeg?height=800&width=600"
                  alt="Global Community"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-indigo-900/80 md:bg-none"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">
              Get in <span className="text-[#bcbe3a]">Touch</span>
            </motion.h2>
            <motion.p variants={slideUp} className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our diaspora initiatives? Reach out to our global coordinators.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100">
                <Mail className="h-8 w-8 text-indigo-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">For general inquiries and information</p>
              <a href="mailto:diaspora@ekoclub.org" className="text-[#bcbe3a] font-medium hover:underline">
                diaspora@ekoclub.org
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100">
                <Phone className="h-8 w-8 text-indigo-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak with our diaspora coordinators</p>
              <a href="tel:+2341234567890" className="text-[#bcbe3a] font-medium hover:underline">
                +234 123 456 7890
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100">
                <ExternalLink className="h-8 w-8 text-indigo-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Online</h3>
              <p className="text-gray-600 mb-4">Join our online diaspora community</p>
              <a href="#" className="text-[#bcbe3a] font-medium hover:underline">
                community.ekoclub.org
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl overflow-hidden w-full max-w-4xl max-h-[50vh] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="aspect-video">
                  <iframe
                    ref={videoRef}
                    width="100%"
                    height="100%"
                    src={`${currentVideo.url}?autoplay=1`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>

                <button
                  onClick={closeVideoModal}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white rounded-full p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 bg-white">
                <h3 className="text-xl font-bold mb-2">{currentVideo.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{currentVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

