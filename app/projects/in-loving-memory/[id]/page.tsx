"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, UserRound, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import ProjectHero from "@/components/sections/project-hero"
import { formatDateUTC } from "@/lib/format-date"
import { MEMORIAL_ACCENT, MEMORIAL_HERO } from "@/lib/project-theme"

interface Memorial {
  _id: string
  name: string
  photo?: string
  dateOfBirth?: string | null
  dateOfPassing: string
  chapter?: string
  role?: string
  biography?: string
  gallery?: string[]
}

const richText =
  "text-left text-gray-700 text-lg leading-relaxed [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_a]:text-[#8A6D3B] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#C8A97E] [&_blockquote]:pl-4 [&_blockquote]:italic"

export default function MemorialDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [memorial, setMemorial] = useState<Memorial | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    setStatus("loading")
    fetch(`/api/memorials/${id}`)
      .then(async (res) => {
        if (res.status === 404) return setStatus("notfound")
        if (!res.ok) return setStatus("error")
        setMemorial(await res.json())
        setStatus("ready")
      })
      .catch(() => setStatus("error"))
  }, [id])

  const gallery = memorial?.gallery ?? []

  const step = useCallback(
    (delta: number) => {
      setLightboxIndex((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length))
    },
    [gallery.length],
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxIndex, step])

  const dates = memorial
    ? memorial.dateOfBirth
      ? `${formatDateUTC(memorial.dateOfBirth)} – ${formatDateUTC(memorial.dateOfPassing)}`
      : `Passed on ${formatDateUTC(memorial.dateOfPassing)}`
    : undefined

  return (
    <div className="pt-24 bg-white">
      <ProjectHero
        compact
        image={MEMORIAL_HERO}
        title={memorial?.name ?? "In Loving Memory"}
        subtitle={dates}
        accent={MEMORIAL_ACCENT}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Our Projects", href: "/#projects" },
          { label: "In Loving Memory", href: "/projects/in-loving-memory" },
          { label: memorial?.name ?? "Tribute" },
        ]}
      />

      {status === "loading" ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: MEMORIAL_ACCENT }} />
        </div>
      ) : status !== "ready" || !memorial ? (
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-gray-600 mb-6">
            {status === "notfound" ? "This page could not be found." : "Unable to load this page right now."}
          </p>
          <Button asChild variant="outline">
            <Link href="/projects/in-loving-memory">
              <ArrowLeft className="h-4 w-4 mr-2" /> In Loving Memory
            </Link>
          </Button>
        </div>
      ) : (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link
              href="/projects/in-loving-memory"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> In Loving Memory
            </Link>

            <div className="grid md:grid-cols-[320px_1fr] gap-10 items-start">
              <div className="mx-auto w-full max-w-[320px]">
                <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 shadow-xl">
                  {memorial.photo ? (
                    <img src={memorial.photo} alt={memorial.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserRound className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="uppercase tracking-widest text-xs font-medium mb-3" style={{ color: MEMORIAL_ACCENT }}>
                  In Loving Memory of
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{memorial.name}</h2>
                <p className="text-gray-600 text-lg">{dates}</p>
                {(memorial.role || memorial.chapter) && (
                  <p className="text-gray-500 mt-2">{[memorial.role, memorial.chapter].filter(Boolean).join(", ")}</p>
                )}
                <div className="h-1 w-20 my-8 mx-auto md:mx-0" style={{ backgroundColor: MEMORIAL_ACCENT }} />
                {memorial.biography && (
                  <div className={richText} dangerouslySetInnerHTML={{ __html: memorial.biography }} />
                )}
              </div>
            </div>

            {gallery.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  Photo <span style={{ color: MEMORIAL_ACCENT }}>Gallery</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {gallery.map((url, i) => (
                    <button
                      key={url + i}
                      onClick={() => setLightboxIndex(i)}
                      className="aspect-square rounded-md overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
                      aria-label={`Open photo ${i + 1} of ${gallery.length}`}
                    >
                      <img
                        src={url}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-0">
          <DialogTitle className="sr-only">
            Photo {lightboxIndex !== null ? lightboxIndex + 1 : ""} of {gallery.length}
          </DialogTitle>
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center min-h-[50vh]">
              <img src={gallery[lightboxIndex]} alt="" className="max-h-[85vh] w-auto object-contain" />
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-3 right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => step(-1)}
                    className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => step(1)}
                    className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <p className="absolute bottom-3 text-white/70 text-sm">
                    {lightboxIndex + 1} / {gallery.length}
                  </p>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
