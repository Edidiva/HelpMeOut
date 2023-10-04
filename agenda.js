// agenda.js
const Agenda = require('agenda');
const { ProcessingVideos } = require('./controllers/video');
const dotenv = require('dotenv');

dotenv.config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_CONNECTION_URL,
  },
});

agenda.define(
  'process_video',
  { concurrency: 10, priority: 'high' },
  async (job) => {
    try {
      const { Id } = job.attrs.data;
      await ProcessingVideos( Id);
    } catch (error) {
      console.error(error);
      console.error(`Error processing recorded video. ${error.message}`);
    }
  }
);

const processVideos = async (Id) => {
  try {
    agenda.on('complete', (job) => {
      console.log(`Job ${job.attrs.name} completed`);
    });

    await agenda.start();
    await agenda.now('process_video', {
      Id,
    });

    console.log('\nVIDEO PROCESSING IN BG. \n');
  } catch (error) {
    console.error(error);
  }};

agenda.on('start', (job) => {
  console.log(`Job ${job.attrs.name} starting`);
});

module.exports = {
  processVideos,
};
