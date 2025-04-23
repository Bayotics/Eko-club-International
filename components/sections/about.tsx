"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function About() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            ABOUT <span className="text-[#f15858] font-medium">US</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-[#e26a6a] mx-auto mb-6"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/about-us-section.jpg"
              alt="About Eko Club International"
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </motion.div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.h3 variants={itemVariants} className="text-2xl font-medium text-[#e26a6a]">
              Our Story
            </motion.h3>
            <motion.p variants={itemVariants} className="text-gray-700">
              Eko Club International was founded with a vision to unite people of Lagos heritage worldwide, fostering
              cultural preservation, community service, and sustainable development projects that improve lives.
            </motion.p>

            <motion.h3 variants={itemVariants} className="text-2xl font-medium text-[#e26a6a]">
              Our Mission
            </motion.h3>
            <motion.p variants={itemVariants} className="text-gray-700">
              We are dedicated to promoting the cultural heritage of Lagos, Nigeria, and supporting community
              development through various initiatives, including medical missions, educational programs, and
              infrastructure projects.
            </motion.p>

            <motion.h3 variants={itemVariants} className="text-2xl font-medium text-[#e26a6a]">
              Our Values
            </motion.h3>
            <motion.ul variants={itemVariants} className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Community Service</li>
              <li>Cultural Preservation</li>
              <li>Integrity and Transparency</li>
              <li>Collaboration and Partnership</li>
              <li>Excellence in All We Do</li>
            </motion.ul>

            <motion.div variants={itemVariants} className="pt-4">
              <Button onClick={() => router.push('/about/our-mission')} className="bg-[#f15858] hover:bg-[#f18c51] text-white transition-colors duration-300 rounded-none px-8 py-6 uppercase">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

