"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Play,
  Calendar,
  MapPin,
  X,
  Utensils,
  Truck,
  Leaf,
  Heart,
  Users,
  ArrowRight,
  ChevronLeft,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FoodPalliativePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [activeTab, setActiveTab] = useState("distribution")
  const [visibleTestimonial, setVisibleTestimonial] = useState(0)
  const videoRef = useRef(null)

  // Sample videos data
  const videos = [
    {
      id: 1,
      title: "Emergency Food Relief",
      description:
        "Our rapid response team delivering essential food supplies to communities affected by flooding in Lagos.",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Community Food Bank",
      description: "Inside our community food bank operations that serve thousands of families each month.",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 3,
      title: "Sustainable Farming Initiative",
      description:
        "How our agricultural training program is helping communities grow their own food and achieve food security.",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  ]

  // Sample program data
  const programs = {
    distribution: {
      title: "Food Distribution",
      description:
        "Our food distribution program provides essential food packages to vulnerable families, elderly individuals, and those facing economic hardship. Each package contains nutritionally balanced items to sustain a family for up to two weeks.",
      stats: [
        { value: "25,000+", label: "Food Packages Distributed" },
        { value: "5,000+", label: "Families Served Monthly" },
        { value: "12", label: "Distribution Centers" },
      ],
      image: "/placeholder.svg?height=600&width=800",
    },
    foodbank: {
      title: "Community Food Banks",
      description:
        "Our network of community food banks serves as reliable sources of nutritious food for those in need. These centers not only distribute food but also provide nutrition education and connect individuals to additional support services.",
      stats: [
        { value: "8", label: "Food Banks Established" },
        { value: "120,000+", label: "Meals Provided" },
        { value: "300+", label: "Volunteers Engaged" },
      ],
      image: "/placeholder.svg?height=600&width=800",
    },
    agriculture: {
      title: "Agricultural Initiatives",
      description:
        "Our agricultural initiatives focus on sustainable farming practices, providing seeds, tools, and training to help communities grow their own food. This approach creates long-term food security and economic opportunities.",
      stats: [
        { value: "15", label: "Community Gardens" },
        { value: "1,200+", label: "Farmers Trained" },
        { value: "35+", label: "Acres Cultivated" },
      ],
      image: "/placeholder.svg?height=600&width=800",
    },
    education: {
      title: "Nutrition Education",
      description:
        "Our nutrition education program teaches families about balanced diets, food preparation, and maximizing nutritional value with limited resources. These skills help communities make the most of available food resources.",
      stats: [
        { value: "3,500+", label: "Workshop Participants" },
        { value: "45+", label: "Schools Engaged" },
        { value: "12", label: "Nutrition Guides Published" },
      ],
      image: "/placeholder.svg?height=600&width=800",
    },
  }

  // Sample timeline data
  const timeline = [
    {
      year: "2018",
      title: "Program Launch",
      description:
        "Initiated emergency food distribution in response to economic challenges affecting vulnerable communities in Lagos.",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      year: "2019",
      title: "First Food Bank",
      description:
        "Established our first community food bank in Mushin, serving over 500 families in its first month of operation.",
      icon: <Truck className="h-6 w-6" />,
    },
    {
      year: "2020",
      title: "COVID-19 Response",
      description:
        "Expanded operations to meet increased need during the pandemic, distributing over 10,000 emergency food packages.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      year: "2021",
      title: "Agricultural Initiative",
      description:
        "Launched our sustainable farming program, providing training and resources for community gardens and small-scale farming.",
      icon: <Leaf className="h-6 w-6" />,
    },
    {
      year: "2022",
      title: "Nutrition Education",
      description: "Introduced comprehensive nutrition education workshops to complement food distribution efforts.",
      icon: <Utensils className="h-6 w-6" />,
    },
    {
      year: "2023",
      title: "Expansion",
      description: "Expanded to 12 distribution centers across Lagos State, reaching more communities in need.",
      icon: <ArrowRight className="h-6 w-6" />,
    },
  ]

  // Sample testimonials
  const testimonials = [
    {
      quote:
        "The food packages we receive have been a lifeline for my family during these difficult times. Beyond just providing food, the nutrition education has helped me prepare more balanced meals for my children with the resources we have.",
      name: "Mrs. Adebisi Ogunleye",
      location: "Mushin, Lagos",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      quote:
        "As a community leader, I've seen firsthand how the food palliative program has reduced hunger in our area. The agricultural training has been particularly impactful, as many families now grow vegetables in small gardens, improving both nutrition and income.",
      name: "Chief Oluwaseun Adeyemi",
      location: "Alimosho, Lagos",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      quote:
        "After losing my job, I didn't know how I would feed my three children. The community food bank not only provided us with nutritious food but also connected me with job training opportunities. I'm now employed and volunteering at the same food bank that helped us.",
      name: "Mr. Tunde Bakare",
      location: "Surulere, Lagos",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Food Distribution Drive",
      date: "July 25, 2024",
      location: "Mushin Community Center, Lagos",
      description: "Monthly distribution of food packages to registered families in the Mushin area.",
    },
    {
      id: 2,
      title: "Nutrition Workshop",
      date: "August 5, 2024",
      location: "Alimosho Primary School, Lagos",
      description: "Educational workshop on preparing nutritious meals with limited resources.",
    },
    {
      id: 3,
      title: "Community Garden Launch",
      date: "August 15, 2024",
      location: "Surulere, Lagos",
      description: "Opening of a new community garden with distribution of seeds and tools to local families.",
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

  const nextTestimonial = () => {
    setVisibleTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setVisibleTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="pt-24 bg-white">
      {/* Hero Section - Different style with overlay text and parallax effect */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <Image
            src="/placeholder.svg?height=1000&width=1600"
            alt="Food Palliative Program"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </motion.div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-left">
              <motion.div variants={fadeIn} className="mb-4">
                <div className="flex items-center gap-2 text-white/80 mb-4">
                  <Link href="/" className="hover:text-[#C8A97E] transition-colors">
                    Home
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link href="/#projects" className="hover:text-[#C8A97E] transition-colors">
                    Our Projects
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-[#C8A97E]">Food Palliative</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  Fighting Hunger, <br />
                  <span className="text-[#C8A97E]">Nourishing Communities</span>
                </h1>
              </motion.div>
              <motion.div variants={fadeIn}>
                <div className="h-1 w-24 bg-[#C8A97E] mb-6"></div>
                <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8">
                  Our Food Palliative Program provides essential nutrition to vulnerable communities while building
                  sustainable food systems for long-term security.
                </p>
                <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none px-8 py-6 text-lg">
                  Get Involved
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden md:block"
            >
              <div className="relative h-[500px] w-full">
                <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-[#C8A97E]/20 rounded-lg"></div>
                <div className="absolute bottom-0 left-0 w-4/5 h-4/5 bg-white rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Food Distribution"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section - Horizontal layout with icons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md"
            >
              <div className="bg-[#C8A97E]/10 p-4 rounded-full">
                <Utensils className="h-8 w-8 text-[#C8A97E]" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">150,000+</div>
                <p className="text-gray-600">Meals Provided</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md"
            >
              <div className="bg-[#C8A97E]/10 p-4 rounded-full">
                <Users className="h-8 w-8 text-[#C8A97E]" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">25,000+</div>
                <p className="text-gray-600">Families Served</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md"
            >
              <div className="bg-[#C8A97E]/10 p-4 rounded-full">
                <Truck className="h-8 w-8 text-[#C8A97E]" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">12</div>
                <p className="text-gray-600">Distribution Centers</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md"
            >
              <div className="bg-[#C8A97E]/10 p-4 rounded-full">
                <Leaf className="h-8 w-8 text-[#C8A97E]" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">15</div>
                <p className="text-gray-600">Community Gardens</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section - Asymmetrical layout */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInFromLeft}
                className="md:col-span-2"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  About Our <span className="text-[#C8A97E]">Food Palliative Program</span>
                </h2>
                <div className="h-1 w-20 bg-[#C8A97E] mb-8"></div>
                <p className="text-gray-600 mb-6">
                  The Eko Club International Food Palliative Program was established in 2018 to address food insecurity
                  in vulnerable communities across Lagos State. What began as an emergency response to economic
                  challenges has evolved into a comprehensive initiative that not only provides immediate food relief
                  but also builds sustainable food systems for long-term security.
                </p>
                <p className="text-gray-600 mb-6">
                  Our approach combines direct food distribution with community food banks, agricultural initiatives,
                  and nutrition education. By addressing both immediate needs and root causes of food insecurity, we
                  create lasting impact that helps communities become more resilient and self-sufficient.
                </p>
                <p className="text-gray-600">
                  Working closely with local leaders, nutritionists, and agricultural experts, we ensure that our
                  interventions are culturally appropriate, nutritionally balanced, and environmentally sustainable. Our
                  goal is not just to feed people today, but to help build food systems that will nourish communities
                  for generations to come.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInFromRight}
                className="relative"
              >
                <div className="sticky top-24">
                  <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl mb-6">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="Food Palliative Overview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#C8A97E] p-6 rounded-lg text-white">
                    <h3 className="text-xl font-bold mb-3">Get Involved</h3>
                    <p className="mb-4">
                      Join us in our mission to fight hunger and build food security in our communities.
                    </p>
                    <Button className="w-full bg-white text-[#C8A97E] hover:bg-gray-100 transition-colors">
                      Volunteer Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Masonry layout */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              See Our <span className="text-[#C8A97E]">Impact</span> in Action
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-white/80">
              Watch these videos to see how our food palliative initiatives are making a difference in communities
              across Lagos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromLeft}
              className="md:col-span-7"
            >
              <div
                className="relative aspect-video cursor-pointer rounded-lg overflow-hidden shadow-lg group"
                onClick={() => openVideoModal(videos[0])}
              >
                <Image
                  src={videos[0].thumbnail || "/placeholder.svg"}
                  alt={videos[0].title}
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
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold text-white mb-2">{videos[0].title}</h3>
                  <p className="text-white/80">{videos[0].description}</p>
                </div>
              </div>
            </motion.div>

            <div className="md:col-span-5 space-y-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInFromRight}
                className="relative aspect-video cursor-pointer rounded-lg overflow-hidden shadow-lg group"
                onClick={() => openVideoModal(videos[1])}
              >
                <Image
                  src={videos[1].thumbnail || "/placeholder.svg"}
                  alt={videos[1].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                  <motion.div
                    className="bg-white/90 rounded-full p-4 group-hover:bg-[#C8A97E] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Play className="h-8 w-8 text-gray-800 group-hover:text-white" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg font-bold text-white mb-1">{videos[1].title}</h3>
                  <p className="text-white/80 text-sm">{videos[1].description}</p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInFromRight}
                className="relative aspect-video cursor-pointer rounded-lg overflow-hidden shadow-lg group"
                onClick={() => openVideoModal(videos[2])}
              >
                <Image
                  src={videos[2].thumbnail || "/placeholder.svg"}
                  alt={videos[2].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                  <motion.div
                    className="bg-white/90 rounded-full p-4 group-hover:bg-[#C8A97E] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Play className="h-8 w-8 text-gray-800 group-hover:text-white" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg font-bold text-white mb-1">{videos[2].title}</h3>
                  <p className="text-white/80 text-sm">{videos[2].description}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section - Tabbed interface */}
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
              Explore our comprehensive approach to addressing food insecurity through these key programs.
            </p>
          </motion.div>

          <Tabs defaultValue="distribution" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-gray-100 p-1 rounded-full">
                <TabsTrigger
                  value="distribution"
                  className="rounded-full data-[state=active]:bg-[#C8A97E] data-[state=active]:text-white px-6 py-2"
                >
                  Distribution
                </TabsTrigger>
                <TabsTrigger
                  value="foodbank"
                  className="rounded-full data-[state=active]:bg-[#C8A97E] data-[state=active]:text-white px-6 py-2"
                >
                  Food Banks
                </TabsTrigger>
                <TabsTrigger
                  value="agriculture"
                  className="rounded-full data-[state=active]:bg-[#C8A97E] data-[state=active]:text-white px-6 py-2"
                >
                  Agriculture
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="rounded-full data-[state=active]:bg-[#C8A97E] data-[state=active]:text-white px-6 py-2"
                >
                  Education
                </TabsTrigger>
              </TabsList>
            </div>

            {Object.entries(programs).map(([key, program]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{program.title}</h3>
                      <p className="text-gray-600 mb-8">{program.description}</p>

                      <div className="grid grid-cols-3 gap-4">
                        {program.stats.map((stat, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-[#C8A97E] mb-2">{stat.value}</div>
                            <p className="text-gray-600 text-sm">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-1 md:order-2">
                      <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                        <Image
                          src={program.image || "/placeholder.svg"}
                          alt={program.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Timeline Section */}
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
              Our <span className="text-[#C8A97E]">Journey</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              From emergency response to sustainable food systems, explore the evolution of our Food Palliative Program.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform md:translate-x-[-50%] hidden md:block"></div>

            {/* Timeline Events */}
            <div className="relative z-10 space-y-12">
              {timeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={index % 2 === 0 ? fadeInFromLeft : fadeInFromRight}
                  className="relative"
                >
                  <div
                    className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                  >
                    <div className="hidden md:flex items-center justify-center w-full md:w-1/2 p-4">
                      <div
                        className={`bg-white p-6 rounded-lg shadow-lg border-t-4 ${index % 2 === 0 ? "border-[#C8A97E]" : "border-[#8A6D3B]"} max-w-md`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`p-3 rounded-full ${index % 2 === 0 ? "bg-[#C8A97E]" : "bg-[#8A6D3B]"} text-white`}
                          >
                            {event.icon}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-500">{event.year}</span>
                            <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>

                    {/* Timeline Dot - Desktop */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full ${index % 2 === 0 ? "bg-[#C8A97E]" : "bg-[#8A6D3B]"} border-4 border-white shadow z-10 flex items-center justify-center text-white`}
                      >
                        {event.icon}
                      </div>
                    </div>

                    {/* Mobile Version */}
                    <div className="md:hidden flex items-start gap-4 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#C8A97E] w-full">
                      <div className="p-3 rounded-full bg-[#C8A97E] text-white shrink-0">{event.icon}</div>
                      <div>
                        <span className="text-sm font-semibold text-gray-500">{event.year}</span>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>

                    <div className="hidden md:block w-full md:w-1/2"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Carousel */}
      <section className="py-20 bg-[#C8A97E]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Community <span className="text-white/80">Voices</span>
            </h2>
            <div className="h-1 w-20 bg-white mx-auto mb-8"></div>
            <p className="text-white/80">
              Hear from community members whose lives have been impacted by our Food Palliative Program.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={visibleTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg p-8 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#C8A97E]/30">
                      <Image
                        src={testimonials[visibleTestimonial].image || "/placeholder.svg"}
                        alt={testimonials[visibleTestimonial].name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 italic mb-6 text-lg">"{testimonials[visibleTestimonial].quote}"</p>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{testimonials[visibleTestimonial].name}</h4>
                        <p className="text-[#C8A97E]">{testimonials[visibleTestimonial].location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setVisibleTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === visibleTestimonial ? "bg-white" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Accordion */}
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
              Upcoming <span className="text-[#C8A97E]">Events</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Join us at these upcoming events and be part of our mission to fight hunger and build food security.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full">
              {upcomingEvents.map((event, index) => (
                <motion.div key={event.id} variants={scaleIn}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between text-left w-full">
                        <h3 className="text-lg font-medium">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 md:mt-0">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-[#C8A97E]" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-[#C8A97E]" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors">
                        Register Now
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Split design */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInFromLeft}
            className="bg-gray-900 text-white p-12 md:p-20 flex items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Donate to Support Our Cause</h2>
              <p className="text-white/80 mb-8">
                Your financial contribution helps us provide food to those in need and build sustainable food systems in
                our communities.
              </p>
              <Button
                className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors rounded-none px-8 py-6 text-lg"
                asChild
              >
                <Link href="/donate">Donate Now</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInFromRight}
            className="bg-[#C8A97E] text-white p-12 md:p-20 flex items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Volunteer With Us</h2>
              <p className="text-white/80 mb-8">
                Join our team of dedicated volunteers who help distribute food, maintain community gardens, and educate
                communities about nutrition.
              </p>
              <Button
                className="bg-white text-[#C8A97E] hover:bg-gray-100 transition-colors rounded-none px-8 py-6 text-lg"
                asChild
              >
                <Link href="/#contact">Get Involved</Link>
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

