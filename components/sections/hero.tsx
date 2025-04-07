"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/images/hero-slide-1.png",
    title: "WELCOME TO",
    subtitle: "EKO CLUB INTERNATIONAL",
    description:
      "Together We Can Make A Difference in our communities through service, leadership, and cultural preservation.",
  },
  {
    id: 2,
    image: "/images/hero-slide-2.png",
    title: "BUILDING",
    subtitle: "STRONGER COMMUNITIES",
    description:
      "Connecting Lagos indigenes worldwide through cultural events, social gatherings, and community service.",
  },
  {
    id: 3,
    image: "/images/hero-slide-3.png",
    title: "EMPOWERING",
    subtitle: "OUR MEMBERS",
    description: "Providing opportunities for networking, leadership development, and community engagement.",
  },
  {
    id: 4,
    image: "/images/hero-slide-4.png",
    title: "PRESERVING",
    subtitle: "OUR HERITAGE",
    description: "Celebrating and promoting the rich cultural traditions of Lagos, Nigeria for future generations.",
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const length = slides.length

  const nextSlide = useCallback(() => {
    setCurrent(current === length - 1 ? 0 : current + 1)
  }, [current, length])

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1)
  }

  useEffect(() => {
    let interval
    if (autoplay) {
      interval = setInterval(() => {
        nextSlide()
      }, 6000)
    }
    return () => clearInterval(interval)
  }, [autoplay, nextSlide])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={`Eko Club - ${slide.subtitle}`}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-white text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-light mb-6"
              >
                <span className="block">{slides[current].title}</span>
                <span className="font-medium text-[#C8A97E]">{slides[current].subtitle}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="text-lg bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none px-8 py-6"
                >
                  <Link href="/donate">DONATE NOW</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-black transition-colors duration-300 rounded-none px-8 py-6"
                >
                  <Link href="/#membership">BECOME A MEMBER</Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute z-30 flex justify-between items-center w-full top-1/2 transform -translate-y-1/2 px-4 md:px-10">
        <button
          onClick={prevSlide}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-[#C8A97E] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-[#C8A97E] transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute z-30 bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoplay(false)
              setTimeout(() => setAutoplay(true), 10000)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-[#C8A97E] w-10" : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
          <Link href="/#about" className="flex flex-col items-center text-white/80 hover:text-white">
            <span className="text-sm mb-2 uppercase tracking-widest">Discover</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

