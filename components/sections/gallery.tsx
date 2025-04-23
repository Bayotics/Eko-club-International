"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"

const galleryImages = [
  {
    id: 1,
    src: "/images/gallery-medical.jpg?height=600&width=800",
    alt: "Medical Mission 2023",
    category: "medical",
  },
  {
    id: 2,
    src: "/images/gallery-culture.jpg?height=600&width=800",
    alt: "Cultural Celebration",
    category: "cultural",
  },
  {
    id: 3,
    src: "/images/gallery-community.jpg?height=600&width=800",
    alt: "Community Outreach",
    category: "community",
  },
  {
    id: 4,
    src: "/images/projects-education.jpg?height=600&width=800",
    alt: "Scholarship Awards",
    category: "education",
  },
  {
    id: 5,
    src: "/images/gallery-culture-gala.jpg?height=600&width=800",
    alt: "Annual Gala",
    category: "cultural",
  },
  {
    id: 6,
    src: "/images/gallery-community-2.jpg?height=600&width=800",
    alt: "Water Project",
    category: "community",
  },
]

const categories = [
  { id: "all", name: "All" },
  { id: "medical", name: "Medical Missions" },
  { id: "cultural", name: "Cultural Events" },
  { id: "community", name: "Community Projects" },
  { id: "education", name: "Education" },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)

  const filteredImages =
    activeCategory === "all" ? galleryImages : galleryImages.filter((img) => img.category === activeCategory)

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 mt-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            OUR <span className="text-[#1818bb] font-medium">GALLERY</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-[#3f3feb] mx-auto mb-6"
          />
          <p className="text-gray-600 max-w-3xl mx-auto">
            Explore our gallery showcasing the impact of our work and events across our communities.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-[blue] text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
              className="overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative group overflow-hidden">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-lg font-medium">{image.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <button
              className="absolute top-6 right-6 text-white hover:text-[#C8A97E] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <div className="max-w-4xl max-h-[80vh]">
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="max-h-[80vh] w-auto object-contain"
              />
              <p className="text-white text-center mt-4 text-lg">{selectedImage.alt}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

