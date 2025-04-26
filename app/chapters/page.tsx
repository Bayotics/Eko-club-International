"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Globe, Users, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

// Chapter data with URLs
const chapters = [
  { id: 1, name: "Atlanta", country: "USA", members: 120, url: "http://ekoclubatlanta.org/" },
  { id: 2, name: "Austin", country: "USA", members: 85, url: "http://ecatmembers.org/about_us" },
  { id: 3, name: "California", country: "USA", members: 150, url: "https://ekoclubinternational.org/california/" },
  { id: 4, name: "Dallas", country: "USA", members: 110, url: "http://www.ekoclubdfw.org" },
  { id: 5, name: "DC Metro", country: "USA", members: 95, url: "https://www.ekoclubdcmetro.org/" },
  { id: 6, name: "Delaware Valley", country: "USA", members: 75, url: "http://ekoclubdeva.com/styled-5/index.html" },
  { id: 7, name: "Detroit", country: "USA", members: 65, url: "http://www.ekoclubdetroit.org" },
  { id: 8, name: "Eko Lagosians of Canada", country: "Canada", members: 90, url: "http://www.lagosiansofcanada.com" },
  { id: 9, name: "Florida", country: "USA", members: 105, url: "www.ekoclubflorida.org" },
  { id: 10, name: "Houston", country: "USA", members: 130, url: "www.ekoclubhouston.com" },
  { id: 11, name: "Kent, U.K.", country: "United Kingdom", members: 70, url: "#" },
  { id: 12, name: "London, U.K.", country: "United Kingdom", members: 115, url: "http://www.gobspace.com/ekl" },
  { id: 13, name: "Louisiana", country: "USA", members: 60, url: "https://ekoclub-louisiana.org" },
  { id: 14, name: "Miami", country: "USA", members: 85, url: "https://ekoclub-miami.org" },
  { id: 15, name: "Minnesota", country: "USA", members: 55, url: "www.ekoclubminnesota.com/" },
  { id: 16, name: "New Jersey", country: "USA", members: 125, url: "https://ekoclubnj.org/" },
  { id: 17, name: "New York", country: "USA", members: 160, url: "www.ekoclubny.org" },
  { id: 18, name: "Ohio", country: "USA", members: 70, url: "https://ekoclubohio.org" },
  { id: 19, name: "Pennsylvania", country: "USA", members: 80, url: "https://www.facebook.com/ekoclub.pennsylvania" },
  { id: 20, name: "Philadelphia", country: "USA", members: 95, url: "www.ekoclubphiladelphia.org" },
  { id: 21, name: "Rhode Island", country: "USA", members: 45, url: "https://ekoclub-rhodeisland.org" },
  { id: 22, name: "San Antonio", country: "USA", members: 65, url: "https://ekoclub-sanantonio.org" },
]

