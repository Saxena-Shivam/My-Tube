"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (token) {
        const response = await authAPI.getCurrentUser()
        setUser(response.data.data)
        setIsAuthenticated(true)
      }
    } catch (error) {
      localStorage.removeItem("accessToken")
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { user: userData, accessToken } = response.data.data

      localStorage.setItem("accessToken", accessToken)
      setUser(userData)
      setIsAuthenticated(true)

      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (formData) => {
    try {
      const response = await authAPI.register(formData)
      toast.success("Registration successful! Please login.")
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("accessToken")
      setUser(null)
      setIsAuthenticated(false)
      toast.success("Logged out successfully!")
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
