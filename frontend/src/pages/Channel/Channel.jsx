"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users, User } from "lucide-react";
import { authAPI, subscriptionsAPI, videoAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";

const Channel = () => {
  const { username } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchChannel();
      fetchChannelVideos();
    }
    // eslint-disable-next-line
  }, [username]);

  const fetchChannel = async () => {
    try {
      const response = await authAPI.getChannelByUsername(username);
      setChannel(response.data.data);

      // If your API returns a list of subscriber IDs:
      if (response.data.data.subscribers?.includes(user?._id)) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }

      // OR if your API returns a boolean like isSubscribed:
      // setIsSubscribed(response.data.data.isSubscribed);
    } catch (error) {
      toast.error("Failed to load channel");
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelVideos = async () => {
    setVideosLoading(true);
    try {
      // Adjust the API call as per your backend route
      const response = await videoAPI.getVideosByUsername(username);
      setVideos(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      return;
    }

    try {
      await subscriptionsAPI.toggleSubscription(channel._id);
      setIsSubscribed(!isSubscribed);
      toast.success(isSubscribed ? "Unsubscribed" : "Subscribed!");
    } catch (error) {
      toast.error("Failed to update subscription");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {channel.coverImage && (
          <img
            src={channel.coverImage || "/placeholder.svg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Info */}
      <div className="px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            {channel.avatar ? (
              <img
                src={channel.avatar || "/placeholder.svg"}
                alt={channel.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                <User size={48} className="text-gray-500" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {channel.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              @{channel.username}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Users size={16} className="mr-1" />
                {channel.subscribersCount || 0} subscribers
              </span>
              <span>{channel.videosCount || 0} videos</span>
            </div>
          </div>

          {isAuthenticated && user?._id !== channel._id && (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSubscribed
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        {/* Channel Description */}
        {channel.description && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              {channel.description}
            </p>
          </div>
        )}

        {/* Videos Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Videos
          </h2>
          {videosLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No videos found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow p-4"
                >
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {video.description?.slice(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
