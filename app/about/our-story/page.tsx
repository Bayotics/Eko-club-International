"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Calendar, Users, Award, Heart } from "lucide-react"

export default function OurStoryPage() {
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

  const timelineEvents = [
    {
      year: "1999",
      title: "Foundation",
      description: "Eko Club International was founded by a group of visionary individuals from Lagos.",
    },
    {
      year: "2002",
      title: "First International Chapter",
      description: "The first international chapter was established, expanding our reach globally.",
    },
    {
      year: "2003",
      title: "Major Community Project",
      description: "Launched our first major community development project in Lagos.",
    },
    {
      year: "2008",
      title: "Educational Initiative",
      description: "Started our scholarship program to support underprivileged students.",
    },
    {
      year: "2012",
      title: "Healthcare Mission",
      description: "Initiated our annual medical mission providing free healthcare services.",
    },
    {
      year: "2018",
      title: "Digital Transformation",
      description: "Embraced digital platforms to connect members worldwide and enhance our impact.",
    },
  ]

  return (
    <div className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-slide-2.png" alt="Eko Club members" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="mb-4">
              <div className="flex items-center justify-center gap-2 text-white/80 mb-4">
                <Link href="/" className="hover:text-[#e4e66d] transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/#about" className="hover:text-[#e4e66d] transition-colors">
                  About
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#f0f359]">Our Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Our Story</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#f0f359] mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Discover the journey of Eko Club International, from our humble beginnings to becoming a leading
                cultural and community organization.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
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
                  src="/images/hero-slide-3.png"
                  alt="Eko Club members in yellow shirts"
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
              className="max-w-xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Our <span className="text-[#f0f359]">Mission</span> & Vision
              </h2>
              <div className="h-1 w-20 bg-[#f0f359] mb-8"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since our founding, Eko Club International has been dedicated to preserving and promoting the rich
                cultural heritage of Lagos while fostering unity, community development, and social welfare among our
                members and the broader community.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our vision is to be the premier cultural organization that connects people of Lagos heritage worldwide,
                creating a global network that supports community development, cultural preservation, and social welfare
                initiatives.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#f0f359]/10 text-[#f0f359]">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Established</h3>
                    <p className="text-gray-600">1999</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#f0f359]/10 text-[#f0f359]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Members</h3>
                    <p className="text-gray-600">5,000+</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#f0f359]/10 text-[#f0f359]">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Chapters</h3>
                    <p className="text-gray-600">15 Worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#f0f359]/10 text-[#f0f359]">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Projects</h3>
                    <p className="text-gray-600">100+ Completed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
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
              Our <span className="text-[#d0d331]">Journey</span> Through Time
            </h2>
            <div className="h-1 w-20 bg-[#f0f359] mx-auto mb-8"></div>
            <p className="text-gray-600">
              For over four decades, Eko Club International has grown from a small gathering of like-minded individuals
              to a global organization with chapters across multiple countries. Explore our rich history and milestones.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>

            {/* Timeline Events */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="relative z-10"
            >
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className={`mb-12 flex items-center ${index % 2 === 0 ? "flex-row md:flex-row-reverse" : "flex-row"}`}
                >
                  <div className="w-full md:w-1/2 px-4 md:px-8">
                    <div
                      className={`p-6 rounded-lg shadow-lg bg-white border-t-4 ${
                        index % 2 === 0 ? "border-[#e1e43f]" : "border-[#8A6D3B]"
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-2 rounded-full text-white text-sm font-semibold mb-4 ${
                          index % 2 === 0 ? "bg-[#f0f359]" : "bg-[#8A6D3B]"
                        }`}
                      >
                        {event.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#f0f359] border-4 border-white shadow"></div>
                  </div>
                  <div className="w-full md:w-1/2"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
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
              Our <span className="text-[#f0f359]">Founders</span>
            </h2>
            <div className="h-1 w-20 bg-[#f0f359] mx-auto mb-8"></div>
            <p className="text-gray-300">
              Eko Club International was founded by visionary individuals who saw the need to preserve our cultural
              heritage and foster unity among our people. Their legacy continues to inspire our work today.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={scaleIn} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="relative h-80">
                <Image src="/images/Presidents/Late-dawodu1.jpg" alt="Founder" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Chief Olusesi Dawodu</h3>
                <p className="text-[#f0f359] mb-4">Founding President (2001-2003)</p>
                <p className="text-gray-300">
                  Led the initial formation of Eko Club and established its core values and mission that continue to
                  guide us today.
                </p>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="relative h-80">
                <Image src="/images/Presidents/larry-ojo.jpg" alt="Founder" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Chief Oluwole Johnson</h3>
                <p className="text-[#f0f359] mb-4">Founding Secretary (2001-2005)</p>
                <p className="text-gray-300">
                  Instrumental in developing the club's constitution and establishing its organizational structure.
                </p>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="relative h-80">
                <Image src="/images/Presidents/zainu2.jpg" alt="Founder" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Chief Adebisi Ogunleye</h3>
                <p className="text-[#f0f359] mb-4">Founding Treasurer (2001-2005)</p>
                <p className="text-gray-300">
                  Established the financial framework that has enabled the club to grow and sustain its operations over
                  the decades.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#bcbe39]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Be Part of Our Continuing Story</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Join Eko Club International today and help us write the next chapter of our story. Together, we can
              preserve our heritage and create positive change in our communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#868828] hover:bg-gray-100 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/#membership">Become a Member</Link>
              </Button>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/donate">Support Our Cause</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

