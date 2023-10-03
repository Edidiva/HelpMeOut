
const VideoModel = require("../model/newVideoModel");
const { processVideos } = require("../agenda");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
const { createFile, deleteFile } = require("./fileOperations");
dotenv.config()

const streamVideo = async (req, res) => {
  try {
    const { buffer: blobBuffer } = req?.files?.["blob"]?.[0] || {};
    const videoId = req?.body?.videoId;

    if (!blobBuffer || !videoId) {
      console.log(`Stream media payload is missing.`);
      return res.status(400).json({ message: "Media payload is missing." });
    }

    const videoExists = await VideoModel.findOne({ videoId: videoId });

    if (!videoExists) {
      await VideoModel.create({ videoId: videoId });
    }

    const fileName = `${videoId}.webm`;
    const fileDir = `${process.cwd()}/videos_uploads`;
    const videoPath = `${fileDir}/${fileName}`;

    // create file
    if (!fs.existsSync(videoPath)) {
      createFile(fileDir, fileName, "");
    }

    const videoStream = fs.createWriteStream(videoPath);
    videoStream.write(blobBuffer);

    console.info(`Streaming chunks...`);

    res.status(200).json({ message: "Video processing in the background." });
  } catch (error) {
    console.error(`Error saving video: ${error.message}`);
    res.status(500).json({ message: "Something went wrong." });
  }
};


async function endStream(req, res) {
  try {
    const videoId = req.params["videoId"];
    if (typeof videoId === "undefined") {
      return res.status(400).json({ message: "video id not present?" });
    }

    // check if videoId exists
    const video = await VideoModel.findOne({ videoId: videoId });

    if (video === null) {
      res.status(404).json({ message: "Failed to end stream, media not found." });
      return;
    }

    const fileName = `${videoId}.webm`;
    const fileDir = process.cwd() + "/videos_uploads";
    const videoPath = `${fileDir}/${fileName}`;

    // create file
    if (!fs.existsSync(videoPath)) {
      createFile(fileDir, fileName, "");
    }

    // call the background job
    await processVideos(videoId);

    res.status(200).json({ message: "Stream ended" });
    console.log("");
    console.log("Stream ended \n");
  } catch (error) {
    console.log(`Oops Something went wrong: ${error.message}`);
    res.status(500).json({ message: "Something went wrong." });
  }
}

async function getVideoById(req, res) {
  try {
    const {videoId}= req.params;
    if (typeof videoId === "undefined") {
      res.status(404).json({ message: "Video id is missing." });
      return;
    }

    // check if video exists
    const videoExists = await VideoModel.findOne({
      videoId: videoId,
    });

    if (!videoExists) {
      return res.status(404).json({ message: "Video not found." });
    }

    const videoPath = path.join(
      __dirname,
      "..",
      "video_uploads",
      `${videoId}.webm`
    );

    // check if this video exist on server
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ message: "Video no longer exists on server" });

      // delete from DB
      await VideoModel.deleteOne({ videoId: videoId });
      
      return;
    }

    res.status(200).json({
      message: "Video fetched successfully",
      data: {
        id: videoExists.videoId,
        videoPath: `${process.env.API_URL}/media/files/${videoExists?.videoId}.webm`,
        transcript: videoExists.transcript,
        createAt: videoExists.createdAt,
        thumbnail: videoExists.thumbnail,
      },
    });
  } catch (e) {
    console.log(`Error fetching video: ${e.message}`);
    res.status(500).json({ message: "Something went wrong" });
  }
}

const getAllVideos = async (req, res) => {
  try {
    // Check if video exists
    const allVideos = await VideoModel.find();

    const updated = allVideos?.map((video) => ({
      videoId: video?.videoId,
      video: `${process.env.API_URL}/media/files${video?.videoId}.webm`,
      createdAt: video?.createdAt,
    })) || [];

    res.status(200).json({ message: "Video fetched successfully", data: updated });
  } catch (error) {
    console.error(`Error fetching all videos: ${error.message}`);
    res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports = {
  getVideoById,
  getAllVideos,
  streamVideo,
  endStream,
};
