"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Dr. Adebayo Johnson",
    role: "Medical Director",
    quote:
      "Being part of Eko Club International's medical mission was one of the most rewarding experiences of my career. The impact we made on the lives of people in Lagos was immeasurable.",
    image: "/images/testimonial2.png?height=200&width=200",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Community Member",
    quote:
      "The scholarship program provided by Eko Club International changed my daughter's life. She is now pursuing her dream of becoming an engineer, which would not have been possible without their support.",
    image: "/images/testimonial1.png?height=200&width=200",
  },
  {
    id: 3,
    name: "Chief Michael Ogunlade",
    role: "Chapter President",
    quote:
      "Leading our local chapter has been an honor. The dedication of our members to preserving our cultural heritage while making a positive impact in our communities is truly inspiring.",
    image: "/images/testimonial3.png?height=200&width=200",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      next()
    }, 5000)

    return () => clearInterval(interval)
  }, [current, autoplay])

  return (
    <section className="py-16 md:py-24 bg-black text-white mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            <span className="text-[#C8A97E] font-medium">TESTIMONIALS</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-[#C8A97E] mx-auto mb-6"
          />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-[#C8A97E] opacity-20">
            <Quote className="w-24 h-24" />
          </div>

          <div className="relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-8">
                  <Image
                    src={testimonials[current].image || "/placeholder.svg"}
                    alt={testimonials[current].name}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto border-2 border-[#C8A97E]"
                  />
                </div>
                <p className="text-xl md:text-2xl italic mb-8 max-w-3xl mx-auto">"{testimonials[current].quote}"</p>
                <h3 className="text-lg font-medium text-[#C8A97E]">{testimonials[current].name}</h3>
                <p className="text-gray-400">{testimonials[current].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white transition-colors"
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    current === index ? "bg-[#C8A97E]" : "bg-gray-600 hover:bg-gray-400"
                  }`}
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full border border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white transition-colors"
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

