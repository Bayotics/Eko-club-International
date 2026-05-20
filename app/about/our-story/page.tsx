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
      year: "Feb 15, 2000",
      title: "The Genesis Meeting",
      description:
        "Representatives of Eko Club Houston (Otunba T.J. Abass, Yesir Ganiyu, Sam Dipeolu) met with Eko Club Canada members (Alhaji Yekini Agiri, Mrs. Biola Nosiru, Lekan Waheed) at Mrs. Abiola Nosiru's residence. The goal: establish an umbrella organization for all Eko Clubs — a forum to collectively harness resources and drive development in Lagos State.",
    },
    {
      year: "Mar 29 – Apr 3, 2000",
      title: "1st International Convention – Houston",
      description:
        "Eko Club Houston organized the inaugural international convention under the theme \"Enhancing Community Development in Lagos State.\" The event attracted the Governor of Lagos State, the Speaker of the Lagos House of Assembly, and senior government functionaries. The Governor also met Houston's business community to promote investment in Lagos.",
    },
    {
      year: "April 3, 2000",
      title: "Official Inauguration of ECI",
      description:
        "Eko Club International was officially inaugurated comprising Eko Club Canada, Houston, Los Angeles, Indianapolis, Lagosians of Chicago, Eko Club London, and Eko Club New Hampshire. Interim leadership: Otunba Sam Dipeolu (Chairman), Prince Adelani Adeniji Adele (Interim President), Mr. Wahab Owokoniran (VP), Otunba T.J. Abass (General Secretary). Massey Street Children Hospital was adopted as ECI's pet project, with over $80,000 in donated equipment.",
    },
    {
      year: "Oct 17, 2000",
      title: "Non-Profit Registration",
      description:
        "Eko Club International was officially registered as a non-profit organization with the State of Texas.",
    },
    {
      year: "June 2001",
      title: "2nd Annual Convention – Canada",
      description:
        "Held in Canada with chapters from Atlanta, Boston, Canada, Dallas, Houston, New Jersey, New York, Rhode Island, and Egbe Omo Eko Florida in attendance. An election ushered in the dynamic leadership of Alhaji Olusesi Dawodu as ECI's first elected President.",
    },
    {
      year: "3rd Convention",
      title: "3rd Annual Convention – Atlanta",
      description:
        "Eko Club Atlanta hosted the 3rd annual convention. The Governor of Lagos State attended alongside top officials. The economic session fortified Atlanta–Lagos sister-city ties and showcased investment opportunities. The pet project was the computerization of L.A.S.U. On August 15th, elections ushered in the administration of Attorney O.J. Lawal.",
    },
    {
      year: "2007",
      title: "First ECI Medical Mission",
      description:
        "Eko Club International launched its first Medical Mission, delivering free healthcare services to communities in Lagos, Nigeria — a program that has since become one of ECI's most celebrated and impactful annual initiatives.",
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
                <span className="text-[#c8a400]">Our Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Our Story</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#c8a400] mx-auto mb-6"></div>
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
                How It All <span className="text-[#c8a400]">Began</span>
              </h2>
              <div className="h-1 w-20 bg-[#c8a400] mb-8"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The genesis of Eko Club International can be attributed to the vision of a group of Lagosians from Eko
                Club Houston and Canada. The trio of Sam Dipeolu, T.J. Abass and Yesir Ganiyu represented Eko Club
                Houston at a historic meeting with members of Eko Club Canada, held at Mrs. Abiola Nosiru's residence
                on <strong>February 15th, 2000</strong>.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The goal of the meeting was to highlight the significance of having an umbrella organization for all Eko
                Clubs — a forum for collectively harnessing limitless resources and a dependable partner in bringing
                about development, economic well-being, and unity among its members and their beloved state.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At that meeting, a resolution was reached to officially register ECI in the U.S.A. At the time, there
                were only four chapters: Eko Club Canada, Eko Club Houston, Eko Club New York, and Lagosians of
                Chicago. Today, ECI has grown into a global network spanning multiple continents.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#c8a400]/10 text-[#c8a400]">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Established</h3>
                    <p className="text-gray-600">2000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#c8a400]/10 text-[#c8a400]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Members</h3>
                    <p className="text-gray-600">5,000+</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#c8a400]/10 text-[#c8a400]">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Chapters</h3>
                    <p className="text-gray-600">25 Worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-[#c8a400]/10 text-[#c8a400]">
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
            <div className="h-1 w-20 bg-[#c8a400] mx-auto mb-8"></div>
            <p className="text-gray-600">
              For over two decades, Eko Club International has grown from a small gathering of like-minded individuals
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
                          index % 2 === 0 ? "bg-[#c8a400]" : "bg-[#8A6D3B]"
                        }`}
                      >
                        {event.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#c8a400] border-4 border-white shadow"></div>
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
              The <span className="text-[#c8a400]">Founders</span>
            </h2>
            <div className="h-1 w-20 bg-[#c8a400] mx-auto mb-8"></div>
            <p className="text-gray-300">
              Eko Club International was brought to life by visionary Lagosians who believed in the power of unity and
              community. Their leadership in those early days laid the foundation for everything ECI stands for today.
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
                <Image src="/images/Presidents/Late-dawodu1.jpg" alt="Alhaji Olusesi Dawodu" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Alhaji Olusesi Dawodu</h3>
                <p className="text-[#c8a400] mb-4">1st Elected President (2001–2003)</p>
                <p className="text-gray-300">
                  Elected at the 2nd Annual Convention in Canada, Alhaji Dawodu's dynamic leadership steered ECI
                  through its formative years and set a standard of excellence for all who followed.
                </p>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="h-80 flex flex-col items-center justify-center bg-gray-700">
                <div className="w-24 h-24 rounded-full bg-[#c8a400]/20 flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-[#c8a400]" />
                </div>
                <p className="text-white font-semibold text-lg text-center px-4">Otunba Sam Dipeolu</p>
                <p className="text-[#c8a400] text-sm mt-1">Interim Chairman</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Otunba Sam Dipeolu</h3>
                <p className="text-[#c8a400] mb-4">Interim Chairman</p>
                <p className="text-gray-300">
                  One of the Houston trio who initiated the February 2000 genesis meeting, Otunba Dipeolu served as
                  ECI's first Interim Chairman following the official inauguration in April 2000.
                </p>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="h-80 flex flex-col items-center justify-center bg-gray-700">
                <div className="w-24 h-24 rounded-full bg-[#c8a400]/20 flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-[#c8a400]" />
                </div>
                <p className="text-white font-semibold text-lg text-center px-4">Prince Adelani Adeniji Adele</p>
                <p className="text-[#c8a400] text-sm mt-1">1st Interim President</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Prince Adelani Adeniji Adele</h3>
                <p className="text-[#c8a400] mb-4">1st Interim President</p>
                <p className="text-gray-300">
                  Appointed as the first Interim President of ECI at its inauguration on April 3rd, 2000, Prince
                  Adelani provided foundational presidential leadership that guided the organization in its earliest days.
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

