"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Play, X, Calendar, MapPin, Users } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Sample data for medical missions
const medicalMissions = [
  {
    year: "2024",
    title: "Medical Mission 2024",
    location: "Lagos, Nigeria",
    date: "March 15-22, 2024",
    participants: "120+ healthcare professionals",
    description:
      "Our most recent medical mission to Lagos provided essential healthcare services to over 5,000 individuals in underserved communities. Services included general consultations, specialized care, surgeries, dental services, eye care, and distribution of medications.",
    impact: "5,000+ patients served",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    videos: [],
  },
  {
    year: "2022",
    title: "Medical Mission 2022",
    location: "Lagos, Nigeria",
    date: "April 10-18, 2022",
    participants: "95+ healthcare professionals",
    description:
      "Following the challenges of the global pandemic, our 2022 medical mission focused on addressing the healthcare backlog in Lagos communities. We provided comprehensive medical services including COVID-19 education and vaccination support.",
    impact: "4,200+ patients served",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    videos: [
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "2022 Medical Mission Highlights",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Community Impact - 2022",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Volunteer Testimonials - 2022",
      },
    ],
  },
  {
    year: "2018",
    title: "Medical Mission 2018",
    location: "Lagos, Nigeria",
    date: "May 5-15, 2018",
    participants: "110+ healthcare professionals",
    description:
      "The 2018 medical mission was our largest to date, with a special focus on maternal and child health. We established temporary clinics in six different communities across Lagos State, providing a wide range of medical services.",
    impact: "6,500+ patients served",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    videos: [
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "2018 Mission Opening Ceremony",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Pediatric Care Services",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Surgical Procedures Highlight",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Community Outreach Program",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Volunteer Interviews",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Closing Ceremony and Impact Report",
      },
    ],
  },
  {
    year: "2016",
    title: "Medical Mission 2016",
    location: "Lagos, Nigeria",
    date: "June 12-20, 2016",
    participants: "85+ healthcare professionals",
    description:
      "The 2016 medical mission introduced specialized eye care services and expanded our dental program. We partnered with local healthcare facilities to provide follow-up care for patients with chronic conditions.",
    impact: "3,800+ patients served",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    videos: [
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "2016 Medical Mission Documentary",
      },
    ],
  },
  {
    year: "2012",
    title: "Medical Mission 2012",
    location: "Lagos, Nigeria",
    date: "July 8-15, 2012",
    participants: "70+ healthcare professionals",
    description:
      "The 2012 mission focused on preventive healthcare education alongside medical services. We conducted workshops on hygiene, nutrition, and disease prevention in local schools and community centers.",
    impact: "3,200+ patients served",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    videos: [
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "2012 Medical Mission Overview",
      },
    ],
  },
  {
    year: "2010",
    title: "Medical Mission 2010",
    location: "Lagos, Nigeria",
    date: "August 15-22, 2010",
    participants: "60+ healthcare professionals",
    description:
      "The 2010 medical mission expanded our services to include mental health support and counseling. We also distributed essential medications and medical supplies to local clinics to support ongoing healthcare delivery.",
    impact: "2,800+ patients served",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    videos: [
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "2010 Mission Highlights",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Patient Stories - 2010",
      },
      {
        thumbnail: "/placeholder.svg?height=400&width=600",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Healthcare Education Program",
      },
    ],
  },
  {
    year: "2008",
    title: "Medical Mission 2008",
    location: "Lagos, Nigeria",
    date: "September 5-12, 2008",
    participants: "45+ healthcare professionals",
    description:
      "Our inaugural medical mission in 2008 laid the foundation for our ongoing healthcare initiatives. Despite limited resources, we provided basic medical care and established relationships with local healthcare providers that continue to this day.",
    impact: "1,500+ patients served",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    videos: [],
  },
]

