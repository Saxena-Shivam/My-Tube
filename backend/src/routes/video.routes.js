import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Video } from "../models/video.model.js"; // <-- Add this import

const router = Router();

// PUBLIC ROUTES

// --- ADD THIS BLOCK: Trending Route ---
router.get("/trending", async (req, res) => {
  try {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const trendingVideos = await Video.find({
      createdAt: { $gte: twoMonthsAgo },
      isPublished: true,
    })
      .sort({ views: -1 })
      .limit(40);

    res.json({ data: trendingVideos });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trending videos" });
  }
});
// --- END BLOCK ---

router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);

// PROTECTED ROUTES
router.use(verifyJWT);

router.route("/").post(
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

router
  .route("/:videoId")
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
