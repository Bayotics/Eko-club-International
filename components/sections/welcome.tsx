"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

export default function Welcome() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section className="py-20 md:py-28 bg-white px-4 md:px-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide uppercase">Welcome to Eko Club International</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="text-[#8A6D3B] uppercase tracking-widest text-sm font-medium">AN</p>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#151f58] leading-tight">
                EXCLUSIVE
                <br />
                MEMBERS ONLY
                <br />
                COMMUNITY
              </h3>
              <p className="text-[#8A6D3B] text-lg md:text-xl font-light tracking-wide uppercase">
                For Lagos Indigenes and Friends Worldwide
              </p>
            </div>

            <div className="pt-6">
              <Link href="/about/our-story" className="inline-block">
                <Button
                  variant="link"
                  className="text-[#8A6D3B] hover:text-[#C8A97E] uppercase tracking-widest text-sm font-medium border-b border-[#8A6D3B] rounded-none px-0 hover:border-[#C8A97E]"
                >
                  Read Our Story
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src="/images/welcome1.jpg"
                    alt="Eko Club Members"
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-md">
                  <Image
                    src="/images/welcome3.jpg"
                    alt="Eko Club Event"
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-8">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src="/images/welcome2.jpg"
                    alt="Eko Club Project"
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-md">
                  <Image
                    src="/images/welcome4.jpg"
                    alt="Eko Club Community"
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Video Play Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1,
                  type: "spring",
                  stiffness: 200,
                }}
                onClick={() => setVideoOpen(true)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 
                bg-white rounded-full w-24 h-24 flex items-center justify-center
                shadow-lg hover:shadow-xl transition-all duration-300
                hover:scale-105 focus:outline-none"
                aria-label="Play video"
              >
                <Play className="h-12 w-12 text-black" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 bg-black overflow-hidden">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20">
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/zLBC4nPznHc?si=583ln9M2KOUU-oIH"
              title="Eko Club International Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

