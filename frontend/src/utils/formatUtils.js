export const formatViews = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M"
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K"
  }
  return views?.toString() || "0"
}

export const formatDistanceToNow = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""}`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""}`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? "s" : ""}`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years > 1 ? "s" : ""}`
  }
}

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
}
