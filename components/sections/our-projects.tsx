"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const projects = [
  {
    id: 1,
    title: "Minimalist Family House",
    price: "$229.00",
    location: "Sudirman Street, No.710, West Jakarta",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Modern Beach Villa",
    price: "$349.00",
    location: "Coastal Boulevard, No.25, Bali",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Luxury Apartment Complex",
    price: "$189.00",
    location: "Downtown District, Tower 3, Jakarta",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Eco-Friendly Residence",
    price: "$275.00",
    location: "Green Valley, No.42, Bandung",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title: "Traditional Heritage Home",
    price: "$195.00",
    location: "Cultural Street, No.15, Yogyakarta",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 6,
    title: "Urban Loft Apartments",
    price: "$210.00",
    location: "City Center, Block B, Surabaya",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function OurProjects() {
  const [showAll, setShowAll] = useState(false)
  const displayedProjects = showAll ? projects : projects.slice(0, 3)

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      {/* <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Enjoy the finest features with
              <br />
              Our Projects
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-600 leading-relaxed">
              Unlock the door to your dream initiatives – where cherished moments unfold and memories are built. Our
              projects, not just activities, but a canvas for a life well-lived.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="relative group overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <motion.div
                className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <h3 className="text-white text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-white text-xl font-bold mb-2">${project.price}</p>
                <div className="flex items-center text-white/80">
                  <MapPin size={16} className="mr-1" />
                  <p className="text-sm">{project.location}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={() => setShowAll(!showAll)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full"
          >
            {showAll ? "View Less" : "View More"}
          </Button>
        </motion.div>
      </div> */}
    </section>
  )
}

