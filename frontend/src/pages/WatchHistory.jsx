"use client"

import { useState, useEffect } from "react"
import { authAPI } from "../services/api"
import VideoCard from "../components/Video/VideoCard"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import { Clock } from "lucide-react"
import toast from "react-hot-toast"

const WatchHistory = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchHistory()
  }, [])

  const fetchWatchHistory = async () => {
    try {
      const response = await authAPI.getWatchHistory()
      setVideos(response.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch watch history")
    } finally {
      setLoading(false)
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
        <div className="flex items-center space-x-3">
          <Clock className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Watch History</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Videos you've watched ({videos.length})</p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No watch history yet</p>
          <p className="text-sm text-gray-400 mt-2">Videos you watch will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WatchHistory
