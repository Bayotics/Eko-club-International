"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Heart, Users, Globe, Award } from "lucide-react"
import CountUp from "react-countup"

export default function Impact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    {
      icon: <Heart className="h-10 w-10 text-red-500" />,
      value: 25000,
      label: "Lives Impacted",
      suffix: "+",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      value: 2000,
      label: "Members Worldwide",
      suffix: "+",
    },
    {
      icon: <Globe className="h-10 w-10 text-green-500" />,
      value: 22,
      label: "Chapters",
      suffix: "",
    },
    {
      icon: <Award className="h-10 w-10 text-yellow-500" />,
      value: 25,
      label: "Years of Service",
      suffix: "",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <div className="h-1 w-24 bg-white mx-auto mb-6" />
        </motion.div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 p-4 bg-white/10 rounded-full">{stat.icon}</div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2">
                {isInView ? <CountUp end={stat.value} duration={2.5} separator="," suffix={stat.suffix} /> : "0"}
              </h3>
              <p className="text-lg text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

