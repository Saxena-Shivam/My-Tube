"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { MoreVertical, Clock, Eye } from "lucide-react"
import { formatDistanceToNow } from "../../utils/dateUtils"
import { formatViews } from "../../utils/formatUtils"

const VideoCard = ({ video, showOptions = false, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleMenuClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  return (
    <div className="group relative">
      <Link to={`/video/${video._id}`} className="block">
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          <img
            src={video.thumbnail || "/placeholder.svg?height=180&width=320"}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              <Clock size={12} className="inline mr-1" />
              {video.duration}
            </div>
          )}
        </div>

        <div className="mt-3 flex space-x-3">
          <div className="flex-shrink-0">
            <img
              src={video.owner?.avatar || "/placeholder.svg?height=36&width=36"}
              alt={video.owner?.fullName}
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {video.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.owner?.fullName}</p>

            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="flex items-center">
                <Eye size={12} className="mr-1" />
                {formatViews(video.views)} views
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>
          </div>
        </div>
      </Link>

      {showOptions && (
        <div className="absolute top-2 right-2">
          <button
            onClick={handleMenuClick}
            className="p-1 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
              <button
                onClick={() => {
                  onEdit?.(video)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.(video)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoCard
