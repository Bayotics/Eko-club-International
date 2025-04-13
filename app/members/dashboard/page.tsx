"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, User, Calendar, MapPin, Award, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function MemberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
        console.log(data)
        setUser(data)
        console.log(user)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user data. Please try logging in again.")
        localStorage.removeItem("token")
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A97E]" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/login")}>Return to Login</Button>
        </div>
      </div>
    )
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
  console.log(user)
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
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.fullName || "Member"}!</p>
            </motion.div>

            <Button variant="outline" className="mt-4 md:mt-0 flex items-center" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={user?.profileImage || ""} />
                    <AvatarFallback className="text-lg bg-[#C8A97E] text-white">
                      {getInitials(user?.fullName)}
                    </AvatarFallback>
                  </Avatar>
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
                      <Calendar className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span>Joined: {new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/members/profile")}>
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Membership Status</CardTitle>
                        <CardDescription>Your current membership information</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Status:</span>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Active
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Member Since:</span>
                            <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Last Login:</span>
                            <span>{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "N/A"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Chapter Information</CardTitle>
                        <CardDescription>Your local chapter details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Chapter:</span>
                            <span>{user?.chapterName || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Next Meeting:</span>
                            <span>June 15, 2025</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Chapter Leader:</span>
                            <span>John Adebayo</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Recent Announcements</CardTitle>
                        <CardDescription>Latest updates from Eko Club International</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-l-4 border-[#C8A97E] pl-4 py-2">
                            <h4 className="font-medium">Annual General Meeting</h4>
                            <p className="text-sm text-gray-600">
                              The Annual General Meeting will be held on July 10, 2025. All members are encouraged to
                              attend.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Posted: May 1, 2025</p>
                          </div>
                          <div className="border-l-4 border-[#C8A97E] pl-4 py-2">
                            <h4 className="font-medium">Membership Dues Reminder</h4>
                            <p className="text-sm text-gray-600">
                              Please remember to pay your annual membership dues by June 30, 2025.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Posted: April 15, 2025</p>
                          </div>
                          <div className="border-l-4 border-[#C8A97E] pl-4 py-2">
                            <h4 className="font-medium">New Website Launch</h4>
                            <p className="text-sm text-gray-600">
                              We're excited to announce the launch of our new website with enhanced member features.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Posted: April 1, 2025</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>Events you might be interested in</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 border-b pb-4">
                          <div className="bg-[#C8A97E] text-white rounded-lg p-3 text-center min-w-[80px]">
                            <div className="text-2xl font-bold">15</div>
                            <div className="text-sm">June</div>
                          </div>
                          <div>
                            <h4 className="font-medium">Chapter Meeting</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Monthly chapter meeting to discuss upcoming initiatives and projects.
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Eko Club House, Lagos</span>
                              <span className="mx-2">•</span>
                              <span>6:00 PM</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 border-b pb-4">
                          <div className="bg-[#C8A97E] text-white rounded-lg p-3 text-center min-w-[80px]">
                            <div className="text-2xl font-bold">10</div>
                            <div className="text-sm">July</div>
                          </div>
                          <div>
                            <h4 className="font-medium">Annual General Meeting</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Annual meeting for all members to review the year and elect new officers.
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Grand Hotel, Lagos</span>
                              <span className="mx-2">•</span>
                              <span>10:00 AM</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="bg-[#C8A97E] text-white rounded-lg p-3 text-center min-w-[80px]">
                            <div className="text-2xl font-bold">25</div>
                            <div className="text-sm">July</div>
                          </div>
                          <div>
                            <h4 className="font-medium">Community Outreach</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Join us for our quarterly community service project in Lagos.
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Surulere Community Center</span>
                              <span className="mx-2">•</span>
                              <span>9:00 AM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Member Documents</CardTitle>
                      <CardDescription>Access important club documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Club Constitution</h4>
                              <p className="text-xs text-gray-500">PDF • 2.4 MB • Updated April 2025</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Member Directory</h4>
                              <p className="text-xs text-gray-500">Excel • 1.8 MB • Updated May 2025</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-purple-100 p-2 rounded mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-purple-600"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Annual Report 2024</h4>
                              <p className="text-xs text-gray-500">PDF • 5.2 MB • Published January 2025</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
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
