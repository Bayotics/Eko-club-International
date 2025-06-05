"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  _id: string
  fullName: string
  email: string
  role: string
  profileImage?: string
  chapterName?: string
  membershipId?: string
  createdAt?: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          setLoading(false)
          return
        }

        const token = localStorage.getItem("token")

        // If no token, don't attempt to fetch
        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Only clear user if we get a 401 Unauthorized
          // For other errors, keep the current user state to prevent flickering
          if (response.status === 401) {
            setUser(null)
            localStorage.removeItem("token")
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // Don't clear user on network errors to prevent flickering
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = (userData: User, token: string) => {
    setUser(userData)
    localStorage.setItem("token", token)
  }

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        setUser(null)
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Error logging out:", error)
      // Still remove token and user on error to ensure user can log out even if API fails
      setUser(null)
      localStorage.removeItem("token")
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      // If no token, don't attempt to fetch
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Only clear user if we get a 401 Unauthorized
        if (response.status === 401) {
          setUser(null)
          localStorage.removeItem("token")
        }
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
      // Don't clear user on network errors
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
