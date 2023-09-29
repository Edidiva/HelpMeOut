const express = require('express');
const multer = require('multer');
const { uploadVideo, getVideo } = require('../controllers/videoController');

const router = express.Router();
const upload = multer({ dest: 'videos_uploads/' }); // upload destination

// Define the video upload route
router.post('/upload', upload.single('video'), uploadVideo);
router.get("/:videoId", getVideo )

module.exports = router;
