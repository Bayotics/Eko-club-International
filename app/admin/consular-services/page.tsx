"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileDown, Phone, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImmigrationService {
  _id: string
  name: string
  email: string
  phone?: string
  residentialCountry: string
  residentialState: string
  citizenshipCountry: string
  service: string
  createdAt: string
  updatedAt: string
}

export default function ManageConsularServices() {
  const [services, setServices] = useState<ImmigrationService[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchServices = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      params.append("limit", "50")

      const response = await fetch(`/api/admin/immigration?${params}`)
      const data = await response.json()

      if (response.ok) {
        setServices(data.consularRegs)
      } else {
        throw new Error(data.error || "Failed to fetch consular services")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch consular services",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [searchTerm, toast])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleExportCSV = useCallback(() => {
    if (!services.length) return

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Residential Country",
      "Residential State",
      "Citizenship Country",
      "Service",
      "Created At",
    ]

    const rows = services.map((s) => [
      s.name,
      s.email,
      s.phone || "",
      s.residentialCountry,
      s.residentialState,
      s.citizenshipCountry,
      s.service,
      new Date(s.createdAt).toLocaleString(),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "consular_services.csv")
    link.click()
  }, [services])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading consular services...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 mt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Consular Services</h1>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Search Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      {/* Services Table */}
<div className="overflow-x-auto">
  <table className="w-full border border-gray-200">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2 text-left">Name</th>
        <th className="p-2 text-left">Email</th>
        <th className="p-2 text-left">Phone</th>
        <th className="p-2 text-left">Residential</th>
        <th className="p-2 text-left">Citizenship</th>
        <th className="p-2 text-left">Service</th>
        <th className="p-2 text-left">Registered</th>
      </tr>
    </thead>
    <tbody>
      {services.map((service) => (
        <tr key={service._id} className="border-t">
          <td className="p-2">{service.name}</td>
          <td className="p-2">{service.email}</td>
          <td className="p-2">{service.phone || "-"}</td>
          <td className="p-2">
            {service.residentialState}, {service.residentialCountry}
          </td>
          <td className="p-2">{service.citizenshipCountry}</td>
          <td className="p-2">{service.service}</td>
          <td className="p-2">{new Date(service.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {services.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consular services found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No records match your search." : "There are currently no consular service records."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
