"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import Image from "next/image"

const events = [
  {
    id: 1,
    title: "Annual Medical Mission",
    description:
      "Join us for our annual medical mission to Lagos, providing essential healthcare services to underserved communities.",
    image: "/placeholder.svg?height=400&width=600",
    date: "October 15-22, 2024",
    location: "Lagos, Nigeria",
    time: "9:00 AM - 5:00 PM",
  },
  {
    id: 2,
    title: "Cultural Gala Night",
    description:
      "A celebration of Lagos culture with traditional music, dance, food, and fashion showcasing our rich heritage.",
    image: "/placeholder.svg?height=400&width=600",
    date: "August 12, 2024",
    location: "Atlanta, GA",
    time: "6:00 PM - 11:00 PM",
  },
  {
    id: 3,
    title: "Scholarship Fundraiser",
    description: "Help us raise funds to support educational opportunities for deserving students in our communities.",
    image: "/placeholder.svg?height=400&width=600",
    date: "September 5, 2024",
    location: "New York, NY",
    time: "7:00 PM - 10:00 PM",
  },
]

export default function Events() {
  return (
    <section id="events" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            UPCOMING <span className="text-[#C8A97E] font-medium">EVENTS</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-[#C8A97E] mx-auto mb-6"
          />
          <p className="text-gray-600 max-w-3xl mx-auto">
            Join us at our upcoming events and be part of our mission to make a difference in our communities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-0 overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6 flex-grow">
                  <h3 className="text-xl font-medium mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-[#C8A97E] mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-[#C8A97E] mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-[#C8A97E] mr-2" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none uppercase">
                    Register
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="border-2 border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-black transition-colors duration-300 rounded-none px-8 py-6 uppercase">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  )
}

