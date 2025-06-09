"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Eye, ThumbsUp, Users, Upload, Edit, Trash2 } from "lucide-react"
import { dashboardAPI, videoAPI } from "../../services/api"
import LoadingSpinner from "../../components/UI/LoadingSpinner"
import { formatViews } from "../../utils/formatUtils"
import toast from "react-hot-toast"

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, videosResponse] = await Promise.all([dashboardAPI.getStats(), dashboardAPI.getUserVideos()])

      setStats(statsResponse.data.data)
      setVideos(videosResponse.data.data)
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (video) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await videoAPI.deleteVideo(video._id)
        setVideos(videos.filter((v) => v._id !== video._id))
        toast.success("Video deleted successfully")
      } catch (error) {
        toast.error("Failed to delete video")
      }
    }
  }

  const handleTogglePublish = async (video) => {
    try {
      await videoAPI.togglePublishStatus(video._id)
      setVideos(videos.map((v) => (v._id === video._id ? { ...v, isPublished: !v.isPublished } : v)))
      toast.success(`Video ${video.isPublished ? "unpublished" : "published"} successfully`)
    } catch (error) {
      toast.error("Failed to update video status")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <Link to="/upload" className="btn-primary">
            <Upload size={16} className="mr-2" />
            Upload Video
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your content and view analytics</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Eye className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatViews(stats.totalViews)}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <ThumbsUp className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatViews(stats.totalLikes)}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscribers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatViews(stats.totalSubscribers)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Videos ({videos.length})</h2>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No videos uploaded yet</p>
            <Link to="/upload" className="btn-primary">
              Upload Your First Video
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <img
                  src={video.thumbnail || "/placeholder.svg?height=90&width=160"}
                  alt={video.title}
                  className="w-40 h-24 object-cover rounded"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{video.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatViews(video.views)} views • {video.isPublished ? "Published" : "Draft"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTogglePublish(video)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      video.isPublished
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {video.isPublished ? "Published" : "Draft"}
                  </button>

                  <Link
                    to={`/video/${video._id}/edit`}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit size={16} />
                  </Link>

                  <button onClick={() => handleDeleteVideo(video)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