export default function MedicalMissionPage() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselIndexes, setCarouselIndexes] = useState({})
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  // Initialize carousel indexes for each year
  useEffect(() => {
    const initialIndexes = {}
    medicalMissions.forEach((mission) => {
      initialIndexes[mission.year] = 0
    })
    setCarouselIndexes(initialIndexes)
  }, [])

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

  const handlePrevImage = (year) => {
    setCarouselIndexes((prev) => {
      const currentIndex = prev[year]
      const mission = medicalMissions.find((m) => m.year === year)
      const imagesLength = mission.images.length
      return {
        ...prev,
        [year]: currentIndex === 0 ? imagesLength - 1 : currentIndex - 1,
      }
    })
  }

  const handleNextImage = (year) => {
    setCarouselIndexes((prev) => {
      const currentIndex = prev[year]
      const mission = medicalMissions.find((m) => m.year === year)
      const imagesLength = mission.images.length
      return {
        ...prev,
        [year]: currentIndex === imagesLength - 1 ? 0 : currentIndex + 1,
      }
    })
  }

  const openVideoModal = (video) => {
    setSelectedVideo(video)
    setVideoModalOpen(true)
  }

  const openImageModal = (mission, index) => {
    setSelectedImage(mission)
    setCurrentImageIndex(index)
    setImageModalOpen(true)
  }

  const handlePrevModalImage = () => {
    if (!selectedImage) return
    const imagesLength = selectedImage.images.length
    setCurrentImageIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1))
  }

  const handleNextModalImage = () => {
    if (!selectedImage) return
    const imagesLength = selectedImage.images.length
    setCurrentImageIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1))
  }

  return (
    <div className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1200"
            alt="Medical Mission"
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
                <span className="text-[#C8A97E]">Medical Mission</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Medical Mission</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#C8A97E] mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Providing essential healthcare services to underserved communities in Lagos, Nigeria through our annual
                medical missions.
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
                  src="/placeholder.svg?height=800&width=1200"
                  alt="Medical Mission Overview"
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
                Our <span className="text-[#C8A97E]">Medical Missions</span>
              </h2>
              <div className="h-1 w-20 bg-[#C8A97E] mb-6"></div>
              <p className="text-gray-600">
                Since 2008, Eko Club International has organized annual medical missions to Lagos, Nigeria, providing
                free healthcare services to underserved communities. Our team of volunteer healthcare professionals,
                including doctors, nurses, pharmacists, and other specialists, work tirelessly to address the healthcare
                needs of thousands of individuals who otherwise would not have access to quality medical care.
              </p>
              <p className="text-gray-600">
                Our medical missions offer a wide range of services, including general consultations, specialized care,
                surgeries, dental services, eye care, and distribution of medications. We also conduct health education
                workshops to promote preventive healthcare practices within the communities we serve.
              </p>
              <p className="text-gray-600">
                Over the years, our medical missions have grown in scope and impact, serving more than 25,000 patients
                across various communities in Lagos. We continue to expand our services and reach more communities with
                each mission, guided by our commitment to improving healthcare access and outcomes for all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Years Sections */}
      {medicalMissions.map((mission, missionIndex) => (
        <section key={mission.year} className={`py-20 ${missionIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Medical Mission <span className="text-[#C8A97E]">{mission.year}</span>
              </h2>
              <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInFromLeft}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-800">{mission.title}</h3>
                <p className="text-gray-600">{mission.description}</p>

                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Location:</span> {mission.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Date:</span> {mission.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Team:</span> {mission.participants}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#C8A97E]/10 rounded-lg">
                  <p className="text-lg font-medium text-[#C8A97E]">Impact: {mission.impact}</p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInFromRight}
                className="relative"
              >
                {mission.images.length > 0 && (
                  <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndexes[mission.year]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={mission.images[carouselIndexes[mission.year]] || "/placeholder.svg"}
                          alt={`${mission.title} Image ${carouselIndexes[mission.year] + 1}`}
                          fill
                          className="object-cover cursor-pointer"
                          onClick={() => openImageModal(mission, carouselIndexes[mission.year])}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {mission.images.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrevImage(mission.year)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-[#C8A97E] transition-colors z-10"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => handleNextImage(mission.year)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-[#C8A97E] transition-colors z-10"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Videos Section */}
            {mission.videos.length > 0 && (
              <div className="mt-16">
                <motion.h3
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeIn}
                  className="text-2xl font-bold text-gray-800 mb-8 text-center"
                >
                  Videos from {mission.year} Mission
                </motion.h3>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {mission.videos.map((video, index) => (
                    <motion.div
                      key={index}
                      variants={scaleIn}
                      className="relative group cursor-pointer"
                      onClick={() => openVideoModal(video)}
                    >
                      <div className="relative h-[220px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                          <div className="bg-white/90 rounded-full p-4 group-hover:bg-[#C8A97E] transition-colors">
                            <Play className="h-8 w-8 text-gray-800 group-hover:text-white" />
                          </div>
                        </div>
                      </div>
                      <h4 className="mt-3 text-lg font-medium text-gray-800 group-hover:text-[#C8A97E] transition-colors">
                        {video.title}
                      </h4>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Gallery Section */}
            {mission.images.length > 0 && mission.year !== "2024" && (
              <div className="mt-16">
                <motion.h3
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeIn}
                  className="text-2xl font-bold text-gray-800 mb-8 text-center"
                >
                  Gallery from {mission.year} Mission
                </motion.h3>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {mission.images.map((image, index) => (
                    <motion.div
                      key={index}
                      variants={scaleIn}
                      className="relative group cursor-pointer"
                      onClick={() => openImageModal(mission, index)}
                    >
                      <div className="relative h-[180px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${mission.title} Image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/80 rounded-full p-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 bg-[#C8A97E]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Support Our Medical Missions</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Help us continue providing essential healthcare services to underserved communities in Lagos. Your support
              makes a difference in the lives of thousands of individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#C8A97E] hover:bg-gray-100 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/#contact">Contact Us</Link>
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
                width="100%"
                height="100%"
                src={selectedVideo.url}
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

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 bg-black overflow-hidden">
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute right-4 top-4 z-10 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative h-[80vh] w-full">
            {selectedImage && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selectedImage.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${selectedImage.title} Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            )}

            {selectedImage && selectedImage.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevModalImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-[#C8A97E] transition-colors z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNextModalImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-[#C8A97E] transition-colors z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white">
                  <span>
                    {currentImageIndex + 1} / {selectedImage.images.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

