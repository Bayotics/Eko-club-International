"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, UserIcon, Calendar, FileText, Settings, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      // Fetch user data
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("Failed to fetch user data")
          }

          const data = await response.json()
          setUser(data.user)
        } catch (error) {
          console.error("Error fetching user data:", error)
          localStorage.removeItem("token")
          router.push("/login")
        } finally {
          setLoading(false)
        }
      }

      fetchUserData()
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A97E]" />
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
                <BreadcrumbLink href="/members/dashboard">Member Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 h-20 w-20 rounded-full bg-[#C8A97E]/20 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-[#C8A97E]" />
                </div>
                <CardTitle>{user?.fullName}</CardTitle>
                <CardDescription className="text-sm">{user?.email}</CardDescription>
                {user?.membershipId && (
                  <div className="mt-2 inline-block bg-[#C8A97E]/10 text-[#8A6D3B] text-xs px-2 py-1 rounded-full">
                    ID: {user.membershipId}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Events
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Welcome Back!</CardTitle>
                      <CardDescription>
                        {user?.chapterName ? `${user.chapterName} Chapter Member` : "ECI Member"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Thank you for being a valued member of Eko Club International. Check out the latest updates and
                        upcoming events.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Membership Status</CardTitle>
                      <CardDescription>Active Member</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Member Since:</span>
                          <span className="font-medium">January 2023</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next Renewal:</span>
                          <span className="font-medium">January 2024</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Annual General Meeting</span>
                            <span className="text-xs text-gray-500">3 days ago</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Minutes from the annual general meeting have been posted. Check the documents section to
                            review.
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Events you might be interested in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[1, 2, 3].map((event) => (
                        <div key={event} className="flex gap-4 border-b pb-4 last:border-0">
                          <div className="min-w-16 h-16 bg-[#C8A97E]/10 rounded-md flex flex-col items-center justify-center">
                            <span className="font-bold text-[#8A6D3B]">NOV</span>
                            <span className="text-lg font-bold text-[#8A6D3B]">{10 + event}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Annual Charity Gala</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Join us for our annual charity fundraising event to support our community projects.
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="mr-3">6:00 PM - 10:00 PM</span>
                              <span>Grand Hotel, Lagos</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="announcements">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Announcements</CardTitle>
                    <CardDescription>Important updates from Eko Club International</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[1, 2, 3].map((announcement) => (
                        <div key={announcement} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">New Chapter Opening in Toronto</h4>
                            <span className="text-xs text-gray-500">Oct 15, 2023</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            We are excited to announce the opening of our newest chapter in Toronto, Canada. The
                            inauguration ceremony will be held next month.
                          </p>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
