"use client"

import { useState, useEffect } from "react"
import { videoAPI } from "../services/api"
import VideoCard from "../components/Video/VideoCard"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import toast from "react-hot-toast"

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async (pageNum = 1) => {
    try {
      setLoading(true)
      const response = await videoAPI.getAllVideos(pageNum, 12)
      const newVideos = response.data.data.videos || []

      if (pageNum === 1) {
        setVideos(newVideos)
      } else {
        setVideos((prev) => [...prev, ...newVideos])
      }

      setHasMore(newVideos.length === 12)
      setPage(pageNum)
    } catch (error) {
      toast.error("Failed to fetch videos")
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchVideos(page + 1)
    }
  }

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommended Videos</h1>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No videos found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button onClick={loadMore} disabled={loading} className="btn-primary disabled:opacity-50">
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
