"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, User, Calendar, MapPin, Award, FileText, AlertTriangle } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import UpcomingMeetingsAnnouncements from "@/components/upcoming-meetings-announcements"
import UpcomingEventsAnnouncements from "@/components/upcoming-events-annuncements"
import Link from "next/link"
import MemberDocuments from "@/components/member-documents"
import { useAuth } from "@/contexts/auth-context" // Import the auth context

// Add the isPendingUser function directly in the file if you don't want to create a separate helper file
const isPendingUser = (user) => user?.role === "pending"
const canAccessMemberFeatures = (user) => ["member", "admin", "superadmin"].includes(user?.role)

export default function MemberDashboard() {
  const router = useRouter()
  const { user, loading: authLoading, refreshUser } = useAuth() // Use the auth context
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Use the auth context instead of fetching user data directly
    const initializeDashboard = async () => {
      try {
        // If auth context is still loading, wait for it
        if (authLoading) {
          return
        }

        // If no user in context, try refreshing once
        if (!user) {
          await refreshUser()
        }

        // After refresh, if still no user, redirect to login
        // This prevents immediate redirect if the context is just initializing
        if (!user && !authLoading) {
          console.log("No user found after refresh, redirecting to login")
          router.push("/login")
          return
        }
      } catch (err) {
        console.error("Error initializing dashboard:", err)
        setError("Failed to load user data. Please try logging in again.")
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [user, authLoading, refreshUser, router])

  // Show loading state while either local loading or auth context is loading
  if (loading || authLoading) {
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

  // If we get here and still no user, show a more friendly message instead of redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
          <p className="mb-6">
            Your session appears to have expired or you're not logged in. Please log in again to access your dashboard.
          </p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
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

  // Check if user is pending
  const userIsPending = isPendingUser(user)
  const userCanAccessFeatures = canAccessMemberFeatures(user)

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
          {/* Add pending user alert */}
          {userIsPending && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Alert variant="warning" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertTriangle className="h-5 w-5 text-yellow-800" />
                <AlertTitle className="text-yellow-800 font-medium">Account Pending Approval</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Your account is currently pending approval from an administrator. Some features will be limited until
                  your account is approved.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.fullName || "Member"}!</p>
            </motion.div>
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
                      <span>{user?.membershipId || (userIsPending ? "Pending Assignment" : "No membership ID")}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span className="capitalize">{user?.role || "Member"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#C8A97E]" />
                      <span>Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/members/profile")}>
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
              {!userIsPending && (
                <Card className="overflow-hidden mt-10">
                  <CardHeader className="bg-[#C8A97E]/10">
                    <CardTitle className="text-[#C8A97E]">Meeting Minutes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                      Access minutes from previous meetings and stay informed about club decisions and discussions.
                    </p>
                    <Button asChild variant="outline" className="w-full" disabled={userIsPending}>
                      <Link href={userCanAccessFeatures ? "/members/meetings" : "#"}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Meeting Minutes
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
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
                  <TabsTrigger value="documents" disabled={userIsPending}>
                    Documents
                  </TabsTrigger>
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
                            <span
                              className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                                userIsPending ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {userIsPending ? "Pending Approval" : "Active"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Member Since:</span>
                            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
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
                    {!userIsPending && (
                      <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Recent Announcements</CardTitle>
                        <CardDescription>Latest updates from Eko Club International</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <UpcomingMeetingsAnnouncements />
                      </CardContent>
                    </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="events" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>Events you might be interested in</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UpcomingEventsAnnouncements />
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
                      {userIsPending ? (
                        <div className="text-center py-8">
                          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                          <p className="text-gray-500 max-w-md mx-auto">
                            Document access is only available after your account has been approved by an administrator.
                          </p>
                        </div>
                      ) : (
                        <MemberDocuments />
                      )}
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
