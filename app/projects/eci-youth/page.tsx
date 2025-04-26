"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Play,
  X,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Award,
  BookOpen,
  Briefcase,
  Compass,
  Heart,
  Mic,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Video data
const videos = [
  {
    id: 1,
    title: "1",
    description:
      "",
    thumbnail: "/images/Youth/youth-thumb-1.png?height=400&width=600",
    videoUrl: "https://www.youtube.com/embed/niaOmWI1cno?si=tE4t8Pb6dAEOWmfZ",
    duration: "5:24",
    category: "Leadership",
    date: "August 15, 2023",
  },
  {
    id: 2,
    title: "2",
    description: "",
    thumbnail: "/images/Youth/2.jpg?height=400&width=600",
    videoUrl: "https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745618373/AQOTLqQmjBhPapwDXylp-mRbmhqmwwVZqLC-NPYxIC-PWU3_WBdUVKzanKb9sDg8H5Fj-S2zsxN-mOi_Mn6Nm2Wh_vdg2yy.mp4",
    duration: "3:45",
    category: "Community Service",
    date: "June 22, 2023",
  },
  {
    id: 3,
    title: "3",
    description:
      "",
    thumbnail: "/images/Youth/youth-thumb-3.png?height=400&width=600",
    videoUrl: "https://www.youtube.com/embed/PK_ru6q40ts?si=S9yGZa-PkZKnLf2s",
    duration: "7:12",
    category: "Cultural",
    date: "September 5, 2023",
  },
  {
    id: 4,
    title: "4",
    description:
      "",
    thumbnail: "/images/Youth/youth-thumb-4.png?height=400&width=600",
    videoUrl: "https://www.youtube.com/embed/Wm01WWuRY-w?si=u28fIvG1dY0VD7bp",
    duration: "4:30",
    category: "Education",
    date: "July 10, 2023",
  },
  {
    id: 5,
    title: "5",
    description:
      "",
    thumbnail: "/images/Youth/youth-thumb-5.png?height=400&width=600",
    videoUrl: "https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745618374/AQMRp4x4Jp6EGdH86vxhdevnTy7uIjdO73BFyfCWUrkh4mBcORDElAHmI78P3w0X_ANfZ5t7HWwVzqf50IptEdCw_g1n3yl.mp4",
    duration: "6:18",
    category: "Sports",
    date: "October 12, 2023",
  },
  {
    id: 6,
    title: "6",
    description: "",
    thumbnail: "/images/Youth/youth-thumb-6.png?height=400&width=600",
    videoUrl: "https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745618375/AQPdBSK3tQ9EQe2kr45fI-DUWkIrKCkwDUuW_Ppik4z_AZ0ieTPlJTESeK3Y70kRIHZexG7wQnVBIahSG1eAB8jt_per6rb.mp4",
    duration: "8:05",
    category: "Innovation",
    date: "November 20, 2023",
  },
]

// Programs data
const programs = [
  {
    id: "leadership",
    title: "Leadership Development",
    icon: <Award className="h-6 w-6" />,
    description:
      "Cultivating the next generation of leaders through mentorship, workshops, and practical leadership experiences.",
    features: [
      "Executive shadowing opportunities",
      "Public speaking workshops",
      "Decision-making and problem-solving training",
      "Community project management",
    ],
    image: "/images/youth2.jpeg?height=400&width=600",
  },
  {
    id: "education",
    title: "Educational Support",
    icon: <BookOpen className="h-6 w-6" />,
    description:
      "Providing academic resources, scholarships, and educational programs to help youth excel in their studies.",
    features: [
      "Scholarship programs for higher education",
      "Tutoring and homework assistance",
      "Digital literacy training",
      "Career guidance and counseling",
    ],
    image: "/images/projects-education.jpg?height=400&width=600",
  },
  {
    id: "career",
    title: "Career Development",
    icon: <Briefcase className="h-6 w-6" />,
    description:
      "Preparing youth for successful careers through internships, job shadowing, and professional skills training.",
    features: [
      "Internship placement program",
      "Resume building and interview preparation",
      "Networking events with professionals",
      "Industry-specific workshops",
    ],
    image: "/images/Youth/2.jpg?height=400&width=600",
  },
  {
    id: "community",
    title: "Community Service",
    icon: <Heart className="h-6 w-6" />,
    description:
      "Engaging youth in meaningful volunteer work that makes a positive impact on communities locally and in Lagos.",
    features: [
      "Monthly volunteer opportunities",
      "Community needs assessment training",
      "Service learning projects",
      "Recognition program for outstanding service",
    ],
    image: "/images/Youth/1.jpg?height=400&width=600",
  },
]

