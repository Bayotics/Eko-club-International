"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff, Upload, X, User } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Clear error when tab changes
  useEffect(() => {
    setError("")
  }, [activeTab])

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  function generateMembershipId(length = 19) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    chapterName: "",
    profileImage: "",
    phone: "",
    membershipId: generateMembershipId()
  })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      uploadImageToCloudinary(file)
    }
  }

  const uploadImageToCloudinary = async (file) => {
    setIsUploading(true)

    try {
      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      // formData.append("upload_preset", "eko_club_profiles") // Create this preset in your Cloudinary dashboard

      // Upload to Cloudinary
      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.secure_url) {
        setProfileImageUrl(data.secure_url)
        setRegisterData((prev) => ({ ...prev, profileImage: data.secure_url }))

        toast({
          title: "Image Uploaded",
          description: "Your profile image has been uploaded successfully.",
          variant: "default",
        })
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (err) {
      console.error("Error uploading image:", err)

      toast({
        title: "Upload Failed",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      })

      // Clear the preview
      setProfileImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeProfileImage = () => {
    setProfileImage(null)
    setProfileImageUrl("")
    setRegisterData((prev) => ({ ...prev, profileImage: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
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
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Check if user is verified
      if (!data.user.isVerified) {
        setError("Please verify your email before logging in. Check your inbox for the verification link.")
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before logging in. Check your inbox for the verification link.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Check if user is blocked
      if (data.user.role === "blocked") {
        setError("Your account has been blocked. Please contact an administrator for assistance.")
        toast({
          title: "Account Blocked",
          description: "Your account has been blocked. Please contact an administrator for assistance.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Update auth context with user data
      login(data.user, data.token)

      // Show appropriate toast based on user role
      if (data.user.role === "pending") {
        toast({
          title: "Login Successful",
          description: "Your account is pending approval. Some features will be limited until approved.",
          variant: "default",
          duration: 6000,
        })
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back to Eko Club International!",
          variant: "default",
        })
      }

      // Redirect to member dashboard
      router.push("/members/dashboard")
    } catch (err) {
      console.error("Login error:", err)

      // Set error for Alert component
      setError(err.message || "An error occurred during login")

      // Show error toast
      toast({
        title: "Login Failed",
        description: err.message || "An error occurred during login",
        variant: "destructive",
      })
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
      const errorMsg = "Passwords do not match"
      setError(errorMsg)

      toast({
        title: "Password Mismatch",
        description: errorMsg,
        variant: "destructive",
      })

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

      // Show success toast with verification instructions
      toast({
        title: "Registration Initiated",
        description: "Please check your email to verify your account. The verification link will expire in 24 hours. If you do not receive anything in your inbox, check your spam folder",
        variant: "default",
        duration: 6000,
      })

      // Switch to login tab after successful registration
      setActiveTab("login")
      setLoginData({
        email: registerData.email,
        password: "",
      })
    } catch (err) {
      console.error("Registration error:", err)

      // Set error for Alert component
      setError(err.message || "An error occurred during registration")

      // Show error toast
      toast({
        title: "Registration Failed",
        description: err.message || "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handlePhoneChange = (value) => {
    setRegisterData((prev) => ({ ...prev, phone: value }))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Add Toaster component to render toast notifications */}
      <Toaster />

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
              <div className="bg-[#78b16d]/10 p-6 rounded-lg border border-[#78b16d]/20">
                <h2 className="text-xl font-semibold mb-4 text-[#8A6D3B]">Member Benefits</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-[#78b16d] rounded-full p-1 text-white">
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
                    <div className="mr-2 mt-1 bg-[#78b16d] rounded-full p-1 text-white">
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
                    <div className="mr-2 mt-1 bg-[#78b16d] rounded-full p-1 text-white">
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
                    <div className="mr-2 mt-1 bg-[#78b16d] rounded-full p-1 text-white">
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
                    <div className="mr-2 mt-1 bg-[#78b16d] rounded-full p-1 text-white">
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
                      {error && activeTab === "login" && (
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
                              <Link href="/forgot-password" className="text-sm text-[#78b16d] hover:underline">
                                Forgot password?
                              </Link>
                            </div>
                            <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Input your password"
                                required
                                value={loginData.password}
                                onChange={handleLoginChange}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <Button type="submit" className="w-full bg-[#78b16d] hover:bg-[#8A6D3B]" disabled={isLoading}>
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
                      {error && activeTab === "register" && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <form onSubmit={handleRegister}>
                        <div className="space-y-4">
                          {/* Profile Image Upload */}
                          <div className="flex flex-col items-center mb-6">
                            <label className="text-sm font-medium mb-2">Profile Picture</label>
                            <div className="relative">
                              {profileImage ? (
                                <div className="relative">
                                  <Avatar className="w-24 h-24 border-2 border-[#78b16d]">
                                    <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile preview" />
                                    <AvatarFallback>
                                      <User className="w-12 h-12 text-gray-400" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <button
                                    type="button"
                                    onClick={removeProfileImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    aria-label="Remove image"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={triggerFileInput}
                                  className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#78b16d] transition-colors"
                                >
                                  <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                              )}

                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleProfileImageChange}
                                accept="image/*"
                                className="hidden"
                                id="profile-image"
                              />
                            </div>
                            {isUploading && (
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </div>
                            )}
                            {!profileImage && !isUploading && (
                              <button
                                type="button"
                                onClick={triggerFileInput}
                                className="mt-2 text-sm text-[#78b16d] hover:underline"
                              >
                                Upload Photo
                              </button>
                            )}
                          </div>

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
                          <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">
                              Phone Number
                            </label>
                            <div className="phone-input-container">
                              <PhoneInput
                                international
                                countryCallingCodeEditable={true}
                                defaultCountry="US"
                                value={registerData.phone}
                                onChange={handlePhoneChange}
                                className="phone-input"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="chapterName" className="text-sm font-medium">
                                Chapter Name
                              </label>
                              <Select
                                name="chapterName"
                                value={registerData.chapterName}
                                onValueChange={(value) => setRegisterData((prev) => ({ ...prev, chapterName: value }))}
                              >
                                <SelectTrigger id="chapterName" className="w-full">
                                  <SelectValue placeholder="Select your chapter" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Atlanta">Atlanta</SelectItem>
                                  <SelectItem value="Austin">Austin</SelectItem>
                                  <SelectItem value="California">California</SelectItem>
                                  <SelectItem value="Dallas">Dallas</SelectItem>
                                  <SelectItem value="DC Metro">DC Metro</SelectItem>
                                  <SelectItem value="Delaware Valley">Delaware Valley</SelectItem>
                                  <SelectItem value="Detroit">Detroit</SelectItem>
                                  <SelectItem value="Eko Lagosians of Canada">Eko Lagosians of Canada</SelectItem>
                                  <SelectItem value="Florida">Florida</SelectItem>
                                  <SelectItem value="Houston">Houston</SelectItem>
                                  <SelectItem value="Eko club Houston Women">Eko club Houston Women</SelectItem>
                                  <SelectItem value="London">London</SelectItem>
                                  <SelectItem value="Louisiana">Louisiana</SelectItem>
                                  <SelectItem value="Miami">Miami</SelectItem>
                                  <SelectItem value="Minnesota">Minnesota</SelectItem>
                                  <SelectItem value="Eko Lagosians of Minnesota">Eko Lagosians of Minnesota</SelectItem>
                                  <SelectItem value="New Jersey">New Jersey</SelectItem>
                                  <SelectItem value="New York">New York</SelectItem>
                                  <SelectItem value="Ohio">Ohio</SelectItem>
                                  <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                                  <SelectItem value="Philadelphia">Philadelphia</SelectItem>
                                  <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                                  <SelectItem value="San Antonio">San Antonio</SelectItem>
                                  <SelectItem value="Lagosians of Chicago">Lagosians of Chicago</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md border border-gray-200">
                                <p className="font-medium text-gray-700 mb-1">Note about Membership ID:</p>
                                <p>
                                  Membership IDs are assigned by administrators after your registration is approved.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="registerPassword" className="text-sm font-medium">
                                Password
                              </label>
                              <div className="relative">
                                <Input
                                  id="registerPassword"
                                  name="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Input Password"
                                  required
                                  value={registerData.password}
                                  onChange={handleRegisterChange}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  onClick={() => setShowPassword(!showPassword)}
                                  aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                              </label>
                              <div className="relative">
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm Password"
                                  required
                                  value={registerData.confirmPassword}
                                  onChange={handleRegisterChange}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-[#78b16d] hover:bg-[#8A6D3B]"
                            disabled={isLoading || isUploading}
                          >
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
                      <button onClick={() => setActiveTab("register")} className="text-[#78b16d] hover:underline">
                        Register here
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button onClick={() => setActiveTab("login")} className="text-[#78b16d] hover:underline">
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
      <style jsx global>{`
        .phone-input-container {
          position: relative;
        }
        .phone-input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.375rem;
          border: 1px solid #e2e8f0;
          background-color: white;
        }
        .PhoneInputInput {
          border: none;
          outline: none;
          width: 70%;
          padding: 0.5rem 0;
          background-color: transparent;
        }
        .PhoneInputCountry{
          width: 10%
        }
        .PhoneInputCountrySelect {
          position: relative;
          align-self: stretch;
          display: flex;
          align-items: center;
        }
          .PhoneInputCountryIcon{
            width: 100%
          }
      `}</style>
    </main>
  )
}
