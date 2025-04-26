"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play, Calendar, MapPin, X, Award, Briefcase, Users, GraduationCap } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function WomenForumPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const videoRef = useRef(null)

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

  const openVideoModal = () => {
    setVideoModalOpen(true)
  }

  // Sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Women's Leadership Summit",
      date: "August 15, 2024",
      location: "Lagos, Nigeria",
      description:
        "Join us for a day of inspiration, networking, and skill-building at our annual Women's Leadership Summit.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Entrepreneurship Workshop",
      date: "September 10, 2024",
      location: "Atlanta, GA",
      description: "Learn practical skills and strategies to start or grow your business in this hands-on workshop.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Mentorship Program Launch",
      date: "October 5, 2024",
      location: "Virtual Event",
      description: "Be part of our new mentorship program connecting experienced professionals with emerging leaders.",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  // Sample initiatives data
  const initiatives = [
    {
      title: "Leadership Development",
      description:
        "Empowering women with the skills, knowledge, and confidence to take on leadership roles in their communities and professional lives.",
      icon: <Award className="h-16 w-16 text-[#db2777]" />,
    },
    {
      title: "Entrepreneurship Support",
      description:
        "Providing resources, training, and networking opportunities to help women start and grow successful businesses.",
      icon: <Briefcase className="h-16 w-16 text-[#db2777]" />,
    },
    {
      title: "Mentorship Program",
      description:
        "Connecting experienced professionals with emerging leaders to provide guidance, support, and inspiration.",
      icon: <Users className="h-16 w-16 text-[#db2777]" />,
    },
    {
      title: "Educational Scholarships",
      description:
        "Supporting women's education through scholarships and grants for academic and professional development.",
      icon: <GraduationCap className="h-16 w-16 text-[#db2777]" />,
    },
  ]

  return (
    <div className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/welcome2.jpg" alt="Women Forum" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="mb-4">
              <div className="flex items-center justify-center gap-2 text-white/80 mb-4">
                <Link href="/" className="hover:text-[#db2777] transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/#projects" className="hover:text-[#db2777] transition-colors">
                  Our Projects
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#db2777]">Women Forum</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Women Forum</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#db2777] mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Empowering women through leadership, entrepreneurship, and community engagement.
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
                <Image src="/images/women-forum-card.jpeg" alt="Women Forum Overview" fill className="object-cover" />
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
                About the <span className="text-pink-600">Women Forum</span>
              </h2>
              <div className="h-1 w-20 bg-pink mb-6"></div>
              <p className="text-gray-600">
                The Eko Club International Women Forum was established in 2010 to address the unique challenges and
                opportunities faced by women in our community. Our mission is to empower women through leadership
                development, entrepreneurship support, mentorship, and community engagement.
              </p>
              <p className="text-gray-600">
                Through our various programs and initiatives, we have supported hundreds of women in developing their
                leadership skills, starting and growing businesses, pursuing education, and making meaningful
                contributions to their communities.
              </p>
              <p className="text-gray-600">
                The Women Forum brings together women from diverse backgrounds, professions, and experiences to create a
                supportive network that fosters growth, collaboration, and mutual support. We believe that when women
                are empowered, entire communities benefit.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full-width Video Section */}
      <section className="py-20 bg-gray-900">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center max-w-3xl mx-auto mb-16 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Our <span className="text-[#db2777]">Impact</span>
          </h2>
          <div className="h-1 w-20 bg-[#db2777] mx-auto mb-8"></div>
          <p className="text-white/80">
            Watch how the Women Forum has made a difference in the lives of women in our community.
          </p>
        </motion.div>

        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            className="relative w-full cursor-pointer group px-8 md:px-32"
            onClick={openVideoModal}
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/women-forum-thumbnail.jpg?height=800&width=1600"
                alt="Women Forum Impact Video"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                <motion.div
                  className="bg-white/90 rounded-full p-6 group-hover:bg-[#db2777] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Play className="h-12 w-12 text-gray-800 group-hover:text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Initiatives Section */}
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
              Our <span className="text-[#db2777]">Initiatives</span>
            </h2>
            <div className="h-1 w-20 bg-[#db2777] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Through our various initiatives, we aim to address the unique challenges and opportunities faced by women
              in our community.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {initiatives.map((initiative, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#db2777] hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">{initiative.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{initiative.title}</h3>
                <p className="text-gray-600 text-center">{initiative.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              Success <span className="text-[#db2777]">Stories</span>
            </h2>
            <div className="h-1 w-20 bg-[#db2777] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Hear from women whose lives have been transformed through our programs and initiatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromLeft}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/women-forum-1.PNG?height=200&width=200" alt="Testimonial" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Folake Adeyemi</h3>
                  <p className="text-[#db2777]">Entrepreneur</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The mentorship and support I received through the Women Forum helped me transform my small business
                idea into a thriving enterprise that now employs 15 people. I'm forever grateful for the guidance and
                encouragement."
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/women-forum-2.PNG?height=200&width=200" alt="Testimonial" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Dr. Amina Finn</h3>
                  <p className="text-[#db2777]">Healthcare Professional</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The leadership development program gave me the confidence and skills to pursue my dream of establishing
                a community health clinic. Today, we serve hundreds of patients monthly and are making a real
                difference."
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromRight}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/women-forum-3.PNG?height=200&width=200" alt="Testimonial" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Bisi Ogunwale</h3>
                  <p className="text-[#db2777]">Community Leader</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Through the Women Forum, I found my voice as a community advocate. The training and network I gained
                have enabled me to lead initiatives that have improved education access for girls in my community."
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
              Upcoming <span className="text-[#db2777]">Events</span>
            </h2>
            <div className="h-1 w-20 bg-[#db2777] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Join us at our upcoming events to connect, learn, and grow with other women in our community.
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
                        <Calendar className="h-4 w-4 text-[#db2777] mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#db2777] mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full bg-[#db2777] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none uppercase">
                      Register
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="py-20 bg-[#db2777] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-xl">Women Empowered</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-xl">Businesses Launched</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="text-5xl font-bold mb-2">100+</div>
              <p className="text-xl">Mentorship Pairs</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <div className="text-5xl font-bold mb-2">12</div>
              <p className="text-xl">Years of Impact</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Women Forum</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Be part of a supportive community of women dedicated to growth, leadership, and making a positive impact
              in our communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#db2777] hover:bg-[#e584b0] text-white px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/membership">Become a Member</Link>
              </Button>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-none" asChild>
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
            <iframe
              ref={videoRef}
              width="100%"
              height="100%"
              src="https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745611922/Eko-Club-women-forum-donation_wa_sjithr.mp4"
              title="Women Forum Impact Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
