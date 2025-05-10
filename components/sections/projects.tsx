"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const projects = [
  {
    id: "medical",
    title: "Medical Missions",
    description: "Providing essential healthcare services to communities in Lagos, Nigeria.",
    image: "/images/projects-medical.jpg?height=400&width=600",
    location: "Lagos, Nigeria",
    date: "Annual",
    impact: "10,000+ patients served",
    details:
      "Our medical missions bring healthcare professionals to provide free medical services, including consultations, surgeries, and medication to underserved communities in Lagos, Nigeria.",
  },
  {
    id: "education",
    title: "Educational Support",
    description: "Scholarships and educational resources for students.",
    image: "/images/projects-education.jpg?height=400&width=600",
    location: "Multiple Locations",
    date: "Ongoing",
    impact: "500+ students supported",
    details:
      "We provide scholarships, educational materials, and infrastructure support to schools, helping students achieve their academic goals and build a brighter future.",
  },
  {
    id: "community",
    title: "Community Development",
    description: "Infrastructure and social welfare projects.",
    image: "/images/projects-community.jpg?height=400&width=600",
    location: "Lagos Communities",
    date: "Ongoing",
    impact: "15+ communities improved",
    details:
      "From health projects to community centers, we invest in infrastructure that improves quality of life and creates sustainable development in local communities.",
  },
  {
    id: "cultural",
    title: "Cultural Preservation",
    description: "Promoting and preserving Lagos cultural heritage.",
    image: "/images/projects-cultural.jpg?height=400&width=600",
    location: "Global",
    date: "Year-round",
    impact: "Thousands engaged annually",
    details:
      "Through events, publications, and digital initiatives, we work to preserve and promote the rich cultural heritage of Lagos for future generations.",
  },
]

export default function Projects() {
  const [activeTab, setActiveTab] = useState("medical")
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section id="projects" className="scroll-section bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-10">Our Projects</h2>
          <div className="h-1 w-24 bg-primary mx-auto mb-6" />
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the impactful initiatives we're leading to make a difference in communities locally and
            internationally.
          </p>
        </motion.div>

        <Tabs defaultValue="medical" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="medical" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Medical
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Education
              </TabsTrigger>
              <TabsTrigger value="community" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Community
              </TabsTrigger>
              <TabsTrigger value="cultural" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Cultural
              </TabsTrigger>
            </TabsList>
          </div>

          {projects.map((project) => (
            <TabsContent key={project.id} value={project.id} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{project.details}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{project.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>{project.impact}</span>
                      </div>
                    </div>

                    <Button className="mt-4">
                      <Link href={'/about/our-mission'}>                      
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