const chapterPresidents = [
  { id: 1, name: "Hon. Deji Ajiboye", chapter: "Atlanta", image: "/images/chapter-presidents/atlanta.jpg?height=400&width=300" },
  { id: 2, name: "Hon. Christie Okolie", chapter: "Austin", image: "/images/chapter-presidents/Austin.jpg?height=300&width=300" },
  { id: 3, name: "Hon. Olatunji Anthonio", chapter: "California", image: "/images/chapter-presidents/california.png?height=300&width=300" },
  { id: 23, name: "Hon. Bunmi Kuton", chapter: "Chicago", image: "/images/chapter-presidents/chicago.jpg?height=300&width=300" },
  { id: 4, name: "Hon. Toyin Caxton", chapter: "Dallas", image: "/images/chapter-presidents/dallas.jpg?height=300&width=300" },
  { id: 6, name: "Hon Dapo Lediju", chapter: "Delaware Valley", image: "/images/chapter-presidents/delaware.jpeg?height=300&width=300" },
  { id: 7, name: "Hon. Deola Odunuga", chapter: "Detroit", image: "/images/chapter-presidents/detroit.jpg?height=300&width=300" },
  {
    id: 8,
    name: "Hon. Ibiyinka Thanni",
    chapter: "Eko Lagosians of Canada",
    image: "/images/chapter-presidents/canada.png?height=300&width=300",
  },
  { id: 9, name: "Hon. T.O Olarinde", chapter: "Florida", image: "/images/chapter-presidents/florida.jpg?height=300&width=300" },
  { id: 10, name: "Hon. B. J. Agoro", chapter: "Houston", image: "/images/chapter-presidents/houston.jpg?height=300&width=300" },
  { id: 24, name: "Hon. Oyedunmola Iyabo Ojo", chapter: "Houston Women", image: "/images/chapter-presidents/houston_women.jpg?height=300&width=300" },
  { id: 12, name: "Hon. Toyin Ibrahim-Igbo", chapter: "London, U.K.", image: "/images/chapter-presidents/london.jpg?height=300&width=300" },
  { id: 13, name: "Hon. Ayodeji Famuyide", chapter: "Louisiana", image: "/images/chapter-presidents/louisiana.jpg?height=300&width=300" },
  { id: 14, name: "Hon. Julia Ayo-Ajayi", chapter: "Miami", image: "/images/chapter-presidents/miami.jpg?height=300&width=300" },
  { id: 15, name: "Hon. Fatai Martins", chapter: "Minnesota", image: "/images/chapter-presidents/minnesota.jpg?height=300&width=300" },
  { id: 16, name: "Hon. Tajudeen Lawal", chapter: "New Jersey", image: "/images/chapter-presidents/new_jersey.jpg?height=300&width=300" },
  { id: 17, name: "Prince Omokayode Dosumu", chapter: "New York", image: "/images/chapter-presidents/new_york.jpg?height=300&width=300" },
  { id: 18, name: "Hon. Wale Onitiri", chapter: "Ohio", image: "/images/chapter-presidents/ohio.jpg?height=300&width=300" },
  { id: 19, name: "Hon. Adewale Dosumu", chapter: "Pennsylvania", image: "/images/chapter-presidents/pennsylvania.jpg?height=300&width=300" },
  { id: 25, name: "Hon. Olabisi Dabiri-Okoya", chapter: "Philadelphia", image: "/images/chapter-presidents/philadelphia.jpg?height=300&width=300" },
  { id: 20, name: "Hon. Bode Esuola", chapter: "Washington D.C Metro", image: "/images/chapter-presidents/washington.jpg?height=300&width=300" },
  {
    id: 21,
    name: "Hon. Kamaldeen Lambo",
    chapter: "Rhode Island",
    image: "/images/chapter-presidents/rhode_island.jpg?height=300&width=300",
  },
  { id: 22, name: "Dr. Caroline Jokotola", chapter: "San Antonio", image: "/images/chapter-presidents/san_antonio.jpg?height=300&width=300" },
]

// Filter options
const regions = ["All", "USA", "Canada", "United Kingdom"]

