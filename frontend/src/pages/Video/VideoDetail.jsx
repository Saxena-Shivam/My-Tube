"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, Share, Download, Eye, Calendar } from "lucide-react";
import {
  videoAPI,
  likesAPI,
  subscriptionsAPI,
  authAPI,
  commentsAPI,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { formatViews, formatDistanceToNow } from "../../utils/formatUtils";
import toast from "react-hot-toast";

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      addToWatchHistory(videoId);
      fetchComments();
    }
    // eslint-disable-next-line
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await videoAPI.getVideoById(videoId);
      setVideo(response.data.data);

      // Check if user has liked the video
      if (response.data.data.likedBy?.includes(user?._id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

      // Check if user is subscribed to the channel
      if (response.data.data.owner?.subscribers?.includes(user?._id)) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      toast.error("Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const addToWatchHistory = async (videoId) => {
    try {
      await authAPI.addToWatchHistory(videoId);
    } catch (error) {
      // Optionally handle error
    }
  };

  const fetchComments = async () => {
    try {
      const res = await commentsAPI.getComments(videoId);
      // Use res.data.data.comments to get the array
      setComments(
        Array.isArray(res.data.data.comments) ? res.data.data.comments : []
      );
    } catch {
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      await commentsAPI.addComment(videoId, commentText);
      setCommentText("");
      fetchComments();
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like videos");
      return;
    }

    try {
      await likesAPI.toggleVideoLike(videoId);
      setIsLiked((prev) => !prev);
      toast.success(
        isLiked ? "Removed from liked videos" : "Added to liked videos"
      );
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      return;
    }

    if (!video?.owner?._id) return;

    try {
      await subscriptionsAPI.toggleSubscription(video.owner._id);
      setIsSubscribed((prev) => !prev);
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

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Video not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <video controls className="w-full h-full" poster={video.thumbnail}>
              <source src={video.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {video.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  {formatViews(video.views)} views
                </span>
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatDistanceToNow(new Date(video.createdAt))} ago
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>{isLiked ? "Unlike" : "Like"}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Share size={16} />
                  <span>Share</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <Link to={`/c/${video.owner?.username}`}>
                  <img
                    src={
                      video.owner?.avatar ||
                      "/placeholder.svg?height=48&width=48"
                    }
                    alt={video.owner?.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <Link
                    to={`/c/${video.owner?.username}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {video.owner?.fullName}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{video.owner?.username}
                  </p>
                </div>
              </div>

              {isAuthenticated && user?._id !== video.owner?._id && (
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isSubscribed
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              )}
            </div>

            {/* Description */}
            {video.description && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div
                  className={`text-gray-700 dark:text-gray-300 ${
                    !showDescription ? "line-clamp-3" : ""
                  }`}
                >
                  {video.description}
                </div>
                {video.description.length > 200 && (
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                  >
                    {showDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Comments
              </h3>
              <form
                onSubmit={handleCommentSubmit}
                className="flex mb-4 space-x-2"
              >
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={commentLoading}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                  disabled={commentLoading}
                >
                  {commentLoading ? "Posting..." : "Post"}
                </button>
              </form>
              <div>
                {comments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="mb-3">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            comment.owner?.avatar ||
                            "/placeholder.svg?height=32&width=32"
                          }
                          alt={comment.owner?.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.owner?.username}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="ml-10 text-gray-800 dark:text-gray-200">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Related Videos
          </h3>
          {/* Add related videos component here */}
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Related videos coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
