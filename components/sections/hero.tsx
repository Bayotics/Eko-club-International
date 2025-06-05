"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Countdown timer component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-4 sm:my-6 text-white">
      <div className="flex flex-col items-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-black/30 px-2 sm:px-4 py-1 sm:py-2 rounded-md min-w-[50px] sm:min-w-[80px] text-center">
          {timeLeft.days}
        </div>
        <div className="text-xs sm:text-sm mt-1">Days</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-black/30 px-2 sm:px-4 py-1 sm:py-2 rounded-md min-w-[50px] sm:min-w-[80px] text-center">
          {timeLeft.hours}
        </div>
        <div className="text-xs sm:text-sm mt-1">Hours</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-black/30 px-2 sm:px-4 py-1 sm:py-2 rounded-md min-w-[50px] sm:min-w-[80px] text-center">
          {timeLeft.minutes}
        </div>
        <div className="text-xs sm:text-sm mt-1">Minutes</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-black/30 px-2 sm:px-4 py-1 sm:py-2 rounded-md min-w-[50px] sm:min-w-[80px] text-center">
          {timeLeft.seconds}
        </div>
        <div className="text-xs sm:text-sm mt-1">Seconds</div>
      </div>
    </div>
  )
}

const slides = [
  {
    id: 1,
    image: "/images/hero-slide-1.png",
    title: "Join our 14th CONVENTION",
    subtitle: "and 25th ANNIVERSARY",
    description: "",
    showCountdown: true,
    specialButton: {
      text: "REGISTER NOW",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSecvxqmQ5rXGGNJyNSb382IRXAg56qSqGxvMeW-2kBYnPrglg/viewform",
      external: true,
    },
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
      }, 25000)
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
        <div className="container mx-auto px-4 py-6 sm:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-white text-center"
            >
              {current === 0 ? (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-4 sm:mb-6"
                >
                  <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-light leading-tight">
                    {slides[current].title}
                  </span>
                  <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-medium text-[#f3d447] leading-tight">
                    {slides[current].subtitle}
                  </span>
                </motion.h1>
              ) : (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl sm:text-5xl md:text-7xl font-light mb-6"
                >
                  <span className="block">{slides[current].title}</span>
                  <span className="font-medium text-[#f3d447]">{slides[current].subtitle}</span>
                </motion.h1>
              )}

              {slides[current].showCountdown && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <CountdownTimer targetDate="2025-09-18T00:00:00" />
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl font-light mb-6 sm:mb-10 max-w-3xl mx-auto px-2"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
              >
                {slides[current].specialButton ? (
                  <Button
                    size="lg"
                    className="text-base sm:text-lg bg-[#e4e66d] hover:bg-[#d5d83b] text-gray-800 transition-colors duration-300 rounded-none px-4 sm:px-8 py-4 sm:py-6"
                    asChild
                  >
                    <a href={slides[current].specialButton.link} target="_blank" rel="noopener noreferrer">
                      {slides[current].specialButton.text}
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="text-base sm:text-lg bg-[#e4e66d] hover:bg-[#d5d83b] text-gray-600 transition-colors duration-300 rounded-none px-4 sm:px-8 py-4 sm:py-6"
                  >
                    <Link href="/donate">DONATE NOW</Link>
                  </Button>
                )}
                
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute z-30 flex justify-between items-center w-full top-1/2 transform -translate-y-1/2 px-2 sm:px-4 md:px-10">
        <button
          onClick={prevSlide}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
          className="p-1 sm:p-2 rounded-full bg-black/30 text-white hover:bg-[#C8A97E] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={nextSlide}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
          className="p-1 sm:p-2 rounded-full bg-black/30 text-white hover:bg-[#C8A97E] transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute z-30 bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoplay(false)
              setTimeout(() => setAutoplay(true), 10000)
            }}
            className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-[#C8A97E] w-6 sm:w-10" : "bg-white/50 hover:bg-white"
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
            <span className="text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-widest">Discover</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-6 sm:h-6"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
