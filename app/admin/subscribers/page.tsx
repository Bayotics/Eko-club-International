"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import { Search, Trash2, Download, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface Subscriber {
  _id: string
  email: string
  subscriptionDate: string
  status: "active" | "unsubscribed"
  source?: string
  lastEmailSent?: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export default function SubscribersPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 50,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  // Fetch subscribers
  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status,
        search,
      })

      const response = await fetch(`/api/admin/subscribers?${queryParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subscribers")
      }

      setSubscribers(data.data.subscribers)
      setPagination(data.data.pagination)
    } catch (error) {
      console.error("Error fetching subscribers:", error)
      toast.error("Failed to load subscribers")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSubscribers()
  }, [pagination.page, status])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchSubscribers()
  }

  // Handle delete
  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete subscriber: ${email}?`)) {
      return
    }

    setDeleteLoading(id)
    try {
      const response = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete subscriber")
      }

      toast.success("Subscriber deleted successfully")
      fetchSubscribers()
    } catch (error) {
      console.error("Error deleting subscriber:", error)
      toast.error("Failed to delete subscriber")
    } finally {
      setDeleteLoading(null)
    }
  }

  // Export CSV
  const exportCSV = () => {
    // Create CSV content
    const headers = ["Email", "Subscription Date", "Status", "Source"]
    const csvContent = [
      headers.join(","),
      ...subscribers.map((sub) =>
        [
          sub.email,
          new Date(sub.subscriptionDate).toISOString().split("T")[0],
          sub.status,
          sub.source || "website",
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `subscribers_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Generate pagination items
  const getPaginationItems = () => {
    const items = []
    const maxPages = Math.min(pagination.pages, 5)
    let startPage = Math.max(1, pagination.page - 2)
    const endPage = Math.min(pagination.pages, startPage + 4)

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={pagination.page === i}
            onClick={() => setPagination((prev) => ({ ...prev, page: i }))}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={subscribers.length === 0 || loading}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="w-full md:w-48">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscribers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No subscribers found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date Subscribed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber._id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>{format(new Date(subscriber.subscriptionDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscriber.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {subscriber.status}
                        </span>
                      </TableCell>
                      <TableCell>{subscriber.source || "website"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subscriber._id, subscriber.email)}
                          disabled={deleteLoading === subscriber._id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          {deleteLoading === subscriber._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pagination.pages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.max(1, prev.page - 1),
                          }))
                        }
                        disabled={pagination.page === 1}
                      />
                    </PaginationItem>

                    {getPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.min(prev.pages, prev.page + 1),
                          }))
                        }
                        disabled={pagination.page === pagination.pages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        <div className="mt-4 text-sm text-gray-500">Total: {pagination.total} subscribers</div>
      </div>
    </div>
  )
}
