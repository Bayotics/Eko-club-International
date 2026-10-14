// pdf.mjs is itself a webpack bundle and crashes when Next re-bundles it; the minified build does not.
export async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist/build/pdf.min.mjs")
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()
  return pdfjs
}
