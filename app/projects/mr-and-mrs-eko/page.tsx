"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { FiAward, FiCalendar, FiUsers, FiStar, FiArrowRight, FiPlay, FiUser } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

export default function MrAndMrsEkoPage() {
  const isMobile = useMobile()
  const [videoOpen, setVideoOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState("")

  // Refs for animations
  const heroRef = useRef(null)
  const overviewRef = useRef(null)
  const winnersRef = useRef(null)
  const categoriesRef = useRef(null)
  const galleryRef = useRef(null)
  const upcomingRef = useRef(null)
  const testimonialRef = useRef(null)
  const ctaRef = useRef(null)

  // Check if elements are in view
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const overviewInView = useInView(overviewRef, { once: true, amount: 0.3 })
  const winnersInView = useInView(winnersRef, { once: true, amount: 0.3 })
  const categoriesInView = useInView(categoriesRef, { once: true, amount: 0.3 })
  const galleryInView = useInView(galleryRef, { once: true, amount: 0.3 })
  const upcomingInView = useInView(upcomingRef, { once: true, amount: 0.3 })
  const testimonialInView = useInView(testimonialRef, { once: true, amount: 0.3 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })

  // Sample data for winners
  const winners = [
    {
      year: "2023",
      mr: {
        name: "John Adebayo",
        image: "/placeholder.svg?height=400&width=300",
        achievement: "Raised over $50,000 for community development",
      },
      mrs: {
        name: "Sarah Okonkwo",
        image: "/placeholder.svg?height=400&width=300",
        achievement: "Led educational initiatives for underprivileged children",
      },
    },
    {
      year: "2022",
      mr: {
        name: "Michael Oluwole",
        image: "/placeholder.svg?height=400&width=300",
        achievement: "Established a mentorship program for youth",
      },
      mrs: {
        name: "Elizabeth Nnamdi",
        image: "/placeholder.svg?height=400&width=300",
        achievement: "Created a women's empowerment foundation",
      },
    },
    {
      year: "2021",
      mr: {
        name: "David Olatunji",
        image: "/placeholder.svg?height=400&width=300",
        achievement: "Organized medical outreach programs",
      },
      mrs: {
        name: "Victoria Adeyemi",
        image: "/placeholder.svg?height=400&width=300",
        achievement: "Championed environmental sustainability projects",
      },
    },
  ]

  // Sample data for competition categories
  const categories = [
    {
      title: "Cultural Heritage",
      icon: <FiStar className="h-6 w-6" />,
      description:
        "Contestants showcase their knowledge and appreciation of Lagos cultural heritage through traditional attire, language, and customs.",
    },
    {
      title: "Community Impact",
      icon: <FiUsers className="h-6 w-6" />,
      description:
        "Evaluation of contestants' community service projects and their impact on the Lagos community locally and internationally.",
    },
    {
      title: "Leadership & Vision",
      icon: <FiAward className="h-6 w-6" />,
      description:
        "Assessment of leadership qualities and vision for contributing to the growth and development of Lagos and its diaspora communities.",
    },
    {
      title: "Talent Showcase",
      icon: <FiStar className="h-6 w-6" />,
      description:
        "Contestants demonstrate their unique talents that represent and promote Lagos culture on the global stage.",
    },
  ]

  // Sample testimonials
  const testimonials = [
    {
      quote:
        "Winning Mr. Eko was a life-changing experience that gave me the platform to make a real difference in our community.",
      author: "John Adebayo",
      title: "Mr. Eko 2023",
    },
    {
      quote:
        "The Mrs. Eko competition celebrates not just beauty, but intelligence, cultural pride, and community service.",
      author: "Sarah Okonkwo",
      title: "Mrs. Eko 2023",
    },
    {
      quote:
        "This competition embodies the spirit of Lagos and provides winners with resources to implement meaningful projects.",
      author: "Michael Oluwole",
      title: "Mr. Eko 2022",
    },
  ]

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const slideIn = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  }

  return (
    // <main className="pt-24 overflow-hidden">
    //   {/* Breadcrumb */}
    //   <div className="bg-gray-100 py-4 mb-8">
    //     <div className="container mx-auto px-4">
    //       <div className="flex items-center text-sm text-gray-600">
    //         <Link href="/" className="hover:text-[#C8A97E] transition-colors">
    //           Home
    //         </Link>
    //         <span className="mx-2">/</span>
    //         <Link href="/#projects" className="hover:text-[#C8A97E] transition-colors">
    //           Our Projects
    //         </Link>
    //         <span className="mx-2">/</span>
    //         <span className="text-[#C8A97E]">ECI Mr. & Mrs. Eko</span>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Hero Section with Split Design */}
    //   <section ref={heroRef} className="relative overflow-hidden">
    //     <div className="container mx-auto px-4 py-12 md:py-20">
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    //         <motion.div
    //           initial="hidden"
    //           animate={heroInView ? "visible" : "hidden"}
    //           variants={slideIn}
    //           className="order-2 md:order-1"
    //         >
    //           <Badge className="mb-4 bg-[#C8A97E] text-white hover:bg-[#C8A97E]/90">Prestigious Competition</Badge>
    //           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
    //             <span className="text-[#C8A97E]">Mr. & Mrs. Eko</span> <br />
    //             <span className="text-gray-800">International</span>
    //           </h1>
    //           <p className="text-gray-600 text-lg mb-8 max-w-lg">
    //             Celebrating excellence, cultural heritage, and community service among Lagos indigenes and descendants
    //             worldwide.
    //           </p>
    //           <div className="flex flex-wrap gap-4">
    //             <Button className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white px-8 py-6">
    //               Learn About Competition
    //             </Button>
    //             <Button variant="outline" className="border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E]/10 px-8 py-6">
    //               View Past Winners
    //             </Button>
    //           </div>
    //         </motion.div>

    //         <motion.div
    //           initial="hidden"
    //           animate={heroInView ? "visible" : "hidden"}
    //           variants={scaleIn}
    //           className="order-1 md:order-2 relative"
    //         >
    //           <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg shadow-xl">
    //             <div className="absolute inset-0 bg-gradient-to-r from-[#C8A97E]/20 to-[#8A6D3B]/20 z-10 rounded-lg"></div>
    //             <Image
    //               src="/placeholder.svg?height=500&width=800"
    //               alt="Mr. and Mrs. Eko Pageant"
    //               fill
    //               className="object-cover"
    //             />

    //             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-20">
    //               <p className="text-white font-medium">Grand Finale Ceremony 2023</p>
    //             </div>

    //             <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
    //               <DialogTrigger asChild>
    //                 <button
    //                   className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all rounded-full p-4 z-20"
    //                   onClick={() => {
    //                     setCurrentVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")
    //                     setVideoOpen(true)
    //                   }}
    //                 >
    //                   <FiPlay className="h-8 w-8 text-white" />
    //                 </button>
    //               </DialogTrigger>
    //               <DialogContent className="sm:max-w-[800px] h-auto max-h-[50vh] p-0 bg-transparent border-none">
    //                 <div className="relative w-full h-0 pb-[56.25%]">
    //                   <iframe
    //                     className="absolute top-0 left-0 w-full h-full rounded-lg"
    //                     src={currentVideo}
    //                     title="Video"
    //                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //                     allowFullScreen
    //                   ></iframe>
    //                 </div>
    //               </DialogContent>
    //             </Dialog>
    //           </div>

    //           <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-32 h-32 md:w-48 md:h-48 bg-[#C8A97E]/10 rounded-full z-0"></div>
    //           <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-36 md:h-36 bg-[#8A6D3B]/10 rounded-full z-0"></div>
    //         </motion.div>
    //       </div>
    //     </div>

    //     {/* Decorative elements */}
    //     <div className="absolute top-1/4 left-0 w-24 h-24 bg-[#C8A97E]/5 rounded-full"></div>
    //     <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-[#8A6D3B]/5 rounded-full"></div>
    //   </section>

    //   {/* Overview Section */}
    //   <section ref={overviewRef} className="py-16 bg-gray-50">
    //     <div className="container mx-auto px-4">
    //       <motion.div
    //         initial="hidden"
    //         animate={overviewInView ? "visible" : "hidden"}
    //         variants={fadeIn}
    //         className="text-center max-w-3xl mx-auto mb-12"
    //       >
    //         <Badge className="mb-4 bg-[#C8A97E] text-white hover:bg-[#C8A97E]/90">About The Competition</Badge>
    //         <h2 className="text-3xl md:text-4xl font-bold mb-6">Celebrating Lagos Excellence</h2>
    //         <p className="text-gray-600">
    //           The ECI Mr. & Mrs. Eko competition is a prestigious cultural pageant that celebrates the rich heritage of
    //           Lagos while recognizing individuals who embody excellence, leadership, and community service. Since its
    //           inception, the competition has become a platform for showcasing Lagos culture on the global stage.
    //         </p>
    //       </motion.div>

    //       <motion.div
    //         initial="hidden"
    //         animate={overviewInView ? "visible" : "hidden"}
    //         variants={staggerContainer}
    //         className="grid grid-cols-1 md:grid-cols-3 gap-8"
    //       >
    //         <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md">
    //           <div className="w-12 h-12 bg-[#C8A97E]/20 rounded-full flex items-center justify-center mb-4">
    //             <FiAward className="text-[#C8A97E] h-6 w-6" />
    //           </div>
    //           <h3 className="text-xl font-semibold mb-3">Prestigious Recognition</h3>
    //           <p className="text-gray-600">
    //             Winners receive recognition as cultural ambassadors representing Lagos heritage and values worldwide.
    //           </p>
    //         </motion.div>

    //         <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md">
    //           <div className="w-12 h-12 bg-[#C8A97E]/20 rounded-full flex items-center justify-center mb-4">
    //             <FiUsers className="text-[#C8A97E] h-6 w-6" />
    //           </div>
    //           <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
    //           <p className="text-gray-600">
    //             The competition empowers winners to implement community development projects with support from Eko Club
    //             International.
    //           </p>
    //         </motion.div>

    //         <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md">
    //           <div className="w-12 h-12 bg-[#C8A97E]/20 rounded-full flex items-center justify-center mb-4">
    //             <FiStar className="text-[#C8A97E] h-6 w-6" />
    //           </div>
    //           <h3 className="text-xl font-semibold mb-3">Cultural Celebration</h3>
    //           <p className="text-gray-600">
    //             Contestants showcase Lagos traditions, language, attire, and customs, preserving cultural heritage for
    //             future generations.
    //           </p>
    //         </motion.div>
    //       </motion.div>
    //     </div>
    //   </section>

    //   {/* Past Winners Section with Tabs */}
    //   <section ref={winnersRef} className="py-16 bg-white">
    //     <div className="container mx-auto px-4">
    //       <motion.div
    //         initial="hidden"
    //         animate={winnersInView ? "visible" : "hidden"}
    //         variants={fadeIn}
    //         className="text-center max-w-3xl mx-auto mb-12"
    //       >
    //         <Badge className="mb-4 bg-[#C8A97E] text-white hover:bg-[#C8A97E]/90">Hall of Fame</Badge>
    //         <h2 className="text-3xl md:text-4xl font-bold mb-6">Past Winners & Their Legacy</h2>
    //         <p className="text-gray-600">
    //           Meet the distinguished individuals who have been crowned Mr. and Mrs. Eko and learn about their impactful
    //           contributions to the community.
    //         </p>
    //       </motion.div>

    //       <motion.div initial="hidden" animate={winnersInView ? "visible" : "hidden"} variants={scaleIn}>
    //         <Tabs defaultValue="2023" className="w-full">
    //           <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
    //             {winners.map((winner) => (
    //               <TabsTrigger
    //                 key={winner.year}
    //                 value={winner.year}
    //                 className="data-[state=active]:bg-[#C8A97E] data-[state=active]:text-white"
    //               >
    //                 {winner.year}
    //               </TabsTrigger>
    //             ))}
    //           </TabsList>

    //           {winners.map((winner) => (
    //             <TabsContent key={winner.year} value={winner.year}>
    //               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    //                 <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
    //                   <div className="relative h-80 w-full">
    //                     <Image
    //                       src={winner.mr.image || "/placeholder.svg"}
    //                       alt={`Mr. Eko ${winner.year}`}
    //                       fill
    //                       className="object-cover"
    //                     />
    //                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
    //                       <h3 className="text-white text-xl font-semibold">{winner.mr.name}</h3>
    //                       <p className="text-white/80 text-sm">Mr. Eko {winner.year}</p>
    //                     </div>
    //                   </div>
    //                   <div className="p-6">
    //                     <h4 className="text-lg font-medium mb-2">Notable Achievement</h4>
    //                     <p className="text-gray-600">{winner.mr.achievement}</p>
    //                   </div>
    //                 </div>

    //                 <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
    //                   <div className="relative h-80 w-full">
    //                     <Image
    //                       src={winner.mrs.image || "/placeholder.svg"}
    //                       alt={`Mrs. Eko ${winner.year}`}
    //                       fill
    //                       className="object-cover"
    //                     />
    //                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
    //                       <h3 className="text-white text-xl font-semibold">{winner.mrs.name}</h3>
    //                       <p className="text-white/80 text-sm">Mrs. Eko {winner.year}</p>
    //                     </div>
    //                   </div>
    //                   <div className="p-6">
    //                     <h4 className="text-lg font-medium mb-2">Notable Achievement</h4>
    //                     <p className="text-gray-600">{winner.mrs.achievement}</p>
    //                   </div>
    //                 </div>
    //               </div>
    //             </TabsContent>
    //           ))}
    //         </Tabs>
    //       </motion.div>
    //     </div>
    //   </section>

    //   {/* Competition Categories */}
    //   <section ref={categoriesRef} className="py-16 bg-[#C8A97E]/5">
    //     <div className="container mx-auto px-4">
    //       <motion.div
    //         initial="hidden"
    //         animate={categoriesInView ? "visible" : "hidden"}
    //         variants={fadeIn}
    //         className="text-center max-w-3xl mx-auto mb-12"
    //       >
    //         <Badge className="mb-4 bg-[#C8A97E] text-white hover:bg-[#C8A97E]/90">Judging Criteria</Badge>
    //         <h2 className="text-3xl md:text-4xl font-bold mb-6">Competition Categories</h2>
    //         <p className="text-gray-600">
    //           Contestants are evaluated across multiple categories that showcase their connection to Lagos heritage,
    //           leadership abilities, and commitment to community service.
    //         </p>
    //       </motion.div>

    //       <motion.div
    //         initial="hidden"
    //         animate={categoriesInView ? "visible" : "hidden"}
    //         variants={staggerContainer}
    //         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    //       >
    //         {categories.map((category, index) => (
    //           <motion.div
    //             key={index}
    //             variants={fadeIn}
    //             className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#C8A97E] h-full flex flex-col"
    //           >
    //             <div className="mb-4 text-[#C8A97E]">{category.icon}</div>
    //             <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
    //             <p className="text-gray-600 flex-grow">{category.description}</p>
    //           </motion.div>
    //         ))}
    //       </motion.div>
    //     </div>
    //   </section>

    //   {/* Video Gallery Section */}
    //   <section ref={galleryRef} className="py-16 bg-white">
    //     <div className="container mx-auto px-4">
    //       <motion.div
    //         initial="hidden"
    //         animate={galleryInView ? "visible" : "hidden"}
    //         variants={fadeIn}
    //         className="text-center max-w-3xl mx-auto mb-12"
    //       >
    //         <Badge className="mb-4 bg-[#C8A97E] text-white hover:bg-[#C8A97E]/90">Highlights</Badge>
    //         <h2 className="text-3xl md:text-4xl font-bold mb-6">Competition Highlights</h2>
    //         <p className="text-gray-600">Watch highlights from previous Mr. & Mrs. Eko competitions and ceremonies.</p>
    //       </motion.div>

    //       <motion.div
    //         initial="hidden"
    //         animate={galleryInView ? "visible" : "hidden"}
    //         variants={staggerContainer}
    //         className="grid grid-cols-1 md:grid-cols-2 gap-8"
    //       >
    //         {/* Video 1 */}
    //         <motion.div variants={fadeIn} className="relative rounded-lg overflow-hidden shadow-lg group">
    //           <div className="relative h-[300px] w-full">
    //             <Image
    //               src="/placeholder.svg?height=300&width=600"
    //               alt="Grand Finale 2023"
    //               fill
    //               className="object-cover transition-transform duration-500 group-hover:scale-105"
    //             />
    //             <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

    //             <Dialog>
    //               <DialogTrigger asChild>
    //                 <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all rounded-full p-4 z-10">
    //                   <FiPlay className="h-8 w-8 text-white" />
    //                 </button>
    //               </DialogTrigger>
    //               <DialogContent className="sm:max-w-[800px] h-auto max-h-[50vh] p-0 bg-transparent border-none">
    //                 <div className="relative w-full h-0 pb-[56.25%]">
    //                   <iframe
    //                     className="absolute top-0 left-0 w-full h-full rounded-lg"
    //                     src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    //                     title="Video"
    //                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //                     allowFullScreen
    //                   ></iframe>
    //                 </div>
    //               </DialogContent>
    //             </Dialog>

    //             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
    //               <h3 className="text-white text-xl font-semibold">Grand Finale Ceremony 2023</h3>
    //               <p className="text-white/80">Crowning of Mr. & Mrs. Eko 2023</p>
    //             </div>
    //           </div>
    //         </motion.div>

    //         {/* Video 2 */}
    //         <motion.div variants={fadeIn} className="relative rounded-lg overflow-hidden shadow-lg group">
    //           <div className="relative h-[300px] w-full">
    //             <Image
    //               src="/placeholder.svg?height=300&width=600"
    //               alt="Cultural Showcase"
    //               fill
    //               className="object-cover transition-transform duration-500 group-hover:scale-105"
    //             />
    //             <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

    //             <Dialog>
    //               <DialogTrigger asChild>
    //                 <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all rounded-full p-4 z-10">
    //                   <FiPlay className="h-8 w-8 text-white" />
    //                 </button>
    //               </DialogTrigger>
    //               <DialogContent className="sm:max-w-[800px] h-auto max-h-[50vh] p-0 bg-transparent border-none">
    //                 <div className="relative w-full h-0 pb-[56.25%]">
    //                   <iframe
    //                     className="absolute top-0 left-0 w-full h-full rounded-lg"
    //                     src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    //                     title="Video"
    //                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //                     allowFullScreen
    //                   ></iframe>
    //                 </div>
    //               </DialogContent>
    //             </Dialog>

    //             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
    //               <h3 className="text-white text-xl font-semibold">Cultural Showcase</h3>
    //               <p className="text-white/80">Traditional performances and cultural displays</p>
    //             </div>
    //           </div>
    //         </motion.div>
    //       </motion.div>
    //     </div>
    //   </section>

    //   {/* Upcoming Competition */}
    //   <section ref={upcomingRef} className="py-16 bg-gray-900 text-white relative overflow-hidden">
    //     {/* Decorative elements */}
    //     <div className="absolute top-0 left-0 w-64 h-64 bg-[#C8A97E]/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    //     <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C8A97E]/10 rounded-full transform translate-x-1/3 translate-y-1/3"></div>

    //     <div className="container mx-auto px-4 relative z-10">
    //       <motion.div
    //         initial="hidden"
    //         animate={upcomingInView ? "visible" : "hidden"}
    //         variants={fadeIn}
    //         className="text-center max-w-3xl mx-auto mb-12"
    //       >
    //         <Badge className="mb-4 bg-[#C8A97E] text-white hover:bg-[#C8A97E]/90">Mark Your Calendar</Badge>
    //         <h2 className="text-3xl md:text-4xl font-bold mb-6">Upcoming Competition</h2>
    //         <p className="text-gray-300">
    //           The search for the next Mr. & Mrs. Eko is about to begin. Don't miss your chance to participate in this
    //           prestigious competition.
    //         </p>
    //       </motion.div>

    //       <motion.div
    //         initial="hidden"
    //         animate={upcomingInView ? "visible" : "hidden"}
    //         variants={scaleIn}
    //         className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-4xl mx-auto"
    //       >
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    //           <div>
    //             <div className="flex items-center mb-4">
    //               <FiCalendar className="text-[#C8A97E] h-6 w-6 mr-3" />
    //               <h3 className="text-xl font-semibold">Competition Timeline</h3>
    //             </div>
    //             <ul className="space-y-4">
    //               <li className="flex">
    //                 <div className="mr-4 flex flex-col items-center">
    //                   <div className="w-3 h-3 bg-[#C8A97E] rounded-full"></div>
    //                   <div className="h-full w-0.5 bg-[#C8A97E]/30"></div>
    //                 </div>
    //                 <div>
    //                   <h4 className="font-medium">Application Opens</h4>
    //                   <p className="text-gray-400 text-sm">January 15, 2024</p>
    //                 </div>
    //               </li>
    //               <li className="flex">
    //                 <div className="mr-4 flex flex-col items-center">
    //                   <div className="w-3 h-3 bg-[#C8A97E] rounded-full"></div>
    //                   <div className="h-full w-0.5 bg-[#C8A97E]/30"></div>
    //                 </div>
    //                 <div>
    //                   <h4 className="font-medium">Preliminary Screening</h4>
    //                   <p className="text-gray-400 text-sm">March 10, 2024</p>
    //                 </div>
    //               </li>
    //               <li className="flex">
    //                 <div className="mr-4 flex flex-col items-center">
    //                   <div className="w-3 h-3 bg-[#C8A97E] rounded-full"></div>
    //                   <div className="h-full w-0.5 bg-[#C8A97E]/30"></div>
    //                 </div>
    //                 <div>
    //                   <h4 className="font-medium">Semi-Finals</h4>
    //                   <p className="text-gray-400 text-sm">April 20, 2024</p>
    //                 </div>
    //               </li>
    //               <li className="flex">
    //                 <div className="mr-4 flex flex-col items-center">
    //                   <div className="w-3 h-3 bg-[#C8A97E] rounded-full"></div>
    //                 </div>
    //                 <div>
    //                   <h4 className="font-medium">Grand Finale</h4>
    //                   <p className="text-gray-400 text-sm">June 15, 2024</p>
    //                 </div>
    //               </li>
    //             </ul>
    //           </div>

    //           <div>
    //             <div className="flex items-center mb-4">
    //               <FiUsers className="text-[#C8A97E] h-6 w-6 mr-3" />
    //               <h3 className="text-xl font-semibold">Eligibility Criteria</h3>
    //             </div>
    //             <ul className="space-y-3 text-gray-300">
    //               <li className="flex items-start">
    //                 <span className="text-[#C8A97E] mr-2">•</span>
    //                 <span>Lagos indigene or of Lagos descent</span>
    //               </li>
    //               <li className="flex items-start">
    //                 <span className="text-[#C8A97E] mr-2">•</span>
    //                 <span>Age 25-40 years</span>
    //               </li>
    //               <li className="flex items-start">
    //                 <span className="text-[#C8A97E] mr-2">•</span>
    //                 <span>Demonstrated community service</span>
    //               </li>
    //               <li className="flex items-start">
    //                 <span className="text-[#C8A97E] mr-2">•</span>
    //                 <span>Knowledge of Lagos culture and heritage</span>
    //               </li>
    //               <li className="flex items-start">
    //                 <span className="text-[#C8A97E] mr-2">•</span>
    //                 <span>Good character and leadership qualities</span>
    //               </li>
    //             </ul>

    //             <Button className="mt-6 bg-[#C8A97E] hover:bg-[#8A6D3B] text-white w-full">Apply Now</Button>
    //           </div>
    //         </div>
    //       </motion.div>
    //     </div>
    //   </section>

    //   {/* Testimonials */}
    //   <section ref={testimonialRef} className="py-16 bg-white">
    //     <div className="container mx-auto px-4">
    //       <motion.div
    //         initial="hidden"
    //         animate={testimonialInView ? "visible" : "hidden"}
    //         variants={fadeIn}
    //         className="text-center max-w-3xl mx-auto mb-12"
    //       >
    //         <Badge className="mb-4 bg-[#C8A97E] text-white hover:bg-[#C8A97E]/90">Voices of Experience</Badge>
    //         <h2 className="text-3xl md:text-4xl font-bold mb-6">Winner Testimonials</h2>
    //         <p className="text-gray-600">
    //           Hear from past winners about their experiences and the impact of the Mr. & Mrs. Eko title.
    //         </p>
    //       </motion.div>

    //       <motion.div
    //         initial="hidden"
    //         animate={testimonialInView ? "visible" : "hidden"}
    //         variants={staggerContainer}
    //         className="grid grid-cols-1 md:grid-cols-3 gap-6"
    //       >
    //         {testimonials.map((testimonial, index) => (
    //           <motion.div key={index} variants={fadeIn} className="bg-gray-50 p-6 rounded-lg shadow-md">
    //             <div className="mb-4 text-[#C8A97E]">
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="36"
    //                 height="36"
    //                 viewBox="0 0 24 24"
    //                 fill="none"
    //                 stroke="currentColor"
    //                 strokeWidth="2"
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //               >
    //                 <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
    //                 <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
    //               </svg>
    //             </div>
    //             <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
    //             <div className="flex items-center">
    //               <div className="w-10 h-10 bg-[#C8A97E]/20 rounded-full flex items-center justify-center text-[#C8A97E]">
    //                 <FiUser className="h-5 w-5" />
    //               </div>
    //               <div className="ml-3">
    //                 <h4 className="font-medium">{testimonial.author}</h4>
    //                 <p className="text-gray-500 text-sm">{testimonial.title}</p>
    //               </div>
    //             </div>
    //           </motion.div>
    //         ))}
    //       </motion.div>
    //     </div>
    //   </section>

    //   {/* Call to Action */}
    //   <section ref={ctaRef} className="py-16 bg-[#C8A97E]">
    //     <div className="container mx-auto px-4">
    //       <motion.div
    //         initial="hidden"
    //         animate={ctaInView ? "visible" : "hidden"}
    //         variants={fadeIn}
    //         className="text-center max-w-3xl mx-auto"
    //       >
    //         <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Represent Lagos?</h2>
    //         <p className="text-white/90 mb-8">
    //           Apply now for the upcoming Mr. & Mrs. Eko competition and become part of a prestigious legacy of cultural
    //           ambassadors making a difference in our communities.
    //         </p>
    //         <div className="flex flex-wrap justify-center gap-4">
    //           <Button className="bg-white text-[#C8A97E] hover:bg-gray-100 px-8 py-6">Apply for Competition</Button>
    //           <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6">
    //             Learn More <FiArrowRight className="ml-2" />
    //           </Button>
    //         </div>
    //       </motion.div>
    //     </div>
    //   </section>
    // </main>
    <div className="pt-24 overflow-hidden">
      <div className="bg-gray-100 py-4 mb-8">
         <div className="container mx-auto px-4">
           <div className="flex items-center text-sm text-gray-600">
             <Link href="/" className="hover:text-[#C8A97E] transition-colors">
               Home
             </Link>
             <span className="mx-2">/</span>
             <Link href="/#projects" className="hover:text-[#C8A97E] transition-colors">
               Our Projects
             </Link>
             <span className="mx-2">/</span>
             <span className="text-[#C8A97E]">ECI Mr. & Mrs. Eko</span>
           </div>
         </div>
       </div>
       <div className = "py-20 px-20">
        <h1 className="font-bold text-5xl text-center">
          This page is under construction ;)
        </h1>
       </div>
    </div>
  )
}

