"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  X,
  Calendar,
  Clock,
  MapPin,
  Heart,
  BookOpen,
  Gift,
  Smile,
  Music,
  Award,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Custom components for this page
const BubbleShape = ({ className, delay = 0 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      duration: 0.8,
      delay,
      type: "spring",
      stiffness: 100,
    }}
    className={`absolute rounded-full ${className}`}
  />
)

const VideoCard = ({ title, thumbnail, description, duration, category, onClick }) => (
  <motion.div
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
    className="relative overflow-hidden rounded-[2rem] shadow-lg cursor-pointer group"
    onClick={onClick}
  >
    <div className="relative aspect-video overflow-hidden rounded-[2rem]">
      <Image
        src={thumbnail || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-3 py-1 bg-[#FF6B6B] text-white text-xs font-bold rounded-full">{category}</span>
        <span className="px-3 py-1 bg-black/50 text-white text-xs font-bold rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> {duration}
        </span>
      </div>

      <motion.div className="absolute inset-0 flex items-center justify-center" whileHover={{ scale: 1.1 }}>
        <div className="w-16 h-16 rounded-full bg-[#FF6B6B] flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 text-white ml-1" />
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  </motion.div>
)

const VideoModal = ({ isOpen, onClose, videoSrc, title, description }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden"
          style={{ maxHeight: "60vh" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-full" style={{ height: "calc(60vh - 100px)" }}>
            <iframe
              src={`${videoSrc}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="p-4 bg-white">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

const ActivityCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    className={`relative overflow-hidden rounded-[2rem] p-6 ${color} text-white`}
  >
    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
    <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/10" />

    <div className="relative">
      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  </motion.div>
)

const ImpactCard = ({ number, label, icon: Icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`rounded-[2rem] p-6 ${color} text-white flex flex-col items-center justify-center text-center h-full`}
  >
    <Icon className="w-10 h-10 mb-4" />
    <div className="text-4xl font-bold mb-1">{number}</div>
    <div className="text-sm font-medium text-white/80">{label}</div>
  </motion.div>
)

const TestimonialCard = ({ quote, name, role, image }) => (
  <div className="bg-white rounded-[2rem] p-6 shadow-lg relative">
    <div className="absolute -top-6 left-6">
      <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md">
        <Image src={image || "/placeholder.svg"} alt={name} width={48} height={48} className="object-cover" />
      </div>
    </div>
    <div className="pt-6">
      <p className="text-gray-600 italic mb-4">"{quote}"</p>
      <div className="font-bold text-gray-800">{name}</div>
      <div className="text-sm text-gray-500">{role}</div>
    </div>
  </div>
)

export default function ChildrenOutreachInitiative() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const videos = [
    {
      id: 1,
      title: "Annual Children's Day Celebration",
      description:
        "Watch highlights from our annual Children's Day celebration featuring games, performances, and educational activities.",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "3:45",
      category: "Events",
    },
    {
      id: 2,
      title: "School Supplies Distribution",
      description:
        "See how our volunteers distribute essential school supplies to children in underserved communities.",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "5:12",
      category: "Outreach",
    },
    {
      id: 3,
      title: "Children's Talent Show",
      description: "Enjoy performances from talented children showcasing their skills in music, dance, and more.",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "7:30",
      category: "Performances",
    },
  ]

  const openModal = (video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const activities = [
    {
      icon: BookOpen,
      title: "Educational Support",
      description: "Providing tutoring, mentorship, and educational resources to help children excel academically.",
      color: "bg-[#FF6B6B]",
    },
    {
      icon: Gift,
      title: "School Supplies",
      description: "Distributing backpacks, books, and other essential school supplies to children in need.",
      color: "bg-[#4ECDC4]",
    },
    {
      icon: Smile,
      title: "Recreational Activities",
      description: "Organizing sports, games, and fun activities to promote physical health and social skills.",
      color: "bg-[#FFD166]",
    },
    {
      icon: Music,
      title: "Arts & Creativity",
      description: "Fostering creative expression through music, art, dance, and drama workshops.",
      color: "bg-[#6A0572]",
    },
    {
      icon: Heart,
      title: "Health & Nutrition",
      description: "Providing health education, screenings, and nutritious meals to support children's wellbeing.",
      color: "bg-[#1A936F]",
    },
    {
      icon: Award,
      title: "Special Events",
      description: "Hosting celebrations, talent shows, and recognition ceremonies to inspire and motivate children.",
      color: "bg-[#3D348B]",
    },
  ]

  const impactStats = [
    { number: "5,000+", label: "Children Reached", icon: Smile, color: "bg-[#FF6B6B]" },
    { number: "12", label: "Schools Supported", icon: BookOpen, color: "bg-[#4ECDC4]" },
    { number: "24", label: "Annual Events", icon: Calendar, color: "bg-[#FFD166]" },
    { number: "8", label: "Communities Served", icon: MapPin, color: "bg-[#3D348B]" },
  ]

  const testimonials = [
    {
      quote:
        "The Children Outreach Initiative has transformed my daughter's outlook on education. She's now excited about learning!",
      name: "Mrs. Adebayo",
      role: "Parent",
      image: "/images/portrait.png?height=100&width=100",
    },
    {
      quote:
        "The school supplies we received made a huge difference for our students. Many of them couldn't afford these essentials.",
      name: "Mr. Johnson",
      role: "School Principal",
      image: "/images/portrait.png?height=100&width=100",
    },
    {
      quote: "I love the art classes! I've discovered my talent for painting thanks to the amazing teachers.",
      name: "Tunde, 10",
      role: "Program Participant",
      image: "/images/portrait.png?height=100&width=100",
    },
  ]

  const upcomingEvents = [
    {
      title: "Back to School Drive",
      date: "August 15, 2023",
      location: "Lagos Central School",
      description: "Distribution of school supplies and educational materials to children in need.",
    },
    {
      title: "Children's Talent Show",
      date: "September 10, 2023",
      location: "Eko Club Hall",
      description: "A showcase of children's talents in music, dance, poetry, and more.",
    },
    {
      title: "Holiday Gift Program",
      date: "December 18, 2023",
      location: "Multiple Locations",
      description: "Bringing joy to children through gift-giving and festive celebrations.",
    },
  ]

  return (
    <main className="pt-20 overflow-hidden mt-5">
      {/* Breadcrumb - Improved Design */}
      <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#FFD166]/10 py-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm md:text-base">
            <Link
              href="/"
              className="text-gray-600 hover:text-[#FF6B6B] transition-colors duration-200 flex items-center"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href="/#projects"
              className="text-gray-600 hover:text-[#FF6B6B] transition-colors duration-200 flex items-center"
            >
              Our Projects
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-[#FF6B6B] font-medium">Children Outreach Initiative</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Playful Design */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#FF6B6B] to-[#FFD166] overflow-hidden">
        {/* Decorative bubbles */}
        <BubbleShape className="w-32 h-32 bg-white/10 -top-10 left-[10%]" delay={0.1} />
        <BubbleShape className="w-24 h-24 bg-white/10 top-20 right-[15%]" delay={0.2} />
        <BubbleShape className="w-40 h-40 bg-white/10 bottom-10 left-[20%]" delay={0.3} />
        <BubbleShape className="w-20 h-20 bg-white/10 bottom-20 right-[30%]" delay={0.4} />

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 mb-10 md:mb-0 text-white"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Brightening Children's Futures
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-lg">
                Our Children Outreach Initiative provides educational support, recreational activities, and essential
                resources to help children thrive and reach their full potential.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-[#FF6B6B] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold">
                  Get Involved
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold"
                >
                  Donate Now
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2 relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div
                  className="absolute inset-0 rounded-full bg-white/20 animate-pulse"
                  style={{ animationDuration: "3s" }}
                ></div>
                <Image
                  src="/images/Children/10.png?height=600&width=600"
                  alt="Children smiling"
                  width={600}
                  height={600}
                  className="relative z-10 rounded-full object-cover border-8 border-white/30"
                />

                {/* Floating elements */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -top-5 -right-5 bg-[#4ECDC4] rounded-full p-4 shadow-lg z-20"
                >
                  <BookOpen className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="absolute -bottom-5 -left-5 bg-[#FFD166] rounded-full p-4 shadow-lg z-20"
                >
                  <Smile className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="absolute top-1/2 -right-10 bg-white rounded-full p-3 shadow-lg z-20"
                >
                  <Heart className="w-6 h-6 text-[#FF6B6B]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats - Colorful Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Through our dedicated efforts, we've made a meaningful difference in the lives of thousands of children.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ImpactCard {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Curved Design */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-24 bg-gray-50"
          style={{ borderRadius: "0 0 50% 50%/0 0 100% 100%" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 mt-12">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden">
                  <Image
                    src="/images/Children/6.png?height=720&width=1280"
                    alt="Children in a classroom"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-[2rem] overflow-hidden border-8 border-white shadow-xl">
                  <Image
                    src="/images/Children/2.png?height=200&width=200"
                    alt="Children playing"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full overflow-hidden border-8 border-white shadow-xl">
                  <Image
                    src="/images/Children/2.png?height=200&width=200"
                    alt="Child reading"
                    fill
                    className="object-cover"
                  />
                </div> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Our Children's Initiative</h2>
              <p className="text-gray-600 mb-6">
                The Children Outreach Initiative was established in 2010 with a mission to provide educational support,
                health services, and recreational activities to children in underserved communities.
              </p>
              <p className="text-gray-600 mb-6">
                We believe that every child deserves the opportunity to learn, play, and grow in a safe and nurturing
                environment. Through our various programs, we aim to empower children to reach their full potential and
                build a brighter future.
              </p>
              {/* <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white rounded-full">Learn More</Button>
                <Button
                  variant="outline"
                  className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-full"
                >
                  Our History
                </Button>
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#6A0572] to-[#AB83A1]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See Our Impact in Action</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Watch these videos to see how our Children Outreach Initiative is making a difference in the lives of
              children.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <VideoCard {...video} onClick={() => openModal(video)} />
              </motion.div>
            ))}
          </div>
        </div>

        <VideoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          videoSrc={selectedVideo?.videoSrc}
          title={selectedVideo?.title}
          description={selectedVideo?.description}
        />
      </section>

      {/* Our Activities - Colorful Cards */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Activities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a variety of programs and activities designed to support children's development and wellbeing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ActivityCard {...activity} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Bubble Style */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <BubbleShape className="w-40 h-40 bg-[#FF6B6B]/10 -top-20 left-[5%]" />
        <BubbleShape className="w-32 h-32 bg-[#4ECDC4]/10 top-40 right-[10%]" />
        <BubbleShape className="w-24 h-24 bg-[#FFD166]/10 bottom-20 left-[15%]" />
        <BubbleShape className="w-36 h-36 bg-[#3D348B]/10 bottom-10 right-[20%]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What People Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from parents, educators, and children about the impact of our programs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events - Curved Cards */}
      <section className="py-16 md:py-24 bg-[#4ECDC4]/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join us at these upcoming events to support our Children Outreach Initiative.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg"
              >
                <div
                  className={`h-3 ${index === 0 ? "bg-[#FF6B6B]" : index === 1 ? "bg-[#FFD166]" : "bg-[#3D348B]"}`}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Button
                    className={`w-full rounded-full ${index === 0 ? "bg-[#FF6B6B] hover:bg-[#FF6B6B]/90" : index === 1 ? "bg-[#FFD166] hover:bg-[#FFD166]/90 text-gray-800" : "bg-[#3D348B] hover:bg-[#3D348B]/90"} text-white`}
                  >
                    Register Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#FF6B6B] to-[#FFD166] relative overflow-hidden">
        <BubbleShape className="w-40 h-40 bg-white/10 -top-20 right-[10%]" />
        <BubbleShape className="w-32 h-32 bg-white/10 bottom-10 left-[5%]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-[2rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Help Us Make a Difference</h2>
                <p className="text-white/90 text-lg mb-6">
                  Your support can help us reach more children and expand our programs. Join us in our mission to
                  brighten children's futures.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white text-[#FF6B6B] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold">
                    Donate Now
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold"
                  >
                    Volunteer
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:w-1/3"
              >
                <div className="relative w-full aspect-square max-w-xs mx-auto">
                  <Image
                    src="/images/Children/9.png?height=400&width=400"
                    alt="Children smiling"
                    width={400}
                    height={400}
                    className="rounded-full object-cover border-8 border-white/30"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

