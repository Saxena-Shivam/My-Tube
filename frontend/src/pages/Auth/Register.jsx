"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Upload } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import LoadingSpinner from "../../components/UI/LoadingSpinner"

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  })
  const [files, setFiles] = useState({
    avatar: null,
    coverImage: null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target
    setFiles({
      ...files,
      [name]: selectedFiles[0],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const submitData = new FormData()
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key])
    })

    if (files.avatar) {
      submitData.append("avatar", files.avatar)
    }
    if (files.coverImage) {
      submitData.append("coverImage", files.coverImage)
    }

    const result = await register(submitData)

    if (result.success) {
      navigate("/login")
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">YT</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Avatar (Optional)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatar"
                  className="cursor-pointer flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Upload size={16} />
                  <span className="text-sm">Choose Avatar</span>
                </label>
                {files.avatar && <span className="text-sm text-gray-500">{files.avatar.name}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image (Optional)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="coverImage"
                  className="cursor-pointer flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Upload size={16} />
                  <span className="text-sm">Choose Cover</span>
                </label>
                {files.coverImage && <span className="text-sm text-gray-500">{files.coverImage.name}</span>}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <LoadingSpinner size="sm" className="mr-2" />}
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
