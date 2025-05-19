"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import Image from "next/image"

const chapters = [
  { id: 1, name: "Atlanta", country: "USA", members: 120, coords: { top: "60%", left: "34%" } },
  { id: 2, name: "Austin", country: "USA", members: 85, coords: { top: "64%", left: "27%" } },
  { id: 3, name: "California", country: "USA", members: 150, coords: { top: "47%", left: "10%" } },
  { id: 4, name: "Dallas", country: "USA", members: 110, coords: { top: "61%", left: "29%" } },
  { id: 5, name: "DC Metro", country: "USA", members: 95, coords: { top: "55%", left: "37%" } },
  { id: 6, name: "Delaware Valley", country: "USA", members: 75, coords: { top: "55%", left: "36%" } },
  { id: 7, name: "Detroit", country: "USA", members: 65, coords: { top: "52%", left: "34%" } },
  { id: 8, name: "Eko Lagosians of Canada", country: "Canada", members: 90, coords: { top: "40%", left: "34%" } },
  { id: 9, name: "Florida", country: "USA", members: 105, coords: { top: "67%", left: "36%" } },
  { id: 10, name: "Houston", country: "USA", members: 130, coords: { top: "63%", left: "26%" } },
  { id: 11, name: "Eko Club Houston Women", country: "USA", members: 70, coords: { top: "32%", left: "80%" } },
  { id: 12, name: "London, U.K.", country: "United Kingdom", members: 115, coords: { top: "31%", left: "81%" } },
  { id: 13, name: "Louisiana", country: "USA", members: 60, coords: { top: "65%", left: "28%" } },
  { id: 14, name: "Miami", country: "USA", members: 85, coords: { top: "66%", left: "37%" } },
  { id: 15, name: "Minnesota", country: "USA", members: 55, coords: { top: "44%", left: "28%" } },
  { id: 16, name: "New Jersey", country: "USA", members: 125, coords: { top: "54%", left: "37%" } },
  { id: 17, name: "New York", country: "USA", members: 160, coords: { top: "53%", left: "37%" } },
  { id: 18, name: "Ohio", country: "USA", members: 70, coords: { top: "54%", left: "35%" } },
  { id: 19, name: "Pennsylvania", country: "USA", members: 80, coords: { top: "55%", left: "36%" } },
  { id: 20, name: "Philadelphia", country: "USA", members: 95, coords: { top: "55%", left: "37%" } },
  { id: 21, name: "Rhode Island", country: "USA", members: 45, coords: { top: "53%", left: "38%" } },
  { id: 22, name: "San Antonio", country: "USA", members: 65, coords: { top: "64%", left: "25%" } },
  { id: 23, name: "Lagosians of Chicago", country: "USA", members: 65, coords: { top: "64%", left: "25%" } },
  { id: 24, name: "Eko Lagosians of Minnesota", country: "USA", members: 65, coords: { top: "64%", left: "25%" } },
  
]

export default function Chapters() {
  const [hoveredChapter, setHoveredChapter] = useState(null)

  return (
    <section id="chapters" className="scroll-section bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Global Chapters</h2>
          <div className="h-1 w-24 bg-primary mx-auto mb-6" />
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Eko Club International has chapters across the United States, Canada, and the United Kingdom, bringing
            together members of the Lagos community worldwide.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-blue-900/10 dark:bg-blue-900/30 z-10 rounded-lg" />
            <Image
              src="/images/map.png"
              alt="World Map"
              fill
              className="w-full h-full object-contain"
              style={{ objectFit: "contain" }}
            />
            {chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                className="absolute z-20"
                style={{
                  left: chapter.coords.left,
                  top: chapter.coords.top,
                }}
                onMouseEnter={() => setHoveredChapter(chapter)}
                onMouseLeave={() => setHoveredChapter(null)}
              >
                {/* REMOVED RED DOTS */}
                {hoveredChapter?.id === chapter.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 whitespace-nowrap z-30"
                  >
                    <p className="font-medium text-sm">{chapter.name}</p>
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">{chapter.members} members</p> */}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{chapter.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {chapter.country}
                  </div>
                  {/* <div className="mt-2 text-sm">
                    <span className="font-medium">{chapter.members}</span> members
                  </div> */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
