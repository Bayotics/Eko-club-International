"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

export default function Founder() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center px-4 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <p className="text-[#8A6D3B] uppercase tracking-widest text-sm font-medium">NOTE FROM THE PRESIDENT</p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#151f58] leading-tight">
              We Are Providing An Environment In Which Our Members Build Mutual Trust
            </h2>

            <div className="text-gray-700 space-y-4">
              <p>
                EKO CLUB INTERNATIONAL, Nigeria's premier community organization for Lagos indigenes and friends, is
                established to serve and support our members worldwide through cultural preservation, community
                development, and mutual aid.
              </p>
              <p>
                Our Vision is "To contribute to the socio-economic growth and transformation of Lagos by empowering our
                members to organize around the principles of community service, cultural heritage, and participation in
                civic engagement."
              </p>
            </div>

            <div className="pt-4">
              <div
                className="uppercase tracking-wider text-sm font-medium text-[#91be48] pb-1 hover:text-[#284e19] hover:border-[#C8A97E] transition-colors"
              >
                Hon. Saheed Olushi, President
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-md">
              <Image
                src="/images/president.jpg"
                alt="President of Eko Club International"
                width={500}
                height={600}
                className="w-full h-auto"
              />
            </div>

            {/* Video Play Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              onClick={() => setVideoOpen(true)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 
                        bg-white/90 rounded-full w-20 h-20 flex items-center justify-center
                        shadow-lg hover:shadow-xl transition-all duration-300
                        hover:scale-110 focus:outline-none"
              aria-label="Play founder's message"
            >
              <Play className="h-10 w-10 text-black" />
            </motion.button>
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
              // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
              src = "https://res.cloudinary.com/dvrpa1lyo/video/upload/v1745481734/t1umoljisiqbxdhe1fmf.mp4"
              title="Founder's Message - Eko Club International"
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

