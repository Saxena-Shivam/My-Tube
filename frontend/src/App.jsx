import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register";
import VideoDetail from "./pages/Video/VideoDetail";
import VideoUpload from "./pages/Video/VideoUpload";
import Profile from "./pages/Profile/Profile";
import Channel from "./pages/Channel/Channel";
import Dashboard from "./pages/Dashboard/Dashboard";
import Playlists from "./pages/Playlist/Playlists";
import LikedVideos from "./pages/LikedVideos";
import WatchHistory from "./pages/WatchHistory";
import Subscriptions from "./pages/Subscriptions";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="video/:videoId" element={<VideoDetail />} />
              <Route path="c/:username" element={<Channel />} />

              {/* Protected Routes */}
              <Route
                path="upload"
                element={
                  <ProtectedRoute>
                    <VideoUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="playlists"
                element={
                  <ProtectedRoute>
                    <Playlists />
                  </ProtectedRoute>
                }
              />
              <Route
                path="liked-videos"
                element={
                  <ProtectedRoute>
                    <LikedVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="history"
                element={
                  <ProtectedRoute>
                    <WatchHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscriptions"
                element={
                  <ProtectedRoute>
                    <Subscriptions />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
