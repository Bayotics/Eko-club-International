"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  DollarSign,
  Gift,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Building2,
  User,
} from "lucide-react"
import type { ISponsor } from "@/models/Sponsor"

interface SponsorFormData {
  name: string
  description: string
  pic: string
  sponsorshipType: "regular" | "corporate"
  contribution: {
    type: "monetary" | "in-kind" | "both"
    monetaryAmount: number | ""
    inKindDescription: string
  }
  websiteLink: string
}

const initialFormData: SponsorFormData = {
  name: "",
  description: "",
  pic: "",
  sponsorshipType: "regular",
  contribution: {
    type: "monetary",
    monetaryAmount: "",
    inKindDescription: "",
  },
  websiteLink: "",
}

const SponsorForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}: {
  formData: SponsorFormData
  onFormDataChange: (data: SponsorFormData) => void
  onSubmit: () => void
  onCancel: () => void
  isLoading: boolean
  isEditing: boolean
}) => {
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        onFormDataChange({
          ...formData,
          [parent]: {
            ...formData[parent as keyof SponsorFormData],
            [child]: value,
          },
        })
      } else {
        onFormDataChange({
          ...formData,
          [field]: value,
        })
      }
    },
    [formData, onFormDataChange],
  )

  const handleContributionTypeChange = useCallback(
    (type: "monetary" | "in-kind" | "both") => {
      onFormDataChange({
        ...formData,
        contribution: {
          ...formData.contribution,
          type,
          // Reset values when changing type
          monetaryAmount: type === "in-kind" ? "" : formData.contribution.monetaryAmount,
          inKindDescription: type === "monetary" ? "" : formData.contribution.inKindDescription,
        },
      })
    },
    [formData, onFormDataChange],
  )

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setUploadingImage(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          handleInputChange("pic", data.secure_url)
        } else {
          throw new Error("Upload failed")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("Failed to upload image. Please try again.")
      } finally {
        setUploadingImage(false)
      }
    },
    [handleInputChange],
  )

  const isFormValid = useMemo(() => {
    if (!formData.name || !formData.contribution.type || !formData.sponsorshipType) return false

    if (formData.contribution.type === "monetary") {
      return formData.contribution.monetaryAmount && Number(formData.contribution.monetaryAmount) > 0
    }

    if (formData.contribution.type === "in-kind") {
      return formData.contribution.inKindDescription.trim().length > 0
    }

    if (formData.contribution.type === "both") {
      return (
        formData.contribution.monetaryAmount &&
        Number(formData.contribution.monetaryAmount) > 0 &&
        formData.contribution.inKindDescription.trim().length > 0
      )
    }

    return false
  }, [formData])

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="space-y-2">
          <Label htmlFor="name">Sponsor Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter sponsor name"
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sponsorshipType">Sponsorship Type *</Label>
          <Select
            value={formData.sponsorshipType}
            onValueChange={(value: "regular" | "corporate") => handleInputChange("sponsorshipType", value)}
          >
            <SelectTrigger id="sponsorshipType">
              <SelectValue placeholder="Select sponsorship type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter sponsor description"
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteLink">Website Link (Optional)</Label>
          <Input
            id="websiteLink"
            type="url"
            value={formData.websiteLink}
            onChange={(e) => handleInputChange("websiteLink", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <Separator />

      {/* Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sponsor Image (Optional)</h3>

        <div className="space-y-4">
          {formData.pic && (
            <div className="relative inline-block">
              <img
                src={formData.pic || "/placeholder.svg"}
                alt="Sponsor"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => handleInputChange("pic", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="picUrl">Image URL</Label>
              <Input
                id="picUrl"
                value={formData.pic}
                onChange={(e) => handleInputChange("pic", e.target.value)}
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex flex-col justify-end">
              <Label htmlFor="picUpload" className="sr-only">
                Upload Image
              </Label>
              <Button type="button" variant="outline" disabled={uploadingImage} className="relative bg-transparent">
                <input
                  id="picUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImage}
                />
                <Upload className="h-4 w-4 mr-2" />
                {uploadingImage ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contribution */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contribution Details *</h3>

        <div className="space-y-2">
          <Label htmlFor="contributionType">Contribution Type</Label>
          <Select value={formData.contribution.type} onValueChange={handleContributionTypeChange}>
            <SelectTrigger id="contributionType">
              <SelectValue placeholder="Select contribution type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monetary">Monetary</SelectItem>
              <SelectItem value="in-kind">In Kind</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(formData.contribution.type === "monetary" || formData.contribution.type === "both") && (
          <div className="space-y-2">
            <Label htmlFor="monetaryAmount">Donation Amount (USD) *</Label>
            <Input
              id="monetaryAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.contribution.monetaryAmount}
              onChange={(e) =>
                handleInputChange("contribution.monetaryAmount", e.target.value ? Number(e.target.value) : "")
              }
              placeholder="Enter amount in USD"
            />
          </div>
        )}

        {(formData.contribution.type === "in-kind" || formData.contribution.type === "both") && (
          <div className="space-y-2">
            <Label htmlFor="inKindDescription">In-Kind Contribution Description *</Label>
            <Textarea
              id="inKindDescription"
              value={formData.contribution.inKindDescription}
              onChange={(e) => handleInputChange("contribution.inKindDescription", e.target.value)}
              placeholder="Describe the in-kind contribution"
              maxLength={300}
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isLoading || !isFormValid}>
          {isLoading ? "Saving..." : isEditing ? "Update Sponsor" : "Create Sponsor"}
        </Button>
      </div>
    </div>
  )
}

export default function ManageSponsorsPage() {
  const [sponsors, setSponsors] = useState<ISponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [contributionTypeFilter, setContributionTypeFilter] = useState("")
  const [sponsorshipTypeFilter, setSponsorshipTypeFilter] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<ISponsor | null>(null)
  const [formData, setFormData] = useState<SponsorFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchSponsors = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(contributionTypeFilter && contributionTypeFilter !== "all" && { contributionType: contributionTypeFilter }),
        ...(sponsorshipTypeFilter && sponsorshipTypeFilter !== "all" && { sponsorshipType: sponsorshipTypeFilter }),
      })

      const response = await fetch(`/api/admin/sponsors?${params}`)

      if (response.ok) {
        const data = await response.json()
        setSponsors(data.sponsors || [])

        // Ensure pagination object has all required properties
        const paginationData = data.pagination || {}
        setPagination({
          page: paginationData.page || 1,
          limit: paginationData.limit || 10,
          total: paginationData.total || 0,
          pages: paginationData.pages || 0,
        })

        setError("")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch sponsors")
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error)
      setError("Failed to fetch sponsors")
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, searchTerm, contributionTypeFilter, sponsorshipTypeFilter])

  useEffect(() => {
    fetchSponsors()
  }, [fetchSponsors])

  const handleFormDataChange = useCallback((data: SponsorFormData) => {
    setFormData(data)
  }, [])

  const handleCreateSponsor = useCallback(async () => {
    try {
      setSubmitting(true)
      setError("")

      const response = await fetch("/api/admin/sponsors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("Sponsor created successfully")
        setShowCreateDialog(false)
        setFormData(initialFormData)
        // Reset pagination to first page and fetch
        setPagination((prev) => ({ ...prev, page: 1 }))
        setTimeout(() => fetchSponsors(), 100)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create sponsor")
      }
    } catch (error) {
      console.error("Error creating sponsor:", error)
      setError("Failed to create sponsor")
    } finally {
      setSubmitting(false)
    }
  }, [formData, fetchSponsors])

  const handleEditSponsor = useCallback(async () => {
    if (!editingSponsor) return

    try {
      setSubmitting(true)
      setError("")

      const response = await fetch(`/api/admin/sponsors/${editingSponsor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("Sponsor updated successfully")
        setShowEditDialog(false)
        setEditingSponsor(null)
        setFormData(initialFormData)
        // Fetch sponsors after a short delay to ensure state is updated
        setTimeout(() => fetchSponsors(), 100)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update sponsor")
      }
    } catch (error) {
      console.error("Error updating sponsor:", error)
      setError("Failed to update sponsor")
    } finally {
      setSubmitting(false)
    }
  }, [editingSponsor, formData, fetchSponsors])

  const handleDeleteSponsor = useCallback(
    async (sponsor: ISponsor) => {
      if (!confirm(`Are you sure you want to delete "${sponsor.name}"?`)) return

      try {
        const response = await fetch(`/api/admin/sponsors/${sponsor._id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setSuccess("Sponsor deleted successfully")
          // Fetch sponsors after a short delay
          setTimeout(() => fetchSponsors(), 100)
        } else {
          const errorData = await response.json()
          setError(errorData.error || "Failed to delete sponsor")
        }
      } catch (error) {
        console.error("Error deleting sponsor:", error)
        setError("Failed to delete sponsor")
      }
    },
    [fetchSponsors],
  )

  const openEditDialog = useCallback((sponsor: ISponsor) => {
    setEditingSponsor(sponsor)
    setFormData({
      name: sponsor.name,
      description: sponsor.description || "",
      pic: sponsor.pic || "",
      sponsorshipType: sponsor.sponsorshipType,
      contribution: {
        type: sponsor.contribution.type,
        monetaryAmount: sponsor.contribution.monetaryAmount || "",
        inKindDescription: sponsor.contribution.inKindDescription || "",
      },
      websiteLink: sponsor.websiteLink || "",
    })
    setShowEditDialog(true)
  }, [])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setEditingSponsor(null)
  }, [])

  const getSponsorshipTypeBadge = useCallback((sponsorshipType: ISponsor["sponsorshipType"]) => {
    switch (sponsorshipType) {
      case "corporate":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Building2 className="h-3 w-3 mr-1" />
            Corporate
          </Badge>
        )
      case "regular":
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            <User className="h-3 w-3 mr-1" />
            Regular
          </Badge>
        )
      default:
        return null
    }
  }, [])

  const getContributionBadge = useCallback((contribution: ISponsor["contribution"]) => {
    switch (contribution.type) {
      case "monetary":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <DollarSign className="h-3 w-3 mr-1" />
            Monetary
          </Badge>
        )
      case "in-kind":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            <Gift className="h-3 w-3 mr-1" />
            In-Kind
          </Badge>
        )
      case "both":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            <DollarSign className="h-3 w-3 mr-1" />
            Both
          </Badge>
        )
      default:
        return null
    }
  }, [])

  const formatContributionDetails = useCallback((contribution: ISponsor["contribution"]) => {
    const details = []

    if (contribution.monetaryAmount) {
      details.push(`$${contribution.monetaryAmount.toLocaleString()} USD`)
    }

    if (contribution.inKindDescription) {
      details.push(contribution.inKindDescription)
    }

    return details.join(" + ")
  }, [])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Sponsors</h1>
          <p className="text-gray-600 mt-2">Create and manage event sponsors</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Sponsor</DialogTitle>
            </DialogHeader>
            <SponsorForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onSubmit={handleCreateSponsor}
              onCancel={() => setShowCreateDialog(false)}
              isLoading={submitting}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sponsors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={sponsorshipTypeFilter} onValueChange={setSponsorshipTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by sponsorship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>

            <Select value={contributionTypeFilter} onValueChange={setContributionTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by contribution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contributions</SelectItem>
                <SelectItem value="monetary">Monetary</SelectItem>
                <SelectItem value="in-kind">In Kind</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sponsors List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sponsors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sponsors found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || contributionTypeFilter || sponsorshipTypeFilter
                ? "No sponsors match your current filters."
                : "Get started by creating your first sponsor."}
            </p>
            {!searchTerm && !contributionTypeFilter && !sponsorshipTypeFilter && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Sponsor
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <Card key={sponsor._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{sponsor.name}</h3>
                    {sponsor.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sponsor.description}</p>
                    )}
                  </div>
                  {sponsor.pic && (
                    <img
                      src={sponsor.pic || "/placeholder.svg"}
                      alt={sponsor.name}
                      className="w-16 h-16 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getSponsorshipTypeBadge(sponsor.sponsorshipType)}
                    {getContributionBadge(sponsor.contribution)}
                  </div>

                  <div className="text-sm text-gray-700">
                    <strong>Contribution:</strong> {formatContributionDetails(sponsor.contribution)}
                  </div>

                  {sponsor.websiteLink && (
                    <div className="flex items-center gap-1 text-sm">
                      <ExternalLink className="h-3 w-3" />
                      <a
                        href={sponsor.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {sponsor.websiteLink}
                      </a>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(sponsor)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSponsor(sponsor)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>

          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
          </DialogHeader>
          <SponsorForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleEditSponsor}
            onCancel={() => setShowEditDialog(false)}
            isLoading={submitting}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
