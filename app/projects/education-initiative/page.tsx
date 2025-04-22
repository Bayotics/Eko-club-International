"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Play,
  X,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  BookText,
  School,
  Lightbulb,
  Laptop,
  PenTool,
  Target,
} from "lucide-react"

export default function EducationInitiativePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const videoRef = useRef<HTMLIFrameElement>(null)

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const openVideoModal = () => {
    setVideoModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
    document.body.style.overflow = "auto"
    if (videoRef.current && videoRef.current.src) {
      // Reset iframe src to stop video
      videoRef.current.src = videoRef.current.src
    }
  }

  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="min-h-screen bg-white pt-20 mt-5">
      {/* Breadcrumb with academic styling */}
      <div className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] border-b border-gray-200 py-5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-[#C8A97E] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link href="/#projects" className="text-gray-600 hover:text-[#C8A97E] transition-colors">
              Our Projects
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-[#C8A97E]">Education Initiative</span>
          </div>
        </div>
      </div>

      {/* Hero Section with bookshelf design */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#1A3A5F] opacity-90 z-0">
          {/* Decorative book pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
            }}
          ></div>
        </div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              className="lg:col-span-7 text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Empowering Through <span className="text-[#C8A97E]">Education</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl">
                Building a brighter future through accessible, quality education for all. Our initiative focuses on
                creating sustainable educational opportunities that transform lives and communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white px-6 py-2 rounded-none">
                  Get Involved
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-none">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-[300px] md:h-[400px] w-full">
                <div className="absolute inset-0 bg-[#0F2A4A] rounded-md shadow-2xl transform -rotate-3 z-0"></div>
                <div className="absolute inset-0 bg-[#C8A97E] rounded-md shadow-2xl transform rotate-3 z-10"></div>
                <div className="absolute inset-0 bg-white rounded-md shadow-2xl z-20">
                  <Image
                    src="/images/Education/1.png?height=400&width=600"
                    alt="Education Initiative"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A5F]/80 to-transparent rounded-md"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-semibold">Transforming Lives</h3>
                    <p className="text-sm text-gray-200">Through quality education</p>
                  </div>
                </div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 bg-[#C8A97E] rounded-full flex items-center justify-center z-30"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <GraduationCap className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#1A3A5F] rounded-full flex items-center justify-center z-30"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section with notebook paper styling */}
      <section className="py-16 md:py-24 bg-[#f8f9fa] relative">
        <div
          className="absolute top-0 left-0 w-full h-6 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}
        ></div>

        {/* Notebook lines background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(#1A3A5F 1px, transparent 1px)",
            backgroundSize: "100% 2rem",
          }}
        ></div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-[#C8A97E] mb-1"></div>
              <div className="h-1 w-12 bg-[#C8A97E] mb-1"></div>
              <div className="h-1 w-8 bg-[#C8A97E]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A3A5F]">Our Educational Mission</h2>
            <p className="text-lg text-gray-700">
              The Eko Club International Education Initiative is dedicated to improving access to quality education,
              supporting educational infrastructure, and providing resources to students and educators in underserved
              communities.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="bg-white p-8 shadow-md border-l-4 border-[#1A3A5F] relative" variants={fadeInUp}>
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#f8f9fa] transform rotate-45 translate-x-6 -translate-y-6"></div>
              <BookText className="h-12 w-12 text-[#C8A97E] mb-4" />
              <h3 className="text-xl font-bold mb-3 text-[#1A3A5F]">Scholarship Programs</h3>
              <p className="text-gray-700 mb-4">
                We provide financial support to promising students who lack the resources to pursue their educational
                dreams, from primary school through university.
              </p>
              {/* <div className="flex items-center text-[#C8A97E] font-medium">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div> */}
            </motion.div>

            <motion.div className="bg-white p-8 shadow-md border-l-4 border-[#C8A97E] relative" variants={fadeInUp}>
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#f8f9fa] transform rotate-45 translate-x-6 -translate-y-6"></div>
              <School className="h-12 w-12 text-[#1A3A5F] mb-4" />
              <h3 className="text-xl font-bold mb-3 text-[#1A3A5F]">School Development</h3>
              <p className="text-gray-700 mb-4">
                We build, renovate, and equip schools with modern facilities and learning resources to create conducive
                environments for education.
              </p>
              {/* <div className="flex items-center text-[#C8A97E] font-medium">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div> */}
            </motion.div>
          </motion.div>

          {/* Quote callout */}
          <motion.div
            className="max-w-4xl mx-auto bg-[#1A3A5F] text-white p-8 md:p-12 relative mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -top-6 -left-6 text-[#C8A97E] text-9xl opacity-20">"</div>
            <div className="relative z-10">
              <p className="text-xl md:text-2xl italic mb-6">
                Education is the most powerful weapon which you can use to change the world. Our initiative aims to
                provide this weapon to as many people as possible.
              </p>
              <div className="flex items-center">
                <div className="h-px flex-grow bg-[#C8A97E] mr-4"></div>
                <p className="text-[#C8A97E] font-medium">Eko Club International</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="bg-white p-6 shadow-md" variants={fadeInUp}>
              <Lightbulb className="h-10 w-10 text-[#C8A97E] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#1A3A5F]">Teacher Training</h3>
              <p className="text-gray-700">
                We provide professional development opportunities for teachers to enhance their skills and teaching
                methodologies.
              </p>
            </motion.div>

            <motion.div className="bg-white p-6 shadow-md" variants={fadeInUp}>
              <Laptop className="h-10 w-10 text-[#C8A97E] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#1A3A5F]">Digital Literacy</h3>
              <p className="text-gray-700">
                We equip students with essential digital skills needed to thrive in today's technology-driven world.
              </p>
            </motion.div>

            <motion.div className="bg-white p-6 shadow-md" variants={fadeInUp}>
              <PenTool className="h-10 w-10 text-[#C8A97E] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#1A3A5F]">Educational Materials</h3>
              <p className="text-gray-700">
                We provide textbooks, stationery, and other learning materials to students who cannot afford them.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Section with book-inspired design */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1A3A5F]">Our Impact in Action</h2>
            <p className="text-lg text-gray-700">
              Watch how our education initiatives are transforming lives and communities through the power of learning.
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Book-inspired video container */}
            <div
              className="relative bg-white shadow-2xl rounded-md overflow-hidden cursor-pointer group"
              onClick={openVideoModal}
            >
              {/* Book spine */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1A3A5F] z-10"></div>

              {/* Book pages effect */}
              <div className="absolute left-8 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-300 to-white z-10"></div>

              {/* Video thumbnail */}
              <div className="relative ml-12 aspect-video">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Education Initiative Video"
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="h-20 w-20 bg-[#C8A97E] rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Play className="h-10 w-10 text-white ml-1" />
                  </motion.div>
                </div>

                {/* Video info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold text-white mb-2">Transforming Education in Lagos</h3>
                  <p className="text-gray-200">
                    See how our initiatives are making a difference in the lives of students
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 md:py-24 bg-[#1A3A5F] text-white relative">
        <div
          className="absolute top-0 left-0 w-full h-6 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)" }}
        ></div>

        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Educational Impact</h2>
            <p className="text-lg text-gray-300">
              Through our dedicated efforts, we've made significant strides in improving educational outcomes.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-sm p-6 rounded-md border border-white/20 text-center"
              variants={fadeInUp}
            >
              <div className="inline-block p-4 bg-[#C8A97E] rounded-full mb-4">
                <School className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-[#C8A97E]">25+</h3>
              <p className="text-gray-300">Schools Built or Renovated</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm p-6 rounded-md border border-white/20 text-center"
              variants={fadeInUp}
            >
              <div className="inline-block p-4 bg-[#C8A97E] rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-[#C8A97E]">5,000+</h3>
              <p className="text-gray-300">Students Supported</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm p-6 rounded-md border border-white/20 text-center"
              variants={fadeInUp}
            >
              <div className="inline-block p-4 bg-[#C8A97E] rounded-full mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-[#C8A97E]">750+</h3>
              <p className="text-gray-300">Scholarships Awarded</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm p-6 rounded-md border border-white/20 text-center"
              variants={fadeInUp}
            >
              <div className="inline-block p-4 bg-[#C8A97E] rounded-full mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-[#C8A97E]">12</h3>
              <p className="text-gray-300">Communities Reached</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-16 md:py-24 bg-[#f8f9fa] relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1A3A5F]">Our Educational Approach</h2>
            <p className="text-lg text-gray-700">
              We follow a comprehensive approach to ensure sustainable educational development.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#C8A97E] transform -translate-x-1/2 z-0 hidden md:block"></div>

            <motion.div
              className="space-y-16"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center" variants={fadeInUp}>
                <div className="md:text-right order-2 md:order-1">
                  <h3 className="text-xl font-bold mb-3 text-[#1A3A5F]">Assess Community Needs</h3>
                  <p className="text-gray-700">
                    We work closely with local communities to understand their specific educational challenges and
                    needs.
                  </p>
                </div>
                <div className="relative order-1 md:order-2">
                  <div className="md:absolute left-0 top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 z-10 w-16 h-16 bg-[#1A3A5F] rounded-full flex items-center justify-center text-white">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <div className="ml-20 md:ml-0">
                    <Image
                      src="/images/Education/2.png?height=300&width=400"
                      alt="Community Assessment"
                      width={400}
                      height={300}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center" variants={fadeInUp}>
                <div className="relative">
                  <div className="md:absolute right-0 top-1/2 transform md:translate-x-1/2 md:-translate-y-1/2 z-10 w-16 h-16 bg-[#1A3A5F] rounded-full flex items-center justify-center text-white">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <div className="ml-20 md:ml-0">
                    <Image
                      src="/images/Education/3.png?height=300&width=400"
                      alt="Develop Programs"
                      width={400}
                      height={300}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A3A5F]">Develop Tailored Programs</h3>
                  <p className="text-gray-700">
                    We create customized educational programs that address the specific needs identified in each
                    community.
                  </p>
                </div>
              </motion.div>

              <motion.div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center" variants={fadeInUp}>
                <div className="md:text-right order-2 md:order-1">
                  <h3 className="text-xl font-bold mb-3 text-[#1A3A5F]">Implement & Support</h3>
                  <p className="text-gray-700">
                    We implement programs with local partners and provide ongoing support to ensure sustainability.
                  </p>
                </div>
                <div className="relative order-1 md:order-2">
                  <div className="md:absolute left-0 top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 z-10 w-16 h-16 bg-[#1A3A5F] rounded-full flex items-center justify-center text-white">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <div className="ml-20 md:ml-0">
                    <Image
                      src="/images/Education/4.png?height=300&width=400"
                      alt="Implementation"
                      width={400}
                      height={300}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center" variants={fadeInUp}>
                <div className="relative">
                  <div className="md:absolute right-0 top-1/2 transform md:translate-x-1/2 md:-translate-y-1/2 z-10 w-16 h-16 bg-[#1A3A5F] rounded-full flex items-center justify-center text-white">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <div className="ml-20 md:ml-0">
                    <Image
                      src="/images/projects-education.jpg?height=300&width=400"
                      alt="Measure Impact"
                      width={400}
                      height={300}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A3A5F]">Measure & Improve</h3>
                  <p className="text-gray-700">
                    We continuously evaluate our programs' impact and make improvements based on results and feedback.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1A3A5F]">Upcoming Educational Events</h2>
            <p className="text-lg text-gray-700">
              Join us at these upcoming events to support and learn more about our educational initiatives.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="bg-[#f8f9fa] overflow-hidden shadow-md group" variants={fadeInUp}>
              <div className="h-2 bg-[#C8A97E]"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-[#1A3A5F] mr-2" />
                  <span className="text-gray-600 font-medium">June 15, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1A3A5F] group-hover:text-[#C8A97E] transition-colors">
                  Annual Scholarship Award Ceremony
                </h3>
                <p className="text-gray-700 mb-4">
                  Join us as we award scholarships to deserving students and celebrate their academic achievements.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">2:00 PM - 5:00 PM</span>
                  </div>
                  {/* <Button variant="link" className="text-[#C8A97E] p-0 hover:text-[#8A6D3B]">
                    Learn More
                  </Button> */}
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-[#f8f9fa] overflow-hidden shadow-md group" variants={fadeInUp}>
              <div className="h-2 bg-[#1A3A5F]"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-[#1A3A5F] mr-2" />
                  <span className="text-gray-600 font-medium">July 8, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1A3A5F] group-hover:text-[#C8A97E] transition-colors">
                  Teacher Training Workshop
                </h3>
                <p className="text-gray-700 mb-4">
                  A professional development workshop for teachers focusing on innovative teaching methodologies.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">9:00 AM - 4:00 PM</span>
                  </div>
                  {/* <Button variant="link" className="text-[#C8A97E] p-0 hover:text-[#8A6D3B]">
                    Learn More
                  </Button> */}
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-[#f8f9fa] overflow-hidden shadow-md group" variants={fadeInUp}>
              <div className="h-2 bg-[#C8A97E]"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-[#1A3A5F] mr-2" />
                  <span className="text-gray-600 font-medium">August 22, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1A3A5F] group-hover:text-[#C8A97E] transition-colors">
                  School Supplies Distribution
                </h3>
                <p className="text-gray-700 mb-4">
                  Help us distribute school supplies to students in need as they prepare for the new academic year.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">10:00 AM - 2:00 PM</span>
                  </div>
                  {/* <Button variant="link" className="text-[#C8A97E] p-0 hover:text-[#8A6D3B]">
                    Learn More
                  </Button> */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-[#1A3A5F] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Educational Mission</h2>
              <p className="text-lg text-gray-300 mb-8">
                Your support can help us provide quality education to more children and communities. Together, we can
                build a brighter future through education.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white px-8 py-2 rounded-none">
                  Donate Now
                </Button>
                <Button variant="outline" className="border-white text-gray-500 hover:bg-white/10 rounded-none">
                  Volunteer
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-md border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-[#C8A97E]">How Your Support Helps</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#C8A97E] rounded-full p-1 mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>$50 provides school supplies for one student for a year</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#C8A97E] rounded-full p-1 mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>$200 funds a teacher training workshop</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#C8A97E] rounded-full p-1 mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>$500 provides a scholarship for one student</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#C8A97E] rounded-full p-1 mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>$5,000 helps renovate a classroom with modern facilities</p>
                </li>
              </ul>
            </motion.div>
          </div>
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
              className="bg-white rounded-lg overflow-hidden w-full max-w-4xl"
              style={{ maxHeight: "50vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video" style={{ height: "calc(50vh - 120px)" }}>
                <iframe
                  ref={videoRef}
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Education Initiative Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="p-4 bg-[#1A3A5F] text-white">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Transforming Education in Lagos</h3>
                  <button onClick={closeVideoModal} className="text-white hover:text-[#C8A97E] transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">
                  See how our education initiatives are making a difference in the lives of students and communities
                  across Lagos.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

