"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Camera, MapPin, Calendar, Award, User, Edit, Save, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
    // address: "",
    // city: "",
    // state: "",
    // country: "",
    // bio: "",
  })

  const [isUploading, setIsUploading] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setUser(data)
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          role: data.role || "",
          phone: data.phone || "",
          //   address: data.user.address || "",
          //   city: data.user.city || "",
          //   state: data.user.state || "",
          //   country: data.user.country || "",
          //   bio: data.user.bio || "",
        })
      } catch (err) {
        console.error("Error fetching user data:", err)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push("/members/dashboard")
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, toast])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setUser(data.user)
      setEditMode(false)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
    } catch (err) {
      console.error("Error updating profile:", err)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return "ME"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Start upload
      setIsUploading(true)

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload to Cloudinary
      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image")
      }

      // Update user profile with new image URL
      const token = localStorage.getItem("token")
      const updateResponse = await fetch("/api/auth/update-profile-pic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          profileImage: data.secure_url,
        }),
      })

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile image")
      }

      // Update local user state with new image
      setUser((prev) => ({
        ...prev,
        profileImage: data.secure_url,
      }))

      toast({
        title: "Success",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (err) {
      console.error("Error updating profile image:", err)
      setProfileImagePreview("")
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A97E]" />
        <span className="ml-2 text-lg">Loading your profile...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb with proper spacing to avoid navbar overlap */}
      <div className="bg-white shadow-sm pt-24 pb-4">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/members/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/members/profile">Profile</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your personal information and account settings</p>
            </div>
            <Button
              onClick={() => {
                if (editMode) {
                  handleSaveProfile()
                } else {
                  setEditMode(true)
                }
              }}
              className="mt-4 md:mt-0"
              variant={editMode ? "default" : "outline"}
            >
              {editMode ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileImagePreview || user?.profileImage || ""} />
                      <AvatarFallback className="text-lg bg-[#C8A97E] text-white">
                        {getInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={triggerFileInput}
                        disabled={isUploading}
                      >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        className="hidden"
                        id="profile-image"
                      />
                    </div>
                  </div>
                  {isUploading && <div className="text-xs text-center mt-2 text-gray-500">Uploading...</div>}
                  <CardTitle className="mt-4">{user?.fullName}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span>{user?.chapterName || "No chapter specified"}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span>{user?.membershipId || "No membership ID"}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span className="capitalize">{user?.role || "Member"}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span className="capitalize">{user?.phone || "Member"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span>Joined: {new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/members/dashboard")}>
                    Back to Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Profile Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2"
            >
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="membership">Membership</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                        {/* <select value={formData.role} onChange={handleInputChange} name="role" id="role" disabled={!editMode}>
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="exco">Exco</option>
                        </select> */}
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        {/*
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div> */}
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="min-h-[100px]"
                        />
                      </div> */}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="membership" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Membership Information</CardTitle>
                      <CardDescription>Your membership details and history</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Membership ID</h3>
                          <p className="mt-1">{user?.membershipId || "Not assigned"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Membership Type</h3>
                          <p className="mt-1">{user?.membershipType || "Standard"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Chapter</h3>
                          <p className="mt-1">{user?.chapterName || "Not assigned"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Status</h3>
                          <p className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Join Date</h3>
                          <p className="mt-1">{new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Renewal Date</h3>
                          <p className="mt-1">January 1, 2024</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Payment History</h3>
                        <div className="bg-gray-50 rounded-md p-4">
                          <div className="text-center text-gray-500 py-6">
                            <p>No payment history available</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="newsletter" className="text-sm font-medium">
                                Newsletter
                              </Label>
                              <p className="text-xs text-gray-500">Receive our monthly newsletter</p>
                            </div>
                            <Switch id="newsletter" defaultChecked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="events" className="text-sm font-medium">
                                Event Updates
                              </Label>
                              <p className="text-xs text-gray-500">Get notified about upcoming events</p>
                            </div>
                            <Switch id="events" defaultChecked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="announcements" className="text-sm font-medium">
                                Announcements
                              </Label>
                              <p className="text-xs text-gray-500">Important club announcements</p>
                            </div>
                            <Switch id="announcements" defaultChecked={true} />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Privacy Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="directory" className="text-sm font-medium">
                                Member Directory
                              </Label>
                              <p className="text-xs text-gray-500">Show your profile in the member directory</p>
                            </div>
                            <Switch id="directory" defaultChecked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="contact" className="text-sm font-medium">
                                Contact Information
                              </Label>
                              <p className="text-xs text-gray-500">Allow other members to see your contact info</p>
                            </div>
                            <Switch id="contact" defaultChecked={false} />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Security</h3>
                        <div className="space-y-4">
                          <Button variant="outline">Change Password</Button>
                          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Deactivate Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
