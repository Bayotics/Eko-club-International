"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

interface Crumb {
  label: string
  href?: string
}

interface ProjectHeroProps {
  image: string
  title: string
  subtitle?: string
  accent: string
  crumbs: Crumb[]
  compact?: boolean
}

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }

export default function ProjectHero({ image, title, subtitle, accent, crumbs, compact = false }: ProjectHeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${compact ? "h-[40vh] min-h-[320px]" : "h-[60vh] min-h-[500px]"}`}
    >
      <div className="absolute inset-0 z-0">
        <Image src={image} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
          <motion.div variants={fadeIn} className="mb-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-white/80 mb-4">
              {crumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight className="h-4 w-4" />}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-[var(--accent)]"
                      style={{ ["--accent" as string]: accent }}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span style={{ color: accent }}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{title}</h1>
          </motion.div>
          <motion.div variants={fadeIn}>
            <div className="h-1 w-24 mx-auto mb-6" style={{ backgroundColor: accent }}></div>
            {subtitle && <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{subtitle}</p>}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
