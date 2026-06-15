"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Quote } from "lucide-react"

export default function Founder() {
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
              <Quote className="inline-block h-8 w-8 text-[#8A6D3B] mr-2 -mt-4 align-top" style={{ transform: "scaleX(-1)" }} />
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
              <div className="uppercase tracking-wider text-sm font-semibold text-[#648829] pb-1 hover:text-[#284e19] hover:border-[#C8A97E] transition-colors">
                Hon. Dr. Lola Ogbara-Alogba, President
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
                src="/images/president-note.jpg"
                alt="President of Eko Club International"
                width={500}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
