"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProjectHero from "@/components/sections/project-hero"
import { formatDateUTC } from "@/lib/format-date"
import { pdfCoverFromUrl } from "@/lib/cloudinary-upload"
import { COMMUNICATOR_ACCENT, COMMUNICATOR_HERO } from "@/lib/project-theme"

interface Magazine {
  _id: string
  title: string
  issueNumber?: string
  publishedDate: string
  description?: string
  coverImage?: string
  pdfUrl: string
}

const coverOf = (m: Magazine) => m.coverImage || pdfCoverFromUrl(m.pdfUrl) || "/placeholder.svg?height=800&width=600"

function SectionHeading({ lead, highlight }: { lead: string; highlight: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        {lead} <span style={{ color: COMMUNICATOR_ACCENT }}>{highlight}</span>
      </h2>
      <div className="h-1 w-20 mx-auto" style={{ backgroundColor: COMMUNICATOR_ACCENT }}></div>
    </div>
  )
}

export default function EkoCommunicatorPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    fetch("/api/eko-communicator")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setMagazines)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const [latest, ...archive] = magazines
  const q = query.trim().toLowerCase()
  const filteredArchive = q
    ? archive.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.issueNumber?.toLowerCase().includes(q) ||
          formatDateUTC(m.publishedDate, "monthYear").toLowerCase().includes(q),
      )
    : archive

  return (
    <div className="pt-24 bg-white">
      <ProjectHero
        image={COMMUNICATOR_HERO}
        title="Eko Communicator"
        subtitle="The official magazine of Eko Club International. Read every publication online."
        accent={COMMUNICATOR_ACCENT}
        crumbs={[{ label: "Home", href: "/" }, { label: "Our Projects", href: "/#projects" }, { label: "Eko Communicator" }]}
      />

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: COMMUNICATOR_ACCENT }} />
        </div>
      ) : error ? (
        <p className="text-center py-32 text-gray-500">Unable to load publications right now. Please try again later.</p>
      ) : !latest ? (
        <div className="text-center py-32 px-4">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No publications yet. Please check back soon.</p>
        </div>
      ) : (
        <>
          <section className="py-20">
            <div className="container mx-auto px-4">
              <SectionHeading lead="Latest" highlight="Publication" />
              <div className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-12 items-center max-w-5xl mx-auto">
                <Link href={`/projects/eko-communicator/${latest._id}`} className="group block mx-auto w-full max-w-[340px]">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl bg-gray-100">
                    <img
                      src={coverOf(latest)}
                      alt={`${latest.title} cover`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 text-center md:text-left"
                >
                  {latest.issueNumber && (
                    <p className="font-medium" style={{ color: COMMUNICATOR_ACCENT }}>
                      {latest.issueNumber}
                    </p>
                  )}
                  <h3 className="text-3xl font-bold text-gray-800">{latest.title}</h3>
                  <p className="text-gray-500">{formatDateUTC(latest.publishedDate, "monthYear")}</p>
                  {latest.description && (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{latest.description}</p>
                  )}
                  <Button asChild className="text-white mt-2 hover:opacity-90" style={{ backgroundColor: COMMUNICATOR_ACCENT }}>
                    <Link href={`/projects/eko-communicator/${latest._id}`}>
                      <BookOpen className="h-4 w-4 mr-2" /> Read This Publication
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {archive.length > 0 && (
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <SectionHeading lead="Past" highlight="Publications" />
                <div className="relative w-full sm:w-80 mx-auto mb-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, edition or month"
                    className="pl-9 bg-white"
                  />
                </div>

                {filteredArchive.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">No publications match your search.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredArchive.map((m, i) => (
                      <motion.div
                        key={m._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
                      >
                        <Link href={`/projects/eko-communicator/${m._id}`} className="group block">
                          <div className="aspect-[3/4] rounded-md overflow-hidden shadow-md bg-gray-200 mb-3">
                            <img
                              src={coverOf(m)}
                              alt={`${m.title} cover`}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h3 className="font-semibold text-gray-800 line-clamp-2">{m.title}</h3>
                          <p className="text-sm text-gray-500">
                            {[m.issueNumber, formatDateUTC(m.publishedDate, "monthYear")].filter(Boolean).join(" · ")}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
