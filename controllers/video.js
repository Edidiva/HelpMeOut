const openai = require("../openai");
const fs = require("fs");
const path = require("path");
const VideoModel = require("../model/newVideoModel");

async function transcribeAudio(audioInput, Id) {
  try {
    if (!fs.existsSync(audioInput)) {
      console.log(`Audio input ${audioInput} notfound`);
      return;
    }
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioInput),
      model: "whisper-1",
    });

    // update transcript in db
    const videoExists = await VideoModel.findOne({
      videoId: Id,
    });

    if (videoExists) {
      const filter = { videoId: Id };
      const update = { transcript: transcript?.text };
      await VideoModel.findOneAndUpdate(filter, update);
      console.log("Transcribing done. \n");
    } else {
      console.log("Failed updating transcript, Video dont exists.");
    }
  } catch (e) {
    console.log(`Error Transcribing Audio to Text: ${e}`);
  }
}


async function ProcessingVideos(Id) {
  const input = path.join(__dirname, "..", "videos_uploads", `${Id}.webm`);

  if (!fs.existsSync(input)) {
    console.log("file does not exist", { input });
    return;
  }
  // generate transcript
  await transcribeAudio(input, Id);
}

module.exports = {
  transcribeAudio,
  ProcessingVideos,
};
