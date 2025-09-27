"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("rural_learning_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("[v0] Failed to parse stored user:", error)
        localStorage.removeItem("rural_learning_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on credentials
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        phone: credentials.phone,
        role: credentials.phone.endsWith("1") ? "admin" : credentials.phone.endsWith("2") ? "teacher" : "student",
        name: credentials.phone.endsWith("1")
          ? "Admin User"
          : credentials.phone.endsWith("2")
            ? "Teacher User"
            : "Student User",
        verified: true,
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      localStorage.setItem("rural_learning_user", JSON.stringify(mockUser))

      return { success: true, user: mockUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        role: "student", // Default role
        verified: false,
        createdAt: new Date().toISOString(),
      }

      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const verifyOTP = async (phone, otp) => {
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (otp === "123456") {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          phone,
          role: phone.endsWith("1") ? "admin" : phone.endsWith("2") ? "teacher" : "student",
          name: phone.endsWith("1") ? "Admin User" : phone.endsWith("2") ? "Teacher User" : "Student User",
          verified: true,
          createdAt: new Date().toISOString(),
        }

        setUser(userData)
        localStorage.setItem("rural_learning_user", JSON.stringify(userData))

        return { success: true, user: userData }
      } else {
        return { success: false, error: "Invalid OTP" }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("rural_learning_user")
  }

  const hasRole = (requiredRole) => {
    if (!user) return false

    const roleHierarchy = {
      student: 1,
      teacher: 2,
      admin: 3,
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  const value = {
    user,
    loading,
    login,
    register,
    verifyOTP,
    logout,
    hasRole,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isTeacher: user?.role === "teacher",
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
