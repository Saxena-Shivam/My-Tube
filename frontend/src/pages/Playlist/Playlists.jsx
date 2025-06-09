"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PlaySquare, Plus, Edit, Trash2 } from "lucide-react"
import { playlistsAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import LoadingSpinner from "../../components/UI/LoadingSpinner"
import toast from "react-hot-toast"

const Playlists = () => {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists()
    }
  }, [user])

  const fetchPlaylists = async () => {
    try {
      const response = await playlistsAPI.getUserPlaylists(user._id)
      setPlaylists(response.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch playlists")
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()

    try {
      const response = await playlistsAPI.createPlaylist(formData)
      setPlaylists([response.data.data, ...playlists])
      setFormData({ name: "", description: "" })
      setShowCreateForm(false)
      toast.success("Playlist created successfully")
    } catch (error) {
      toast.error("Failed to create playlist")
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await playlistsAPI.deletePlaylist(playlistId)
        setPlaylists(playlists.filter((p) => p._id !== playlistId))
        toast.success("Playlist deleted successfully")
      } catch (error) {
        toast.error("Failed to delete playlist")
      }
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
          <div className="flex items-center space-x-3">
            <PlaySquare className="text-green-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Playlists</h1>
          </div>
          <button onClick={() => setShowCreateForm(true)} className="btn-primary">
            <Plus size={16} className="mr-2" />
            Create Playlist
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your playlists ({playlists.length})</p>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Playlist</h2>
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Enter playlist name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                placeholder="Enter playlist description"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Playlist
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <PlaySquare size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No playlists yet</p>
          <p className="text-sm text-gray-400 mt-2">Create your first playlist to organize your videos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="card overflow-hidden group">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                {playlist.videos?.[0]?.thumbnail ? (
                  <img
                    src={playlist.videos[0].thumbnail || "/placeholder.svg"}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlaySquare size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {playlist.videosCount || 0} videos
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{playlist.name}</h3>
                {playlist.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{playlist.description}</p>
                )}

                <div className="flex items-center justify-between mt-4">
                  <Link
                    to={`/playlist/${playlist._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Playlist
                  </Link>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Playlists