export default function ChaptersPage() {
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [hoveredChapter, setHoveredChapter] = useState(null)

  // Calculate filtered chapters directly from the selected region
  // This avoids potential state synchronization issues
  const filteredChapters =
    selectedRegion === "All" ? chapters : chapters.filter((chapter) => chapter.country === selectedRegion)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.6,
      },
    },
  }

  return (
    <main className="pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800 py-4 mb-8 mt-4">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/chapters" className="text-[#b7b943] font-medium">
                  Chapters
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/map.png?height=600&width=1600"
            alt="World Map Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Global <span className="text-[#e4e66d]">Chapters</span>
            </h1>
            <div className="h-1 w-24 bg-[#b7b943] mx-auto mb-6" />
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Eko Club International has established chapters across the globe, bringing together members of the Lagos
              community worldwide to promote cultural heritage and community development.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Globe className="h-5 w-5 text-[#b7b943]" />
                  <span>3 Countries</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <MapPin className="h-5 w-5 text-[#b7b943]" />
                  <span>22 Chapters</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Users className="h-5 w-5 text-[#b7b943]" />
                  <span>2,000+ Members</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-[60px] text-white"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,141.14c67.6,0,123.2-18.21,168.3-49.1C402.1,77.15,423,55.85,451.29,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Chapter</h2>
            <div className="h-1 w-24 bg-[#b7b943] mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our chapters around the world and connect with fellow members in your region.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {regions.map((region) => (
              <Button
                key={region}
                onClick={() => setSelectedRegion(region)}
                variant={selectedRegion === region ? "default" : "outline"}
                className={cn(
                  "rounded-full px-6",
                  selectedRegion === region
                    ? "bg-[#b7b943] hover:bg-[#b89868] text-white border-[#b7b943]"
                    : "border-[#b7b943] text-[#b7b943] hover:bg-[#b7b943]/10",
                )}
              >
                {region}
              </Button>
            ))}
          </motion.div>

          {/* Display message when no chapters are found */}
          {filteredChapters.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                No chapters found in this region. Please select another region.
              </p>
            </motion.div>
          )}

          <motion.div
            key={selectedRegion} // Add key to force re-render when region changes
            variants={containerVariants}
            initial="hidden"
            animate="visible" // Change from whileInView to animate
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredChapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                onHoverStart={() => setHoveredChapter(chapter.id)}
                onHoverEnd={() => setHoveredChapter(null)}
              >
                <Link href={chapter.url} target="_blank" rel="noopener noreferrer">
                  <Card
                    className={`h-full overflow-hidden transition-all duration-300 ${hoveredChapter === chapter.id ? "shadow-lg border-[#b7b943]" : "shadow-md"}`}
                  >
                    <div className="h-32 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-white">{chapter.name}</h3>
                      </div>
                      <div className="absolute bottom-0 right-0 bg-[#b7b943] text-white px-3 py-1 text-sm font-medium">
                        {chapter.country}
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          <span>
                            <strong>{chapter.members}</strong> members
                          </span>
                        </div>
                        <div
                          className={`flex items-center justify-between transition-opacity duration-300 ${hoveredChapter === chapter.id ? "opacity-100" : "opacity-70"}`}
                        >
                          <span className="text-sm text-[#434417] font-medium">Visit Chapter</span>
                          <ExternalLink className="h-4 w-4 text-[#b7b943]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Chapter Presidents Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Chapter Presidents</h2>
            <div className="h-1 w-24 bg-[#b7b943] mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the dedicated leaders who guide our chapters and foster community engagement around the world.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Carousel implementation */}
            <div className="w-full max-w-5xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {chapterPresidents.map((president) => (
                    <CarouselItem key={president.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-2">
                        <Card className="overflow-hidden border-none shadow-lg">
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={president.image || "/placeholder.svg"}
                              alt={president.name}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-4 text-white">
                              <h3 className="text-xl font-bold">{president.name}</h3>
                              <p className="text-[#b7b943]">President, {president.chapter} Chapter</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8 gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-[#b7b943] text-[#b7b943] hover:bg-[#b7b943] hover:text-white"
                    onClick={() => document.querySelector("[data-carousel-button-prev]")?.click()}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  <CarouselPrevious className="hidden" data-carousel-button-prev />
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-[#b7b943] text-[#b7b943] hover:bg-[#b7b943] hover:text-white"
                    onClick={() => document.querySelector("[data-carousel-button-next]")?.click()}
                  >
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">Next</span>
                  </Button>
                  <CarouselNext className="hidden" data-carousel-button-next />
                </div>
              </Carousel>
            </div>
          </motion.div>
        </div>
      </section>

      {/* World Map Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Global Presence</h2>
            <div className="h-1 w-24 bg-[#b7b943] mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Eko Club International has established a strong presence across North America and Europe, connecting
              Lagosians worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative w-full h-[400px] md:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-900/10 dark:bg-blue-900/30 z-10 rounded-lg" />
            <Image
              src="/images/map.png?height=500&width=1200"
              alt="World Map"
              fill
              className="w-full h-full object-cover"
            />
            {/* {chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                className="absolute z-20"
                style={{
                  // Random positions for demonstration - would be replaced with actual coordinates
                  left: `${((chapter.id * 37) % 85) + 5}%`,
                  top: `${((chapter.id * 23) % 75) + 10}%`,
                }}
                whileHover={{ scale: 1.2 }}
              >
                <motion.div
                  className="w-3 h-3 bg-[#b7b943] rounded-full cursor-pointer"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    repeatDelay: Math.random() * 2,
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 whitespace-nowrap z-30 pointer-events-none"
                >
                  <p className="font-medium text-sm">{chapter.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{chapter.members} members</p>
                </motion.div>
              </motion.div>
            ))} */}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Your Local Chapter Today</h2>
            <div className="h-1 w-24 bg-[#b7b943] mx-auto mb-6" />
            <p className="text-gray-300 mb-8">
              Connect with fellow Lagosians in your area, participate in cultural events, and contribute to community
              development initiatives.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#b7b943] hover:bg-[#b89868] text-white px-8 py-6 text-lg">
                Find Your Chapter
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Start a New Chapter
              </Button>
            </div> */}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
