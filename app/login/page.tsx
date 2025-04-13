"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    chapterName: "",
    membershipId: "",
  })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Update auth context with user data
      login(data.user, data.token)

      // Redirect to member dashboard
      router.push("/members/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Switch to login tab after successful registration
      setActiveTab("login")
      setLoginData({
        email: registerData.email,
        password: "",
      })
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
                <BreadcrumbLink href="/login">Members Login</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Members Portal</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Welcome to the Eko Club International members area. Please login or register to access exclusive member
              resources and benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            <motion.div
              className="md:col-span-2 flex flex-col justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-[#C8A97E]/10 p-6 rounded-lg border border-[#C8A97E]/20">
                <h2 className="text-xl font-semibold mb-4 text-[#8A6D3B]">Member Benefits</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-[#C8A97E] rounded-full p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Access to exclusive events and networking opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-[#C8A97E] rounded-full p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Participate in community service projects</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-[#C8A97E] rounded-full p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Connect with other members worldwide</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-[#C8A97E] rounded-full p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Access to member-only resources and documents</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-[#C8A97E] rounded-full p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Volunteer opportunities and leadership roles</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png"
                      alt="Eko Club Logo"
                      width={80}
                      height={80}
                      className="h-20 w-auto"
                    />
                  </div>
                  <CardTitle className="text-2xl">Members Access</CardTitle>
                  <CardDescription>Login to your account or register as a new member</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                              Email
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="your.email@example.com"
                              required
                              value={loginData.email}
                              onChange={handleLoginChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label htmlFor="password" className="text-sm font-medium">
                                Password
                              </label>
                              <Link href="/forgot-password" className="text-sm text-[#C8A97E] hover:underline">
                                Forgot password?
                              </Link>
                            </div>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              required
                              value={loginData.password}
                              onChange={handleLoginChange}
                            />
                          </div>
                          <Button type="submit" className="w-full bg-[#C8A97E] hover:bg-[#8A6D3B]" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                              </>
                            ) : (
                              "Login"
                            )}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="register">
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <form onSubmit={handleRegister}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium">
                              Full Name
                            </label>
                            <Input
                              id="fullName"
                              name="fullName"
                              placeholder="John Doe"
                              required
                              value={registerData.fullName}
                              onChange={handleRegisterChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="registerEmail" className="text-sm font-medium">
                              Email
                            </label>
                            <Input
                              id="registerEmail"
                              name="email"
                              type="email"
                              placeholder="your.email@example.com"
                              required
                              value={registerData.email}
                              onChange={handleRegisterChange}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="chapterName" className="text-sm font-medium">
                                Chapter Name
                              </label>
                              <Input
                                id="chapterName"
                                name="chapterName"
                                placeholder="e.g. Lagos Chapter"
                                value={registerData.chapterName}
                                onChange={handleRegisterChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="membershipId" className="text-sm font-medium">
                                Membership ID (if any)
                              </label>
                              <Input
                                id="membershipId"
                                name="membershipId"
                                placeholder="ECI-12345"
                                value={registerData.membershipId}
                                onChange={handleRegisterChange}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="registerPassword" className="text-sm font-medium">
                                Password
                              </label>
                              <Input
                                id="registerPassword"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={registerData.password}
                                onChange={handleRegisterChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                              </label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full bg-[#C8A97E] hover:bg-[#8A6D3B]" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                              </>
                            ) : (
                              "Register"
                            )}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-600">
                  {activeTab === "login" ? (
                    <p>
                      Don&apos;t have an account?{" "}
                      <button onClick={() => setActiveTab("register")} className="text-[#C8A97E] hover:underline">
                        Register here
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button onClick={() => setActiveTab("login")} className="text-[#C8A97E] hover:underline">
                        Login here
                      </button>
                    </p>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
