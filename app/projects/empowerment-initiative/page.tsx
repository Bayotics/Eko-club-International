"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play, Calendar, MapPin, X, Briefcase, GraduationCap, TrendingUp, Award } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function EmpowermentInitiativePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const videoRef = useRef(null)

  // Sample videos data
  const videos = [
    {
      id: 1,
      title: "Skills Development Program",
      description:
        "Our comprehensive skills training program equipping youth and women with marketable skills for economic independence.",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Entrepreneurship Success Stories",
      description:
        "Meet the entrepreneurs who have transformed their lives through our business development and mentorship programs.",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  ]

  // Sample programs data
  const programs = [
    {
      title: "Vocational Skills Training",
      description:
        "Intensive training in high-demand skills including digital marketing, web development, fashion design, culinary arts, and more.",
      image: "/images/Empowerment/empowerment-1.png?height=400&width=600",
      impact: "1,200+ graduates employed",
    },
    {
      title: "Business Development",
      description:
        "Comprehensive support for entrepreneurs including business planning, financial management, marketing strategies, and access to micro-loans.",
      image: "/images/Empowerment/4.png?height=400&width=600",
      impact: "350+ businesses launched",
    },
    {
      title: "Digital Literacy",
      description:
        "Bridging the digital divide through computer literacy training, coding bootcamps, and technology access programs for underserved communities.",
      image: "/images/Empowerment/digital-literacy.jpg?height=400&width=600",
      impact: "3,000+ participants trained",
    },
    {
      title: "Youth Leadership Academy",
      description:
        "Developing the next generation of leaders through mentorship, leadership training, and community service projects.",
      image: "/images/Empowerment/7.png?height=400&width=600",
      impact: "500+ youth leaders developed",
    },
  ]

  // Sample success stories
  const successStories = [
    {
      name: "Adebola Johnson",
      business: "Adebola's Fashion House",
      image: "/placeholder.svg?height=300&width=300",
      story:
        "After completing the fashion design program, I started my own business with a micro-loan from Eko Club. Today, I employ 5 people and supply clothing to local boutiques. My income has tripled, and I can now provide for my family and pay for my children's education.",
    },
    {
      name: "Oluwaseun Adeyemi",
      business: "TechSolutions Nigeria",
      image: "/placeholder.svg?height=300&width=300",
      story:
        "The web development bootcamp changed my life. I went from being unemployed to launching my own tech company that now provides services to businesses across Lagos. The mentorship and business development support were invaluable in helping me establish and grow my business.",
    },
    {
      name: "Funmilayo Okonkwo",
      business: "Funmi's Catering Services",
      image: "/placeholder.svg?height=300&width=300",
      story:
        "I always loved cooking but didn't know how to turn it into a business. The culinary arts program and business training gave me the skills and confidence to start my catering service. Now I cater events and supply meals to offices, earning a steady income that has lifted my family out of poverty.",
    },
  ]

  // Sample upcoming workshops
  const upcomingWorkshops = [
    {
      id: 1,
      title: "Digital Marketing Masterclass",
      date: "August 10-12, 2024",
      location: "Eko Club Training Center, Lagos",
      description:
        "A comprehensive 3-day workshop covering social media marketing, SEO, content creation, and online advertising strategies.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Business Plan Development",
      date: "September 5-6, 2024",
      location: "Virtual Workshop",
      description:
        "Learn how to create a compelling business plan that can help secure funding and guide your business growth.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Financial Literacy for Entrepreneurs",
      date: "October 15, 2024",
      location: "Eko Club Training Center, Lagos",
      description:
        "Essential financial management skills for small business owners, including budgeting, pricing, and record-keeping.",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const fadeInFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const fadeInFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  const openVideoModal = (video) => {
    setSelectedVideo(video)
    setVideoModalOpen(true)
  }

  return (
    <div className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Empowerment/6.png?height=800&width=1200"
            alt="Empowerment Initiative"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="mb-4">
              <div className="flex items-center justify-center gap-2 text-white/80 mb-4">
                <Link href="/" className="hover:text-[#C8A97E] transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/#projects" className="hover:text-[#C8A97E] transition-colors">
                  Our Projects
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#C8A97E]">Empowerment Initiative</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Empowerment Initiative</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#C8A97E] mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Equipping individuals with skills, resources, and opportunities to achieve economic independence and
                build better futures.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromLeft}
            >
              <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/Empowerment/8.png?height=800&width=1200"
                  alt="Empowerment Initiative Overview"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromRight}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                About Our <span className="text-[#C8A97E]">Empowerment Initiative</span>
              </h2>
              <div className="h-1 w-20 bg-[#C8A97E] mb-6"></div>
              <p className="text-gray-600">
                The Eko Club International Empowerment Initiative was established in 2015 to address unemployment and
                economic challenges in our communities. Our mission is to equip individuals with the skills, resources,
                and opportunities they need to achieve economic independence and build better futures for themselves and
                their families.
              </p>
              <p className="text-gray-600">
                Through vocational training, entrepreneurship development, digital literacy programs, and leadership
                development, we have empowered thousands of individuals to transform their lives and contribute to their
                communities' economic growth.
              </p>
              <p className="text-gray-600">
                Our approach combines practical skills training with business development support, mentorship, and
                access to resources such as micro-loans and networking opportunities. We believe in creating sustainable
                pathways to economic empowerment that lead to long-term success and community development.
              </p>
              <div className="pt-4">
                <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none px-8 py-6 uppercase">
                  Join Our Programs
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              See Our <span className="text-[#C8A97E]">Impact</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Watch these videos to see how our empowerment initiatives are transforming lives and communities.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                variants={index === 0 ? fadeInFromLeft : fadeInFromRight}
                className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg"
                onClick={() => openVideoModal(video)}
              >
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                    <motion.div
                      className="bg-white/90 rounded-full p-5 group-hover:bg-[#C8A97E] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Play className="h-10 w-10 text-gray-800 group-hover:text-white" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#C8A97E] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-[#C8A97E] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact by the Numbers</h2>
            <div className="h-1 w-20 bg-white mx-auto mb-8"></div>
            <p className="text-white/90">
              Since 2015, our empowerment initiatives have created significant positive change in the lives of
              thousands.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <GraduationCap className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">5,000+</div>
              <p className="text-xl">Individuals Trained</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Briefcase className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">350+</div>
              <p className="text-xl">Businesses Launched</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <TrendingUp className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">75%</div>
              <p className="text-xl">Employment Rate</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Award className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">12</div>
              <p className="text-xl">Training Programs</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Our <span className="text-[#C8A97E]">Programs</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Explore our key programs designed to empower individuals with skills and opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={index % 2 === 0 ? fadeInFromLeft : fadeInFromRight}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-full md:w-1/2 relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image src={program.image || "/placeholder.svg"} alt={program.title} fill className="object-cover" />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800">{program.title}</h3>
                  <p className="text-gray-600">{program.description}</p>
                  <div className="p-4 bg-[#C8A97E]/10 rounded-lg">
                    <p className="text-[#C8A97E] font-medium">Impact: {program.impact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Success <span className="text-[#C8A97E]">Stories</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Meet some of the entrepreneurs and professionals who have transformed their lives through our empowerment
              programs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {successStories.map((story, index) => (
              <motion.div key={index} variants={scaleIn} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <Image src={story.image || "/placeholder.svg"} alt={story.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{story.name}</h3>
                  <p className="text-[#C8A97E] font-medium mb-4">{story.business}</p>
                  <p className="text-gray-600 italic">"{story.story}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Upcoming Workshops Section */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Upcoming <span className="text-[#C8A97E]">Workshops</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Join our upcoming workshops and training sessions to develop your skills and advance your career or
              business.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {upcomingWorkshops.map((workshop, index) => (
              <motion.div key={workshop.id} variants={scaleIn}>
                <Card className="border-0 overflow-hidden shadow-lg h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <Image
                      src={workshop.image || "/placeholder.svg"}
                      alt={workshop.title}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 flex-grow">
                    <h3 className="text-xl font-medium mb-3">{workshop.title}</h3>
                    <p className="text-gray-600 mb-4">{workshop.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-[#C8A97E] mr-2" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#C8A97E] mr-2" />
                        <span>{workshop.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none uppercase">
                      Register
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-[#C8A97E]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Support Our Empowerment Initiative</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Your support can help us expand our programs and empower more individuals to achieve economic independence
              and build better futures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#C8A97E] hover:bg-gray-100 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/#contact">Volunteer With Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 bg-black overflow-hidden">
          <button
            onClick={() => setVideoModalOpen(false)}
            className="absolute right-4 top-4 z-10 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                ref={videoRef}
                width="100%"
                height="100%"
                src={`${selectedVideo.videoUrl}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

