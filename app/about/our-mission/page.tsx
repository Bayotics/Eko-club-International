"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Target, Globe, Award, Users, Lightbulb, Shield, HandHeart, BookOpen } from "lucide-react"

export default function OurMissionPage() {
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

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Integrity",
      description:
        "We uphold the highest standards of honesty, transparency, and ethical conduct in all our activities.",
    },
    {
      icon: <HandHeart className="h-8 w-8" />,
      title: "Service",
      description: "We are committed to serving our communities and making a positive impact on the lives of others.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Unity",
      description:
        "We foster unity and collaboration among our members and communities, recognizing that together we are stronger.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Cultural Preservation",
      description:
        "We are dedicated to preserving and promoting the rich cultural heritage of Lagos for future generations.",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "We embrace innovation and creative solutions to address the evolving needs of our communities.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for excellence in all our endeavors, setting high standards and continuously improving.",
    },
  ]

  return (
    <div className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/gallery-community.jpg" alt="Eko Club members" fill className="object-cover" priority />
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
                <Link href="/#about" className="hover:text-[#C8A97E] transition-colors">
                  About
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#C8A97E]">Our Mission</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Our Mission</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#C8A97E] mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Guided by our core values, we strive to make a meaningful difference in our communities while preserving
                our cultural heritage.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromLeft}
              className="order-2 md:order-1"
            >
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-[#C8A97E] text-white">
                      <Target className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                  </div>
                  <div className="h-1 w-20 bg-[#C8A97E] mb-6"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Eko Club International is dedicated to preserving and promoting the rich cultural heritage of Lagos,
                    Nigeria, while fostering unity, community development, and social welfare among our members and the
                    broader community.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    We are committed to implementing sustainable development projects that address the needs of our
                    communities, providing educational opportunities for the next generation, and creating platforms for
                    cultural exchange and networking among Lagos indigenes worldwide.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-[#C8A97E] text-white">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
                  </div>
                  <div className="h-1 w-20 bg-[#C8A97E] mb-6"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Our vision is to be the premier cultural organization that connects people of Lagos heritage
                    worldwide, creating a global network that supports community development, cultural preservation, and
                    social welfare initiatives.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    We envision a future where Lagos culture is celebrated globally, where our communities thrive
                    through sustainable development, and where our members are empowered to make meaningful
                    contributions to society.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromRight}
              className="order-1 md:order-2"
            >
              <div className="relative h-[600px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/mission-card.jpeg"
                  alt="Eko Club members at an event"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
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
              Our <span className="text-[#C8A97E]">Core Values</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Our core values guide our actions, decisions, and interactions as we work towards fulfilling our mission
              and vision. They represent the principles that define who we are as an organization.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#C8A97E] hover:shadow-xl transition-shadow"
              >
                <div className="text-[#C8A97E] mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Strategic Goals Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromRight}
            >
              <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image src="/images/mission-card-2.jpg" alt="Eko Club community project" fill className="object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromLeft}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Our <span className="text-[#C8A97E]">Strategic Goals</span>
              </h2>
              <div className="h-1 w-20 bg-[#C8A97E] mb-8"></div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E]">
                    <span className="text-xl font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Cultural Preservation</h3>
                    <p className="text-gray-600">
                      Develop programs and initiatives that document, preserve, and promote Lagos cultural heritage,
                      traditions, and history.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E]">
                    <span className="text-xl font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Development</h3>
                    <p className="text-gray-600">
                      Implement sustainable development projects that address critical needs in healthcare, education,
                      infrastructure, and economic empowerment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E]">
                    <span className="text-xl font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Global Network</h3>
                    <p className="text-gray-600">
                      Expand our global presence by establishing new chapters and strengthening existing ones to create
                      a robust network of Lagos indigenes worldwide.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E]">
                    <span className="text-xl font-bold">04</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Youth Empowerment</h3>
                    <p className="text-gray-600">
                      Develop programs that engage and empower the next generation of leaders, ensuring the continuity
                      of our cultural heritage and organizational mission.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
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
              Our <span className="text-[#C8A97E]">Impact</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-300">
              Through our mission-driven initiatives, we have made significant impacts in our communities. Here are some
              of our key achievements:
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={scaleIn} className="text-center">
              <div className="text-[#C8A97E] text-5xl font-bold mb-2">25K+</div>
              <div className="text-xl font-medium mb-2">Lives Impacted</div>
              <p className="text-gray-400">Through our medical missions and healthcare initiatives</p>
            </motion.div>

            <motion.div variants={scaleIn} className="text-center">
              <div className="text-[#C8A97E] text-5xl font-bold mb-2">500+</div>
              <div className="text-xl font-medium mb-2">Scholarships</div>
              <p className="text-gray-400">Awarded to deserving students to pursue their education</p>
            </motion.div>

            <motion.div variants={scaleIn} className="text-center">
              <div className="text-[#C8A97E] text-5xl font-bold mb-2">100+</div>
              <div className="text-xl font-medium mb-2">Projects</div>
              <p className="text-gray-400">Community development projects implemented across various regions</p>
            </motion.div>

            <motion.div variants={scaleIn} className="text-center">
              <div className="text-[#C8A97E] text-5xl font-bold mb-2">15+</div>
              <div className="text-xl font-medium mb-2">Countries</div>
              <p className="text-gray-400">Where our members actively promote Lagos culture and heritage</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#C8A97E]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join Our Mission</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Be part of our mission to preserve cultural heritage and create positive change in our communities.
              Together, we can make a lasting impact for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#C8A97E] hover:bg-gray-100 px-8 py-6 text-lg rounded-none" asChild>
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

