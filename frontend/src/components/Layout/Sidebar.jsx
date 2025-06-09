"use client"
import { Link, useLocation } from "react-router-dom"
import { Home, TrendingUp, Users, Clock, ThumbsUp, PlaySquare, BarChart3, Settings, User } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { icon: Home, label: "Home", path: "/", public: true },
    { icon: TrendingUp, label: "Trending", path: "/trending", public: true },
    { icon: Users, label: "Subscriptions", path: "/subscriptions", auth: true },
  ]

  const libraryItems = [
    { icon: Clock, label: "History", path: "/history", auth: true },
    { icon: ThumbsUp, label: "Liked Videos", path: "/liked-videos", auth: true },
    { icon: PlaySquare, label: "Playlists", path: "/playlists", auth: true },
  ]

  const creatorItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard", auth: true },
    { icon: Settings, label: "Settings", path: "/settings", auth: true },
  ]

  const SidebarSection = ({ title, items }) => (
    <div className="mb-6">
      {title && (
        <h3 className="px-4 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          if (item.auth && !isAuthenticated) return null

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg mx-2 transition-colors ${
                isActive(item.path)
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <SidebarSection items={menuItems} />

        {isAuthenticated && (
          <>
            <hr className="border-gray-200 dark:border-gray-700 mb-6" />
            <SidebarSection title="Library" items={libraryItems} />

            <hr className="border-gray-200 dark:border-gray-700 mb-6" />
            <SidebarSection title="Creator Studio" items={creatorItems} />

            {user && (
              <>
                <hr className="border-gray-200 dark:border-gray-700 mb-6" />
                <div className="px-4">
                  <Link
                    to={`/c/${user.username}`}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Your Channel</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.username}</p>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
