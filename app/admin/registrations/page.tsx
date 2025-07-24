"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Search, Plus, Edit, Trash2, Filter, Download, RefreshCw, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface Registration {
  _id: string
  firstName: string
  lastName: string
  email: string
  chapterName: string
  gender: string
  shirtSize: string
  attendanceDays: string[]
  registrationCategory: string
  dietaryRestrictions: string
  membershipStatus: string
  membershipId: string
  registrationType: string
  paymentId: string
  registrationId: string
  registrationStatus: string
  createdAt: string
  updatedAt: string
}

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
const REGISTRATION_TYPES = ["full-convention", "economic-session-only"]
const ATTENDANCE_DAYS = ["thursday", "friday", "saturday", "sunday", "economic-session"]
const REGISTRATION_CATEGORIES = ["youth", "adult", "senior"]
const MEMBERSHIP_STATUSES = ["member", "non-member"]
const REGISTRATION_STATUSES = ["pending", "confirmed", "cancelled"]
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"]

export default function AdminRegistrationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedShirtSizes, setSelectedShirtSizes] = useState<string[]>([])
  const [selectedRegistrationTypes, setSelectedRegistrationTypes] = useState<string[]>([])
  const [selectedAttendanceDays, setSelectedAttendanceDays] = useState<string[]>([])

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    chapterName: "",
    gender: "",
    shirtSize: "",
    attendanceDays: [] as string[],
    registrationCategory: "",
    dietaryRestrictions: "",
    membershipStatus: "",
    membershipId: "",
    registrationType: "",
    paymentId: "",
    registrationStatus: "pending",
  })

  // Get unique chapters from registrations
  const uniqueChapters = Array.from(new Set(registrations.map((r) => r.chapterName))).sort()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/")
      return
    }
    if (user && user.role === "admin") {
      fetchRegistrations()
    }
  }, [user, loading, router])

  useEffect(() => {
    applyFilters()
  }, [
    registrations,
    searchTerm,
    selectedChapters,
    selectedShirtSizes,
    selectedRegistrationTypes,
    selectedAttendanceDays,
  ])

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()

      if (searchTerm) params.append("search", searchTerm)
      if (selectedChapters.length > 0) params.append("chapterNames", selectedChapters.join(","))
      if (selectedShirtSizes.length > 0) params.append("shirtSizes", selectedShirtSizes.join(","))
      if (selectedRegistrationTypes.length > 0) params.append("registrationTypes", selectedRegistrationTypes.join(","))
      if (selectedAttendanceDays.length > 0) params.append("attendanceDays", selectedAttendanceDays.join(","))

      const response = await fetch(`/api/admin/registrations?${params}`)
      const data = await response.json()

      if (response.ok) {
        setRegistrations(data.registrations)
      } else {
        toast.error(data.error || "Failed to fetch registrations")
      }
    } catch (error) {
      toast.error("Failed to fetch registrations")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = registrations

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (registration) =>
          registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.membershipId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply checkbox filters
    if (selectedChapters.length > 0) {
      filtered = filtered.filter((registration) => selectedChapters.includes(registration.chapterName))
    }

    if (selectedShirtSizes.length > 0) {
      filtered = filtered.filter((registration) => selectedShirtSizes.includes(registration.shirtSize))
    }

    if (selectedRegistrationTypes.length > 0) {
      filtered = filtered.filter((registration) => selectedRegistrationTypes.includes(registration.registrationType))
    }

    if (selectedAttendanceDays.length > 0) {
      filtered = filtered.filter((registration) =>
        registration.attendanceDays.some((day) => selectedAttendanceDays.includes(day)),
      )
    }

    setFilteredRegistrations(filtered)
  }

  const handleCreateRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Registration created successfully")
        setShowCreateModal(false)
        resetForm()
        fetchRegistrations()
      } else {
        toast.error(data.error || "Failed to create registration")
      }
    } catch (error) {
      toast.error("Failed to create registration")
    }
  }

  const handleUpdateRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRegistration) return

    try {
      const response = await fetch(`/api/admin/registrations/${editingRegistration._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Registration updated successfully")
        setShowEditModal(false)
        setEditingRegistration(null)
        resetForm()
        fetchRegistrations()
      } else {
        toast.error(data.error || "Failed to update registration")
      }
    } catch (error) {
      toast.error("Failed to update registration")
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Registration deleted successfully")
        fetchRegistrations()
      } else {
        toast.error(data.error || "Failed to delete registration")
      }
    } catch (error) {
      toast.error("Failed to delete registration")
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      chapterName: "",
      gender: "",
      shirtSize: "",
      attendanceDays: [],
      registrationCategory: "",
      dietaryRestrictions: "",
      membershipStatus: "",
      membershipId: "",
      registrationType: "",
      paymentId: "",
      registrationStatus: "pending",
    })
  }

  const openEditModal = (registration: Registration) => {
    setEditingRegistration(registration)
    setFormData({
      firstName: registration.firstName,
      lastName: registration.lastName,
      email: registration.email,
      chapterName: registration.chapterName,
      gender: registration.gender,
      shirtSize: registration.shirtSize,
      attendanceDays: registration.attendanceDays,
      registrationCategory: registration.registrationCategory,
      dietaryRestrictions: registration.dietaryRestrictions,
      membershipStatus: registration.membershipStatus,
      membershipId: registration.membershipId,
      registrationType: registration.registrationType,
      paymentId: registration.paymentId,
      registrationStatus: registration.registrationStatus,
    })
    setShowEditModal(true)
  }

  const clearFilters = () => {
    setSelectedChapters([])
    setSelectedShirtSizes([])
    setSelectedRegistrationTypes([])
    setSelectedAttendanceDays([])
    setSearchTerm("")
  }

  const exportToCSV = () => {
    const headers = [
      "Registration ID",
      "First Name",
      "Last Name",
      "Email",
      "Chapter",
      "Gender",
      "Shirt Size",
      "Attendance Days",
      "Category",
      "Membership Status",
      "Membership ID",
      "Registration Type",
      "Status",
      "Created At",
    ]

    const csvData = filteredRegistrations.map((reg) => [
      reg.registrationId,
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.chapterName,
      reg.gender,
      reg.shirtSize,
      reg.attendanceDays.join("; "),
      reg.registrationCategory,
      reg.membershipStatus,
      reg.membershipId,
      reg.registrationType,
      reg.registrationStatus,
      new Date(reg.createdAt).toLocaleDateString(),
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Manage Registrations</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchRegistrations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Registration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Registration</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateRegistration} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="chapterName">Chapter Name *</Label>
                    <Input
                      id="chapterName"
                      value={formData.chapterName}
                      onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shirtSize">Shirt Size *</Label>
                    <Select
                      value={formData.shirtSize}
                      onValueChange={(value) => setFormData({ ...formData, shirtSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shirt size" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIRT_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="registrationCategory">Registration Category *</Label>
                    <Select
                      value={formData.registrationCategory}
                      onValueChange={(value) => setFormData({ ...formData, registrationCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGISTRATION_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="membershipStatus">Membership Status *</Label>
                    <Select
                      value={formData.membershipStatus}
                      onValueChange={(value) => setFormData({ ...formData, membershipStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select membership status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMBERSHIP_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="membershipId">Membership ID</Label>
                    <Input
                      id="membershipId"
                      value={formData.membershipId}
                      onChange={(e) => setFormData({ ...formData, membershipId: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationType">Registration Type *</Label>
                    <Select
                      value={formData.registrationType}
                      onValueChange={(value) => setFormData({ ...formData, registrationType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select registration type" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGISTRATION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentId">Payment ID</Label>
                    <Input
                      id="paymentId"
                      value={formData.paymentId}
                      onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationStatus">Registration Status *</Label>
                    <Select
                      value={formData.registrationStatus}
                      onValueChange={(value) => setFormData({ ...formData, registrationStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGISTRATION_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Attendance Days *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {ATTENDANCE_DAYS.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.attendanceDays.includes(day)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                attendanceDays: [...formData.attendanceDays, day],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                attendanceDays: formData.attendanceDays.filter((d) => d !== day),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={day} className="text-sm">
                          {day.charAt(0).toUpperCase() + day.slice(1).replace("-", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Registration</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {(selectedChapters.length > 0 ||
                selectedShirtSizes.length > 0 ||
                selectedRegistrationTypes.length > 0 ||
                selectedAttendanceDays.length > 0) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Chapter Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Chapters</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uniqueChapters.map((chapter) => (
                    <div key={chapter} className="flex items-center space-x-2">
                      <Checkbox
                        id={`chapter-${chapter}`}
                        checked={selectedChapters.includes(chapter)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedChapters([...selectedChapters, chapter])
                          } else {
                            setSelectedChapters(selectedChapters.filter((c) => c !== chapter))
                          }
                        }}
                      />
                      <Label htmlFor={`chapter-${chapter}`} className="text-sm">
                        {chapter}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shirt Size Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Shirt Sizes</Label>
                <div className="space-y-2">
                  {SHIRT_SIZES.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedShirtSizes.includes(size)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedShirtSizes([...selectedShirtSizes, size])
                          } else {
                            setSelectedShirtSizes(selectedShirtSizes.filter((s) => s !== size))
                          }
                        }}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Type Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Registration Types</Label>
                <div className="space-y-2">
                  {REGISTRATION_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedRegistrationTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRegistrationTypes([...selectedRegistrationTypes, type])
                          } else {
                            setSelectedRegistrationTypes(selectedRegistrationTypes.filter((t) => t !== type))
                          }
                        }}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm">
                        {type
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Days Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Attendance Days</Label>
                <div className="space-y-2">
                  {ATTENDANCE_DAYS.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={selectedAttendanceDays.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAttendanceDays([...selectedAttendanceDays, day])
                          } else {
                            setSelectedAttendanceDays(selectedAttendanceDays.filter((d) => d !== day))
                          }
                        }}
                      />
                      <Label htmlFor={`day-${day}`} className="text-sm">
                        {day.charAt(0).toUpperCase() + day.slice(1).replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredRegistrations.length} of {registrations.length} registrations
        </p>
      </div>

      {/* Registrations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shirt Size</TableHead>
                  <TableHead>Attendance Days</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No registrations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration._id}>
                      <TableCell className="font-mono text-sm">{registration.registrationId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {registration.firstName} {registration.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.gender} • {registration.registrationCategory}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.chapterName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {registration.registrationType
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            registration.registrationStatus === "confirmed"
                              ? "default"
                              : registration.registrationStatus === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {registration.registrationStatus.charAt(0).toUpperCase() +
                            registration.registrationStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{registration.shirtSize}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {registration.attendanceDays.map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(registration)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRegistration(registration._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateRegistration} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-firstName">First Name *</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-lastName">Last Name *</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-chapterName">Chapter Name *</Label>
                <Input
                  id="edit-chapterName"
                  value={formData.chapterName}
                  onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-shirtSize">Shirt Size *</Label>
                <Select
                  value={formData.shirtSize}
                  onValueChange={(value) => setFormData({ ...formData, shirtSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shirt size" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIRT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-registrationCategory">Registration Category *</Label>
                <Select
                  value={formData.registrationCategory}
                  onValueChange={(value) => setFormData({ ...formData, registrationCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGISTRATION_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-membershipStatus">Membership Status *</Label>
                <Select
                  value={formData.membershipStatus}
                  onValueChange={(value) => setFormData({ ...formData, membershipStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select membership status" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBERSHIP_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-membershipId">Membership ID</Label>
                <Input
                  id="edit-membershipId"
                  value={formData.membershipId}
                  onChange={(e) => setFormData({ ...formData, membershipId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-registrationType">Registration Type *</Label>
                <Select
                  value={formData.registrationType}
                  onValueChange={(value) => setFormData({ ...formData, registrationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select registration type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGISTRATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-paymentId">Payment ID</Label>
                <Input
                  id="edit-paymentId"
                  value={formData.paymentId}
                  onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-registrationStatus">Registration Status *</Label>
                <Select
                  value={formData.registrationStatus}
                  onValueChange={(value) => setFormData({ ...formData, registrationStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGISTRATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Attendance Days *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {ATTENDANCE_DAYS.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${day}`}
                      checked={formData.attendanceDays.includes(day)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            attendanceDays: [...formData.attendanceDays, day],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            attendanceDays: formData.attendanceDays.filter((d) => d !== day),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`edit-${day}`} className="text-sm">
                      {day.charAt(0).toUpperCase() + day.slice(1).replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-dietaryRestrictions">Dietary Restrictions</Label>
              <Textarea
                id="edit-dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Registration</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
