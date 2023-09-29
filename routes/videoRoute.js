const express = require('express');
const multer = require('multer');
const { uploadVideo, getVideoById,getVideoByUniqueName , getAllVideo} = require('../controllers/videoController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'videos_uploads/'); // Destination directory where video files is stored
    },
    filename: (req, file, cb) => {
      const uniqueFilename = Date.now()+ '-' + file.originalname;
      cb(null, uniqueFilename ); // Unique filename for each video
    },
  });
  
  const upload = multer({ storage });
  
// Define the video upload route
router.post('/save', upload.single('videoFile'), uploadVideo);
router.get('/all', getAllVideo);
router.get("/uniqueName", getVideoByUniqueName );
router.get("/:Id", getVideoById );


module.exports = router;
