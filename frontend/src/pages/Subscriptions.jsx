"use client";

import { useState, useEffect } from "react";
import { subscriptionsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { Users, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Subscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const response = await subscriptionsAPI.getSubscribedChannels();
      setSubscriptions(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Users className="text-purple-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subscriptions
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Channels you're subscribed to ({subscriptions.length})
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No subscriptions yet
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Subscribe to channels to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subscriptions.map((channel) => (
            <Link
              key={channel._id}
              to={`/c/${channel.username}`}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                {channel.avatar ? (
                  <img
                    src={channel.avatar || "/placeholder.svg"}
                    alt={channel.fullName}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-gray-500" />
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {channel.fullName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  @{channel.username}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {channel.subscribersCount || 0} subscribers
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
