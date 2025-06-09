"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { videoAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState({
    videoFile: null,
    thumbnail: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({
      ...files,
      [name]: selectedFiles[0],
    });
  };

  const removeFile = (fileType) => {
    setFiles({
      ...files,
      [fileType]: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.videoFile) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("videoFile", files.videoFile);

    if (files.thumbnail) {
      submitData.append("thumbnail", files.thumbnail);
    }

    try {
      await videoAPI.uploadVideo(submitData, (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
      });

      toast.success("Video uploaded successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Upload Video
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Share your content with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Video Details
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter video title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Tell viewers about your video"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Files
          </h2>

          <div className="space-y-6">
            {/* Video File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video File *
              </label>

              {!files.videoFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e)}
                    name="videoFile"
                    className="hidden"
                    id="videoFile"
                  />
                  <label
                    htmlFor="videoFile"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload size={48} className="text-gray-400" />
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      Select video file
                    </span>
                    <span className="text-sm text-gray-500">
                      MP4, WebM, or other video formats
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Upload size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {files.videoFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(files.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("videoFile")}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail (Optional)
              </label>

              {!files.thumbnail ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                    name="thumbnail"
                    className="hidden"
                    id="thumbnail"
                  />
                  <label
                    htmlFor="thumbnail"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Select thumbnail
                    </span>
                    <span className="text-xs text-gray-500">
                      JPG, PNG, or GIF
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        URL.createObjectURL(files.thumbnail) ||
                        "/placeholder.svg"
                      }
                      alt="Thumbnail preview"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {files.thumbnail.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(files.thumbnail.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("thumbnail")}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Uploading...
              </span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn-secondary"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !files.videoFile}
            className="btn-primary disabled:opacity-50"
          >
            {uploading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Uploading...
              </>
            ) : (
              "Upload Video"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;
