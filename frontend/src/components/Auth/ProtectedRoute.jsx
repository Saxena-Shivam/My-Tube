"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import LoadingSpinner from "../UI/LoadingSpinner"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
