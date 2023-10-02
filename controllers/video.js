
// controllers/video.js
const { scheduleVideoProcessingJob } = require('../agenda');
const { appendChunksToFile } = require('./fileOperations');
const { transcribeWithWhisper } = require('../transcription'); 
const path = require('path');
const VideoModel = require('../model/newVideoModel'); 

async function uploadVideoChunk(req, res) {
  try {
    // Check if the request has the "blob" field
    if (!req?.file["blob"]) {
      return res.status(400).json({ error: 'blob field is missing in the request.' });
    }

    // Get the blob from the request
    const blob = req.file["blob"][0];

    // Check if the request has the "isFinalblob" field
    const isFinalBlob = req.body.isFinalBlob === 'true';

    // Create a unique filename based on the original filename and current date
    const originalFilename = blob.originalname;
    const uniqueFilename = `${path.parse(originalFilename).name}_${Date.now()}.mp4`;

    // Specify the destination directory for video uploads
    const destinationDirectory = path.join(__dirname, '../video_uploads');

    // Append the video blob to the file in the specified directory
    await appendChunksToFile(path.join(destinationDirectory, uniqueFilename), [blob]);

    // Schedule job for further processing
    await scheduleVideoProcessingJob(blob, isFinalBlob);

    // Transcribe the video blob and save the transcription to the database
    const transcriptionResult = await transcribeWithWhisper(path.join(destinationDirectory, uniqueFilename));

    // Save the transcription to the database
    const newTranscription = new VideoModel({
      uniqueFilename: path.parse(uniqueFilename).name,
      transcript: transcriptionResult.transcription,
    });

    await newTranscription.save();

    res.json({ 
      message: 'Video blob received successfully.',
      uniqueFilename: path.parse(uniqueFilename).name, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  uploadVideoChunk,
};
