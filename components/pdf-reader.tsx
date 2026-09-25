"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist"
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2, Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25
const MAX_PAGE_WIDTH = 900

// pdf.mjs is itself a webpack bundle and crashes when Next re-bundles it; the minified build does not.
async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist/build/pdf.min.mjs")
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()
  return pdfjs
}

export default function PdfReader({ url, title }: { url: string; title: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTaskRef = useRef<RenderTask | null>(null)
  const touchStartX = useRef<number | null>(null)

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [rendering, setRendering] = useState(false)
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState("1")
  const [zoom, setZoom] = useState(1)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const numPages = pdf?.numPages ?? 0

  useEffect(() => {
    let cancelled = false
    let doc: PDFDocumentProxy | null = null
    setStatus("loading")
    setPdf(null)
    setPage(1)
    setPageInput("1")

    loadPdfJs()
      .then((pdfjs) => pdfjs.getDocument({ url }).promise)
      .then((loaded) => {
        doc = loaded
        if (cancelled) return loaded.destroy()
        setPdf(loaded)
        setStatus("ready")
      })
      .catch((error) => {
        console.error("PDF load error:", error)
        if (!cancelled) setStatus("error")
      })

    return () => {
      cancelled = true
      renderTaskRef.current?.cancel()
      doc?.destroy()
    }
  }, [url])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const pageWidth = Math.min(Math.max(containerWidth - 16, 0), MAX_PAGE_WIDTH) * zoom

  useEffect(() => {
    if (!pdf || !canvasRef.current || pageWidth <= 0) return
    let cancelled = false

    const render = async () => {
      renderTaskRef.current?.cancel()
      setRendering(true)
      const pdfPage = await pdf.getPage(page)
      if (cancelled) return

      const dpr = window.devicePixelRatio || 1
      const scale = pageWidth / pdfPage.getViewport({ scale: 1 }).width
      const viewport = pdfPage.getViewport({ scale: scale * dpr })
      const canvas = canvasRef.current!
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`

      const task = pdfPage.render({ canvas, canvasContext: canvas.getContext("2d")!, viewport })
      renderTaskRef.current = task
      try {
        await task.promise
      } catch (error: any) {
        if (error?.name !== "RenderingCancelledException") console.error("PDF render error:", error)
      } finally {
        if (!cancelled) setRendering(false)
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [pdf, page, pageWidth])

  const goTo = useCallback(
    (target: number) => {
      if (!numPages) return
      const next = Math.min(Math.max(target, 1), numPages)
      setPage(next)
      setPageInput(String(next))
      viewportRef.current?.scrollTo({ top: 0 })
    },
    [numPages],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (event.key === "ArrowRight") goTo(page + 1)
      if (event.key === "ArrowLeft") goTo(page - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [page, goTo])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else wrapperRef.current?.requestFullscreen?.()
  }

  const toolbarButton = "text-white hover:bg-white/10 hover:text-white"

  return (
    <div
      ref={wrapperRef}
      className={`flex flex-col bg-neutral-800 overflow-hidden ${isFullscreen ? "h-screen" : "h-[80vh] min-h-[500px] rounded-lg"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-neutral-900 text-white">
        <p className="text-sm font-medium truncate max-w-[40%] hidden sm:block" title={title}>
          {title}
        </p>

        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className={toolbarButton} onClick={() => goTo(page - 1)} disabled={page <= 1} aria-label="Previous page">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const n = parseInt(pageInput, 10)
              if (Number.isNaN(n)) setPageInput(String(page))
              else goTo(n)
            }}
            className="flex items-center gap-1 text-sm"
          >
            <input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
              onBlur={() => setPageInput(String(page))}
              inputMode="numeric"
              aria-label="Page number"
              className="w-10 rounded bg-white/10 text-center py-1 outline-none focus:ring-1 focus:ring-white/40"
            />
            <span className="text-white/70">/ {numPages || "–"}</span>
          </form>
          <Button size="icon" variant="ghost" className={toolbarButton} onClick={() => goTo(page + 1)} disabled={!numPages || page >= numPages} aria-label="Next page">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className={toolbarButton} onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">
            <ZoomOut className="h-5 w-5" />
          </Button>
          <button onClick={() => setZoom(1)} className="text-xs w-12 text-center text-white/80 hover:text-white" aria-label="Reset zoom">
            {Math.round(zoom * 100)}%
          </button>
          <Button size="icon" variant="ghost" className={toolbarButton} onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className={toolbarButton} onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative flex-1 overflow-auto"
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={(e) => {
          touchStartX.current = zoom <= 1 ? e.touches[0].clientX : null
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const dx = e.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(dx) > 60) goTo(dx < 0 ? page + 1 : page - 1)
          touchStartX.current = null
        }}
      >
        {status === "error" ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-white/80 gap-3 p-6">
            <AlertTriangle className="h-10 w-10 text-yellow-400" />
            <p>This publication could not be loaded. Please try again later.</p>
          </div>
        ) : (
          <>
            {(status === "loading" || rendering) && (
              <div className="absolute inset-0 flex items-center justify-center text-white/80 gap-2 pointer-events-none z-10">
                <Loader2 className="h-6 w-6 animate-spin" />
                {status === "loading" && "Loading publication..."}
              </div>
            )}
            <div className="flex justify-center py-4 px-2 min-w-fit">
              <canvas ref={canvasRef} className={`shadow-2xl bg-white ${status === "ready" ? "" : "invisible"}`} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
