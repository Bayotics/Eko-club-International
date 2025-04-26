"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play, Calendar, MapPin, Users, X, Heart, Home, BookOpen } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function LagosCommunityOutreachPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const videoRef = useRef(null)

  // Sample videos data
  const videos = [
    {
      id: 1,
      title: "ECI Lagos Outreach 1",
      description: "",
      thumbnail: "/images/Food_Palliative/food_banks.jpg?height=400&width=600",
      videoUrl: "https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745614208/egjigojjmj3xqnetfznh.mp4",
    },
    {
      id: 2,
      title: "ECI Lagos Outreach 2",
      description: "",
      thumbnail: "/images/Food_Palliative/4.jpg?height=400&width=600",
      videoUrl: "https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745614217/AQOUoIPyiG0R316CIDWjHnQ3IGTOwGDTF03kpHYB3_EhZcw4Sp8RZDOZmZ3gCk6skWTwCRi4hjQvARIOQD40oM8s_ahrvpd.mp4",
    },
    {
      id: 3,
      title: "ECI Lagos Outreach 3",
      description: "",
      thumbnail: "/images/Food_Palliative/1.png?height=400&width=600",
      videoUrl: "https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745614213/AQNFRL4_dmPURHvjtQShRiByTrL4I7kQyMHbvTI-PIeAN3dF3XxCmFYC_p7_56_bZc7zKptoXIGAtPmoYGPQvQrr_c6pbe2.mp4",
    },
  ]

  // Sample projects data
  const projects = [
    {
      title: "Clean Water Initiative",
      description:
        "Providing access to clean water through well drilling, water purification systems, and education on water conservation and hygiene practices.",
      image: "/images/Clean-water.jpeg?height=400&width=600",
      impact: "15,000+ residents served",
    },
    {
      title: "Education Initiative",
      description:
        "Renovating and equipping schools with modern facilities, learning materials, and technology to enhance educational experiences.",
      image: "/images/education-initiative.jpg?height=400&width=600",
      impact: "12 schools renovated",
    },
    {
      title: "Healthcare Access",
      description:
        "Establishing community health centers, organizing health camps, and providing essential medications to improve healthcare access.",
      image: "/images/Medical_Mission/2012/9.jpg?height=400&width=600",
      impact: "8,500+ patients treated",
    },
    {
      title: "Food Security",
      description:
        "Distributing food packages to vulnerable families and supporting sustainable farming initiatives to address food insecurity.",
      image: "/images/food-palliative-card.jpg?height=400&width=600",
      impact: "5,000+ families supported",
    },
  ]

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Community Clean-up Day",
      date: "July 15, 2024",
      location: "Mushin, Lagos",
      description: "Join us for a day of community service as we clean up streets and public spaces in Mushin.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Youth Empowerment Workshop",
      date: "August 5, 2024",
      location: "Surulere, Lagos",
      description: "A workshop focused on providing skills and resources for youth to thrive in today's economy.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Health Screening Camp",
      date: "September 12, 2024",
      location: "Alimosho, Lagos",
      description: "Free health screenings and consultations for residents of Alimosho and surrounding areas.",
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
            src="/images/community-outreach-banner.jpg?height=800&width=1200"
            alt="Lagos Community Outreach"
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
                <Link href="/" className="hover:text-[#78b16d] transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/#projects" className="hover:text-[#78b16d] transition-colors">
                  Our Projects
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#78b16d]">Lagos Community Outreach</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Lagos Community Outreach</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#78b16d] mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Transforming lives and building stronger communities through sustainable development initiatives in
                Lagos.
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
                  src="/images/community-outreach-2.jpg?height=800&width=1200"
                  alt="Lagos Community Outreach Overview"
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
                About Our <span className="text-[#78b16d]">Community Outreach</span>
              </h2>
              <div className="h-1 w-20 bg-[#78b16d] mb-6"></div>
              <p className="text-gray-600">
                The Lagos Community Outreach program was established in 2012 to address critical needs in underserved
                communities across Lagos State. Our mission is to improve quality of life through sustainable
                development initiatives focused on education, healthcare, clean water, food security, and economic
                empowerment.
              </p>
              <p className="text-gray-600">
                Working closely with local leaders and community members, we identify the most pressing needs and
                develop tailored solutions that create lasting impact. Our approach emphasizes community participation,
                sustainability, and building local capacity to ensure long-term success.
              </p>
              <p className="text-gray-600">
                Over the years, our outreach efforts have touched the lives of over 50,000 residents across 25
                communities in Lagos State. From renovating schools and establishing health centers to drilling water
                wells and supporting local businesses, we are committed to creating positive change that transforms
                lives and communities.
              </p>
              <div className="pt-4">
                <Button className="bg-[#78b16d] hover:bg-[#7be07b] text-white transition-colors duration-300 rounded-none px-8 py-6 uppercase">
                  Get Involved
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
              Our <span className="text-[#78b16d]">Impact</span> in Action
            </h2>
            <div className="h-1 w-20 bg-[#78b16d] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Watch these videos to see how our community outreach initiatives are making a difference in Lagos.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                variants={scaleIn}
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
                      className="bg-white/90 rounded-full p-4 group-hover:bg-[#78b16d] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Play className="h-8 w-8 text-gray-800 group-hover:text-white" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#78b16d] transition-colors">
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
      <section className="py-20 bg-[#78b16d] text-white">
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
              Since 2012, our community outreach initiatives have created significant positive change across Lagos.
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
                <Home className="h-10 w-10 text-blue-700" />
              </div>
              <div className="text-5xl font-bold mb-2">25+</div>
              <p className="text-xl">Communities Served</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Users className="h-10 w-10 text-pink-700" />
              </div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <p className="text-xl">Lives Impacted</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <BookOpen className="h-10 w-10 text-purple-700"/>
              </div>
              <div className="text-5xl font-bold mb-2">12</div>
              <p className="text-xl">Schools Renovated</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Heart className="h-10 w-10 text-yellow-700" />
              </div>
              <div className="text-5xl font-bold mb-2">35+</div>
              <p className="text-xl">Projects Completed</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
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
              Our <span className="text-[#78b16d]">Projects</span>
            </h2>
            <div className="h-1 w-20 bg-[#78b16d] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Explore our key initiatives that are transforming communities across Lagos State.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={index % 2 === 0 ? fadeInFromLeft : fadeInFromRight}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-full md:w-1/2 relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                  <div className="p-4 bg-[#78b16d]/10 rounded-lg">
                    <p className="text-[#78b16d] font-medium">Impact: {project.impact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Community <span className="text-[#78b16d]">Voices</span>
            </h2>
            <div className="h-1 w-20 bg-[#78b16d] mx-auto mb-8"></div>
            <p className="text-white/80">
              Hear from community members whose lives have been transformed through our outreach initiatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromLeft}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/community-member1.PNG?height=200&width=200" alt="Testimonial" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mrs. Adebisi Ogunleye</h3>
                  <p className="text-[#78b16d]">Mushin Community</p>
                </div>
              </div>
              <p className="text-white/80 italic">
                "The clean water well installed in our community has transformed our lives. We no longer have to walk
                miles for water, and waterborne illnesses have significantly decreased. Thank you for this life-changing
                initiative."
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/community-member-2.jpg?height=200&width=200" alt="Testimonial" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mr. Oluwaseun Adeyemi</h3>
                  <p className="text-[#78b16d]">School Principal, Alimosho</p>
                </div>
              </div>
              <p className="text-white/80 italic">
                "The renovation of our school has created an environment where students are excited to learn. With new
                classrooms, a library, and computer lab, our students now have access to resources they never had
                before. Enrollment has increased by 40%."
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromRight}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/community-member-3.PNG?height=200&width=200" alt="Testimonial" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mrs. Funmilayo Ojo</h3>
                  <p className="text-[#78b16d]">Small Business Owner, Surulere</p>
                </div>
              </div>
              <p className="text-white/80 italic">
                "The business training and micro-loan I received helped me expand my small food business. I now employ
                three people from my community and can provide for my family. This program has given me hope for the
                future."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
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
              Upcoming <span className="text-[#78b16d]">Events</span>
            </h2>
            <div className="h-1 w-20 bg-[#78b16d] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Join us at these upcoming events and be part of our community outreach efforts.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {upcomingEvents.map((event, index) => (
              <motion.div key={event.id} variants={scaleIn}>
                <Card className="border-0 overflow-hidden shadow-lg h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 flex-grow">
                    <h3 className="text-xl font-medium mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-[#78b16d] mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#78b16d] mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full bg-[#78b16d] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none uppercase">
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
      <section className="py-20 bg-[#78b16d]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Support Our Community Outreach</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Your support can help us expand our outreach efforts and create lasting positive change in more
              communities across Lagos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#78b16d] hover:bg-gray-100 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/contact">Contact Us</Link>
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

