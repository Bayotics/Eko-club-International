"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error state
    setError(null)

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      toast.error("Please enter a valid email address")
      return
    }

    // Set loading state
    setIsLoading(true)

    try {
      // Submit to API
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      // Show success message
      toast.success(data.message || "Thank you for subscribing to our newsletter!")

      // Reset form
      setEmail("")
    } catch (error) {
      // Show error message
      const errorMessage = error instanceof Error ? error.message : "Failed to subscribe. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      // Reset loading state
      setIsLoading(false)
    }
  }

  return (
    <section className="relative py-20 md:py-28">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-10"
          aria-hidden="true"
        />
        <div className="w-full h-full bg-gray-900"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6"
          >
            Get updated by subscribing to our newsletter
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-10"
          >
            Get instant news by subscribing to our monthly newsletter
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
          >
            <div className="flex-grow relative rounded-full overflow-hidden border-2 border-white/30 focus-within:border-white/50">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-none text-white placeholder:text-white/70 h-14 px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "email-error" : undefined}
              />
            </div>
            <Button
              type="submit"
              className="h-14 px-8 rounded-full bg-[#F9D75E] hover:bg-[#F0C83D] text-black font-medium text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </motion.form>

          {error && (
            <p id="email-error" className="mt-2 text-red-400 text-sm">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
