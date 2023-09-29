const Video = require('../model/videoModel');
const mongoose = require('mongoose');
const fs = require('fs');

// Controller function to handle video upload
async function uploadVideo(req, res) {
  try {
    const videoPath = req.file.path;
    const newVideo = new Video({
      title: req.body.title,
      filePath: videoPath,
    });

    await newVideo.save();

    res.json({ message: 'Video uploaded successfully', videoId: newVideo._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading video' });
  }
}

async function getVideo(req, res){
    try {
        const { videoId } = req.params; // Get the ID from request parameters
        
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({
                error: 'Invalid ID format',
            });
        };

        const video = await Video.findById({ _id: videoId });
        if (!video) {
            return res.status(404).json({
                error: "Video doesnt exits"
            }) 
        }
        const videoFilePath = video.filePath;
        //stream
        res.setHeader('Content-Type', 'video/mp4');

        // Set cache control headers to prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        const videoStream = fs.createReadStream(videoFilePath);
        videoStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving video' });
    }
    

}

module.exports = {
  uploadVideo,
  getVideo
};
