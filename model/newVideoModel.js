const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
  uniqueFilename: { type: String, required: true },
  transcript: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const VideoModel = mongoose.model("VideoModel", videoSchema);

module.exports = VideoModel;
