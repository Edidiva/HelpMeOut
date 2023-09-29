const Video = require('../model/videoModel');
const mongoose = require('mongoose');
const fs = require('fs');

// Controller function to handle video upload
async function uploadVideo(req, res) {
  try {
    const videoPath = req.file.path;
    const uniqueFilename = req.file.filename; 
    const newVideo = new Video({
      title: req.body.title,
      filePath: videoPath,
      filename: uniqueFilename
    });

    await newVideo.save();

    res.status(200).json({ 
    message: 'Video uploaded successfully',
    videoId: newVideo._id,
    filename: uniqueFilename, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading video' });
  }
}

async function getVideoById(req, res){
    try {
        const { Id } = req.params; // Get the ID from request parameters
        
        if (!mongoose.Types.ObjectId.isValid(Id)) {
            return res.status(400).json({
                error: 'Invalid ID format',
            });
        };

        const video = await Video.findById({ _id:Id });
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
    

};

async function getVideoByUniqueName(req, res){
    try {
        const { uniqueName } = req.query; 
        

        const video = await Video.findOne({ filename: uniqueName });
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
    
};


async function getAllVideo(req, res){
    const video = await Video.find();
    res.status(200).json(
        {
            message: "Videos found succesfully ",
            data: video
        }
    )
}

module.exports = {
  uploadVideo,
  getVideoById,
  getVideoByUniqueName,
  getAllVideo
};
