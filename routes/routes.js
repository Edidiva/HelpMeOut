const express = require("express");
const {
  getVideoById,
  getAllVideos,
  streamVideo,
  endStream,
} = require("../controllers/videohelper");
const multer = require("multer");
const path = require("path")

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/video/stream",
  upload.fields([{ name: "blob" }, { name: "videoId" }]),
  streamVideo
);
router.get("/stream/end/:videoId", endStream);
router.get("/video/get/:videoId", getVideoById);
router.get("/videos", getAllVideos);

module.exports = router;