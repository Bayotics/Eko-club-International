"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, UserRound } from "lucide-react"
import ProjectHero from "@/components/sections/project-hero"
import { lifeSpan } from "@/lib/format-date"
import { MEMORIAL_ACCENT, MEMORIAL_HERO } from "@/lib/project-theme"

interface Memorial {
  _id: string
  name: string
  photo?: string
  dateOfBirth?: string | null
  dateOfPassing: string
  chapter?: string
  role?: string
}

export default function InLovingMemoryPage() {
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/memorials")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setMemorials)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-24 bg-white">
      <ProjectHero
        image={MEMORIAL_HERO}
        title="In Loving Memory"
        subtitle="Honouring the members of Eko Club International who have gone before us."
        accent={MEMORIAL_ACCENT}
        crumbs={[{ label: "Home", href: "/" }, { label: "Our Projects", href: "/#projects" }, { label: "In Loving Memory" }]}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Forever <span style={{ color: MEMORIAL_ACCENT }}>Remembered</span>
            </h2>
            <div className="h-1 w-20 mx-auto" style={{ backgroundColor: MEMORIAL_ACCENT }}></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: MEMORIAL_ACCENT }} />
            </div>
          ) : error ? (
            <p className="text-center py-20 text-gray-500">Unable to load this page right now. Please try again later.</p>
          ) : memorials.length === 0 ? (
            <p className="text-center py-20 text-gray-500">There are no entries yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {memorials.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.06 }}
                >
                  <Link
                    href={`/projects/in-loving-memory/${m._id}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt={m.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserRound className="h-20 w-20 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-lg font-semibold text-gray-800">{m.name}</h3>
                      <p className="text-sm mt-1" style={{ color: MEMORIAL_ACCENT }}>
                        {lifeSpan(m)}
                      </p>
                      {(m.chapter || m.role) && (
                        <p className="text-gray-500 text-sm mt-2">{[m.role, m.chapter].filter(Boolean).join(", ")}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
