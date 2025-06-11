"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateAccount({ fullName, username });
      setUser({ ...user, fullName, username });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await authAPI.updateAvatar(formData);
      setUser({ ...user, avatar: res.data.data.avatar });
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to update avatar");
    }
    setLoading(false);
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("coverImage", file);
      const res = await authAPI.updateCoverImage(formData);
      setUser({ ...user, coverImage: res.data.data.coverImage });
      toast.success("Cover image updated!");
    } catch {
      toast.error("Failed to update cover image");
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.changePassword(passwords);
      toast.success("Password changed!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      toast.error("Failed to change password");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Update Profile
        </button>
      </form>

      <div className="mb-8">
        <label className="block mb-1 font-medium">Avatar</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>
      <div className="mb-8">
        <label className="block mb-1 font-medium">Cover Image</label>
        <input type="file" accept="image/*" onChange={handleCoverChange} />
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Old Password</label>
          <input
            type="password"
            className="input"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            className="input"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Settings;
