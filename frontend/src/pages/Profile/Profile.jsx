"use client"

import { useState } from "react"
import { Camera, Edit } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { authAPI } from "../../services/api"
import LoadingSpinner from "../../components/UI/LoadingSpinner"
import toast from "react-hot-toast"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    username: user?.username || "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.updateAccount(formData)
      updateUser(response.data.data)
      setEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (type, file) => {
    const formData = new FormData()
    formData.append(type, file)

    try {
      const response =
        type === "avatar" ? await authAPI.updateAvatar(formData) : await authAPI.updateCoverImage(formData)

      updateUser(response.data.data)
      toast.success(`${type === "avatar" ? "Avatar" : "Cover image"} updated successfully`)
    } catch (error) {
      toast.error(`Failed to update ${type}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden mb-6">
        {user?.coverImage && (
          <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <label className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full cursor-pointer hover:bg-opacity-70 transition-colors">
          <Camera size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleImageUpload("coverImage", e.target.files[0])}
          />
        </label>
      </div>

      {/* Profile Info */}
      <div className="flex items-start space-x-6 mb-8">
        <div className="relative">
          <img
            src={user?.avatar || "/placeholder.svg?height=120&width=120"}
            alt={user?.fullName}
            className="w-30 h-30 rounded-full object-cover border-4 border-white dark:border-gray-800"
          />
          <label className="absolute bottom-2 right-2 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files[0] && handleImageUpload("avatar", e.target.files[0])}
            />
          </label>
        </div>

        <div className="flex-1">
          {!editing ? (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">@{user?.username}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.email}</p>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                  {loading && <LoadingSpinner size="sm" className="mr-2" />}
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
