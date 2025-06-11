"use client";

import { useState, useEffect } from "react";
import { videoAPI } from "../services/api";
import VideoCard from "../components/Video/VideoCard";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { Flame } from "lucide-react";
import toast from "react-hot-toast";

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const fetchTrendingVideos = async () => {
    try {
      setLoading(true);
      const response = await videoAPI.getTrendingVideos();
      setVideos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching trending videos:", error);
      toast.error("Failed to fetch trending videos");
    } finally {
      setLoading(false);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Flame className="text-orange-500" size={32} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Trending Videos
          </h1>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Flame size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No trending videos found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
