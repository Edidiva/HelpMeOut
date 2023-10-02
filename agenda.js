// agenda.js
const Agenda = require('agenda');
const { appendChunksToFile } = require('./controllers/fileOperations');
const dotenv = require('dotenv');
dotenv.config();

const agenda = new Agenda({ db: { address: process.env.MONGODB_CONNECTION_URL } });

agenda.on('ready', () => {
  agenda.define('processVideoChunks', async job => {
    const { videoChunks, videoFileName } = job.attrs.data;

    appendChunksToFile(videoFileName, videoChunks);

    if (job.attrs.data.isFinalChunk) {
      // Perform additional processing for the final chunk
      console.log('All chunks received. Start transcription or other processing.');
    }
  });
});

function startAgenda() {
  agenda.start();
  console.log('Agenda is processing jobs');
}

async function scheduleVideoProcessingJob(videoChunk, isFinalChunk) {
  const jobData = {
    videoChunks: [videoChunk],
    videoFileName: 'video.mp4',
    isFinalChunk,
  };

  await agenda.schedule('in 1 second', 'processVideoChunks', jobData);
}

module.exports = { startAgenda, scheduleVideoProcessingJob };
