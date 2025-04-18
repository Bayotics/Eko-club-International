"use client"

import { useRef } from "react"
import { motion, useAnimationFrame } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const presidents = [
  {
    id: 1,
    name: "Chief Adebayo Ogunlesi",
    title: "Founding President",
    period: "1998-2002",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Dr. Oluwole Kukoyi",
    title: "2nd President",
    period: "2002-2006",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Chief Tunde Adeola",
    title: "3rd President",
    period: "2006-2010",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Dr. Abiodun Aina",
    title: "4th President",
    period: "2010-2014",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    name: "Chief Kunle Ojora",
    title: "5th President",
    period: "2014-2018",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 6,
    name: "Dr. Hakeem Babatunde",
    title: "6th President",
    period: "2018-2022",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 7,
    name: "Chief Olumide Johnson",
    title: "Current President",
    period: "2022-Present",
    image: "/placeholder.svg?height=400&width=400",
  },
]

// Duplicate the presidents array for the infinite scroll effect
const duplicatedPresidents = [...presidents, ...presidents]

export default function Presidents() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const xPos = useRef(0)
  const speed = 0.5 // Controls the speed of the animation

  useAnimationFrame(() => {
    if (!scrollRef.current) return

    // Calculate the width of a single item (including gap)
    const itemWidth = scrollRef.current.scrollWidth / duplicatedPresidents.length

    // Move the position
    xPos.current -= speed

    // Reset position when we've scrolled the width of the original items
    if (Math.abs(xPos.current) >= presidents.length * itemWidth) {
      xPos.current = 0
    }

    // Apply the transform
    scrollRef.current.style.transform = `translateX(${xPos.current}px)`
  })

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F3D2E] mb-4">ECI PRESIDENTS</h2>
            <p className="text-gray-600 text-lg">
              Meet the distinguished leaders who have guided Eko Club International through the years, each contributing
              to our legacy of service, community development, and cultural preservation.
            </p>
          </div>

          <Link
            href="/leadership"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[#C8A97E] font-medium hover:text-[#8A6D3B] transition-colors group"
          >
            View All Leadership
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="overflow-hidden relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent"></div>

          <div className="py-8">
            <motion.div ref={scrollRef} className="flex gap-8" initial={{ x: 0 }}>
              {duplicatedPresidents.map((president, index) => (
                <div key={`${president.id}-${index}`} className="flex-shrink-0 w-60">
                  <div className="relative group">
                    <div className="w-60 h-60 rounded-full overflow-hidden bg-[#C8A97E]/20 mb-4">
                      <Image
                        src={president.image || "/placeholder.svg"}
                        alt={president.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-medium text-[#0F3D2E]">{president.name}</h3>
                      <p className="text-[#C8A97E] font-medium">{president.title}</p>
                      <p className="text-gray-500 text-sm">{president.period}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

