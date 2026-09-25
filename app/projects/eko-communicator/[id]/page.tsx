"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectHero from "@/components/sections/project-hero"
import { formatDateUTC } from "@/lib/format-date"
import { pdfCoverFromUrl } from "@/lib/cloudinary-upload"
import { COMMUNICATOR_ACCENT, COMMUNICATOR_HERO } from "@/lib/project-theme"

const PdfReader = dynamic(() => import("@/components/pdf-reader"), {
  ssr: false,
  loading: () => (
    <div className="h-[80vh] min-h-[500px] rounded-lg bg-neutral-800 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-white/70" />
    </div>
  ),
})

interface Magazine {
  _id: string
  title: string
  issueNumber?: string
  publishedDate: string
  description?: string
  coverImage?: string
  pdfUrl: string
}

export default function MagazineReaderPage() {
  const { id } = useParams<{ id: string }>()
  const [magazine, setMagazine] = useState<Magazine | null>(null)
  const [others, setOthers] = useState<Magazine[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading")

  useEffect(() => {
    setStatus("loading")
    fetch(`/api/eko-communicator/${id}`)
      .then(async (res) => {
        if (res.status === 404) return setStatus("notfound")
        if (!res.ok) return setStatus("error")
        setMagazine(await res.json())
        setStatus("ready")
      })
      .catch(() => setStatus("error"))

    fetch("/api/eko-communicator")
      .then((res) => (res.ok ? res.json() : []))
      .then((list: Magazine[]) => setOthers(list.filter((m) => m._id !== id).slice(0, 4)))
      .catch(() => setOthers([]))
  }, [id])

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Our Projects", href: "/#projects" },
    { label: "Eko Communicator", href: "/projects/eko-communicator" },
    { label: magazine?.title ?? "Publication" },
  ]

  return (
    <div className="pt-24 bg-white">
      <ProjectHero
        compact
        image={COMMUNICATOR_HERO}
        title={magazine?.title ?? "Eko Communicator"}
        subtitle={magazine ? [magazine.issueNumber, formatDateUTC(magazine.publishedDate, "monthYear")].filter(Boolean).join(" · ") : undefined}
        accent={COMMUNICATOR_ACCENT}
        crumbs={crumbs}
      />

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {status === "loading" ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: COMMUNICATOR_ACCENT }} />
            </div>
          ) : status !== "ready" || !magazine ? (
            <div className="text-center py-24">
              <p className="text-gray-600 mb-6">
                {status === "notfound" ? "This publication could not be found." : "Unable to load this publication right now."}
              </p>
              <Button asChild variant="outline">
                <Link href="/projects/eko-communicator">
                  <ArrowLeft className="h-4 w-4 mr-2" /> All publications
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Link
                href="/projects/eko-communicator"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> All publications
              </Link>

              {magazine.description && (
                <p className="text-gray-600 mb-8 max-w-3xl leading-relaxed whitespace-pre-line">{magazine.description}</p>
              )}

              <PdfReader url={magazine.pdfUrl} title={magazine.title} />
            </>
          )}
        </div>
      </section>

      {status === "ready" && others.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                More <span style={{ color: COMMUNICATOR_ACCENT }}>Publications</span>
              </h2>
              <div className="h-1 w-20 mx-auto" style={{ backgroundColor: COMMUNICATOR_ACCENT }}></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {others.map((m) => (
                <Link key={m._id} href={`/projects/eko-communicator/${m._id}`} className="group block">
                  <div className="aspect-[3/4] rounded-md overflow-hidden shadow-md bg-gray-200 mb-3">
                    <img
                      src={m.coverImage || pdfCoverFromUrl(m.pdfUrl) || "/placeholder.svg?height=800&width=600"}
                      alt={`${m.title} cover`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{m.title}</h3>
                  <p className="text-sm text-gray-500">{formatDateUTC(m.publishedDate, "monthYear")}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