// Success stories data
const successStories = [
  {
    name: "Adebayo Johnson",
    role: "Former ECI Youth President",
    current: "Medical Student, Harvard University",
    quote:
      "The leadership skills I developed through ECI Youth programs gave me the confidence to pursue my dreams and make a difference in healthcare.",
    image: "/images/portrait.png?height=300&width=300",
  },
  {
    name: "Folake Adeyemi",
    role: "Youth Mentor",
    current: "Software Engineer, Google",
    quote:
      "ECI Youth's tech workshops sparked my interest in coding. The mentorship I received helped me navigate my career path in technology.",
    image: "/images/portrait.png?height=300&width=300",
  },
  {
    name: "Oluwaseun Olatunji",
    role: "Community Service Leader",
    current: "Non-profit Founder",
    quote:
      "My experience organizing community service projects with ECI Youth inspired me to start my own non-profit focused on education in rural Lagos.",
    image: "/images/portrait.png?height=300&width=300",
  },
]

// Upcoming events data
const upcomingEvents = [
  {
    title: "Youth Leadership Summit 2024",
    date: "August 10-12, 2024",
    location: "Atlanta, GA",
    description:
      "Annual gathering of youth members for leadership training, networking, and collaborative project planning.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Tech Skills Bootcamp",
    date: "June 15-20, 2024",
    location: "Virtual Event",
    description: "Intensive training in coding, digital marketing, and tech entrepreneurship for youth members.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Cultural Heritage Festival",
    date: "July 8, 2024",
    location: "Houston, TX",
    description: "Celebration of Lagos culture through music, dance, food, and interactive workshops.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function ECIYouthPage() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const openVideoModal = (video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeVideoModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
    document.body.style.overflow = "auto"
  }

  return (
    <main className="min-h-screen pt-20 mt-4">
      {/* Hero Section with Diagonal Split */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5D5FEF]/90 to-[#C8A97E]/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Diagonal Overlay */}
        <div className="absolute inset-0 z-0">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polygon points="0,0 100,0 100,80 0,100" className="fill-[#5D5FEF]/80" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-white">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge className="bg-white text-[#5D5FEF] mb-4">ECI Youth Initiative</Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Empowering The Next Generation</h1>
                <p className="text-lg md:text-xl mb-8 max-w-xl">
                  Building future leaders through mentorship, education, cultural connection, and community service.
                </p>
                {/* <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-[#5D5FEF] hover:bg-gray-100">
                    Join Our Youth Program
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    Learn More
                  </Button>
                </div> */}
              </motion.div>
            </div>

            <div className="w-full md:w-1/2 mt-12 md:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/images/mission-card.jpeg?height=400&width=600"
                    alt="ECI Youth members"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-lg overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/images/Youth/4.jpg?height=200&width=200"
                    alt="Youth activities"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path d="M0 27C240 54 480 54 720 27C960 0 1200 0 1440 27V54H0V27Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Floating Stats Section */}
      <section className="container mx-auto px-4 relative z-30 -mt-16 md:-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Users className="h-8 w-8 text-[#5D5FEF]" />, stat: "5,000+", label: "Youth Members" },
              { icon: <MapPin className="h-8 w-8 text-[#5D5FEF]" />, stat: "15", label: "Chapters Worldwide" },
              { icon: <Calendar className="h-8 w-8 text-[#5D5FEF]" />, stat: "50+", label: "Annual Events" },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-none bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#5D5FEF]/10 rounded-full">{item.icon}</div>
                  <div>
                    <p className="text-3xl font-bold text-[#5D5FEF]">{item.stat}</p>
                    <p className="text-gray-600">{item.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section with Floating Elements */}
      <section className="py-20 bg-white" ref={containerRef}>
        <div className="container mx-auto px-4">
          <motion.div style={{ opacity, scale }} className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="bg-[#5D5FEF] text-white mb-4">About Our Youth Initiative</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Nurturing Tomorrow's Leaders Today</h2>
            <p className="text-lg text-gray-700 mb-8">
              The ECI Youth Initiative is dedicated to empowering young people of Lagos heritage with the skills,
              knowledge, and cultural connections they need to succeed in today's world while maintaining their cultural
              identity. Through mentorship, educational support, leadership training, and community service, we're
              building a network of future leaders who will make positive impacts in their communities and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/10 rounded-full">
                <Award className="h-5 w-5 text-[#5D5FEF]" />
                <span>Leadership Development</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/10 rounded-full">
                <BookOpen className="h-5 w-5 text-[#5D5FEF]" />
                <span>Educational Support</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/10 rounded-full">
                <Heart className="h-5 w-5 text-[#5D5FEF]" />
                <span>Community Service</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/10 rounded-full">
                <Compass className="h-5 w-5 text-[#5D5FEF]" />
                <span>Cultural Connection</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Images */}
          <div className="relative h-[400px] md:h-[500px] mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 left-0 md:left-[10%] w-[200px] h-[250px] md:w-[300px] md:h-[350px] rounded-lg overflow-hidden shadow-lg z-10"
            >
              <Image
                src="/images/welcome1.jpg?height=350&width=300"
                alt="Youth leadership training"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-[100px] right-0 md:right-[10%] w-[200px] h-[250px] md:w-[300px] md:h-[350px] rounded-lg overflow-hidden shadow-lg z-20"
            >
              <Image
                src="/images/eci-youth-movement.jpg?height=350&width=300"
                alt="Youth cultural activities"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute bottom-0 left-[50%] transform -translate-x-1/2 w-[200px] h-[150px] md:w-[250px] md:h-[200px] rounded-lg overflow-hidden shadow-lg z-30"
            >
              <Image
                src="/images/Youth/1.jpg?height=200&width=250"
                alt="Youth community service"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Gallery Section - Hexagonal Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-[#C8A97E] text-white mb-4">Watch & Learn</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Youth in Action</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              See our youth programs in action through these inspiring videos showcasing leadership development,
              community service, cultural activities, and more.
            </p>
          </motion.div>

          {/* Hexagonal Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-[#5D5FEF]">{video.category}</Badge>
                      <Badge variant="outline" className="border-white text-white">
                        {video.duration}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-1 group-hover:text-[#C8A97E] transition-colors duration-300">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-200 mb-3 line-clamp-2">{video.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-300">{video.date}</span>
                        <Button
                          size="sm"
                          className="bg-[#C8A97E] hover:bg-[#8A6D3B] rounded-full h-10 w-10 p-0"
                          onClick={() => openVideoModal(video)}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section with Horizontal Tabs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="bg-[#5D5FEF] text-white mb-4">Our Programs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Youth Development Initiatives</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore our comprehensive programs designed to develop well-rounded youth leaders with strong cultural
              connections and practical skills for success.
            </p>
          </motion.div>

          <Tabs defaultValue="leadership" className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <TabsList className="bg-gray-100 p-1 rounded-full">
                {programs.map((program) => (
                  <TabsTrigger
                    key={program.id}
                    value={program.id}
                    className="rounded-full px-6 py-2 data-[state=active]:bg-[#5D5FEF] data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      {program.icon}
                      <span>{program.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {programs.map((program) => (
              <TabsContent key={program.id} value={program.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-[#5D5FEF]">{program.title}</h3>
                    <p className="text-gray-700 mb-6">{program.description}</p>

                    <div className="space-y-4 mb-8">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="mt-1 bg-[#5D5FEF]/10 p-1 rounded-full">
                            <ChevronRight className="h-4 w-4 text-[#5D5FEF]" />
                          </div>
                          <p>{feature}</p>
                        </div>
                      ))}
                    </div>

                  </div>

                  <div className="relative rounded-lg overflow-hidden shadow-lg h-[300px] md:h-[400px]">
                    <Image
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Success Stories Section - Carousel */}
      <section className="py-20 bg-[#5D5FEF]/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-[#C8A97E] text-white mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Youth Alumni Spotlight</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Meet former ECI Youth members who have gone on to achieve remarkable success in their careers and
              communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image src={story.image || "/placeholder.svg"} alt={story.name} fill className="object-cover" />
                </div>

                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mb-1">{story.name}</h3>
                    <p className="text-[#5D5FEF] font-medium mb-1">{story.role}</p>
                    <p className="text-gray-600 text-sm mb-4">{story.current}</p>
                    <Separator className="mb-4" />
                    <p className="italic text-gray-700">"{story.quote}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Horizontal Scroll */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="bg-[#5D5FEF] text-white mb-4">Upcoming Events</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us at These Youth Events</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Stay connected with our vibrant youth community through these upcoming events and activities.
            </p>
          </motion.div>

          <div className="overflow-x-auto pb-8">
            <div className="flex gap-6 min-w-max">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden w-[300px] flex-shrink-0 border border-gray-100"
                >
                  <div className="relative h-[150px] overflow-hidden">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">{event.description}</p>
                    <Button
                      variant="outline"
                      className="w-full border-[#5D5FEF] text-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white"
                    >
                      Register Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-[#5D5FEF] hover:bg-[#4A4CD8]">
              View All Events <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#5D5FEF] to-[#4A4CD8] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-white text-[#5D5FEF] mb-4">Get Involved</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Youth Movement</h2>
              <p className="text-lg mb-8">
                Become part of a vibrant community of young leaders making a difference locally and globally. The ECI
                Youth Initiative offers mentorship, skills development, cultural connection, and opportunities to create
                positive change.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/20 p-1 rounded-full">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p>Access to leadership development programs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/20 p-1 rounded-full">
                    <Mic className="h-4 w-4" />
                  </div>
                  <p>Networking with successful professionals</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/20 p-1 rounded-full">
                    <Award className="h-4 w-4" />
                  </div>
                  <p>Scholarship and educational opportunities</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-[#5D5FEF] hover:bg-gray-100">
                  Apply Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-gray-400 hover:bg-white/20">
                  Contact Us
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/eci-youth-movement.jpg?height=400&width=600"
                alt="Youth members collaborating"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={closeVideoModal}
              >
                <X className="h-6 w-6" />
              </Button>

              <div className="aspect-video w-full">
                <iframe
                  src={`${selectedVideo.videoUrl}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-4 bg-black text-white">
                <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-300">{selectedVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

