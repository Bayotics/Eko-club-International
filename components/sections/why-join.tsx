"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function WhyJoin() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-medium text-[#0F3D2E] mb-16"
        >
          Why join us?
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-lg overflow-hidden"
          >
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Eko Club Members at an event"
              width={600}
              height={500}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-gray-700 text-lg">
              With our extensive network and community-focused initiatives, we aim to provide you with the sense of
              belonging you deserve. Whether you're looking for cultural connections, professional networking, community
              service, or social engagement, we've got you covered. Our dedicated leadership team is here to guide you
              every step of the way.
            </p>
            <p className="text-gray-700 text-lg">
              Whether you're a Lagos indigene or simply have an interest in Lagos culture and heritage, we've created a
              welcoming community for everyone.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gray-700 text-lg max-w-xl mb-8 md:mb-0"
          >
            We offer opportunities for cultural preservation, community development, educational support, and social
            networking, allowing you to make a meaningful impact while connecting with your heritage.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center"
          >
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Member"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Member"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Member"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Member"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="ml-4">
              <span className="block text-[#0F3D2E] text-3xl font-bold">2,000+</span>
              <span className="text-gray-600">Active members</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

