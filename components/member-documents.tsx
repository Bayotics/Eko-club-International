"use client"

import { useEffect, useState } from "react"
import { FileText, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function MemberDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState({})

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setDocuments([])
          setLoading(false)
          return
        }

        const response = await fetch("/api/documents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch documents")
        }

        const data = await response.json()
        setDocuments(data)
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast.error("Failed to load documents")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleDownload = async (documentId, title) => {
    setDownloading((prev) => ({ ...prev, [documentId]: true }))
    try {
      const token = localStorage.getItem("token")

      // Create a link element
      const link = document.createElement("a")
      link.href = `/api/documents/${documentId}/pdf`

      // Add authorization header via fetch
      const response = await fetch(`/api/documents/${documentId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to download document")
      }

      // Convert response to blob
      const blob = await response.blob()

      // Create object URL
      const url = window.URL.createObjectURL(blob)

      // Set link attributes
      link.href = url
      link.download = `${title.replace(/\s+/g, "_")}.pdf`

      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up object URL
      window.URL.revokeObjectURL(url)

      toast.success("Document downloaded successfully")
    } catch (error) {
      console.error("Error downloading document:", error)
      toast.error("Failed to download document")
    } finally {
      setDownloading((prev) => ({ ...prev, [documentId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#C8A97E]" />
        <span className="ml-2">Loading documents...</span>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No documents available</h3>
        <p className="mt-1 text-gray-500">Check back later for club documents and resources.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div key={document._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">{document.title}</h4>
              <p className="text-xs text-gray-500">
                {document.description.length > 100
                  ? `${document.description.substring(0, 100)}...`
                  : document.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">Added: {new Date(document.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => handleDownload(document._id, document.title)}
            disabled={downloading[document._id]}
          >
            {downloading[document._id] ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-1 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </div>
      ))}
    </div>
  )
}
