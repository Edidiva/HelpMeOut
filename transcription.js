
// transcription.js
const axios = require('axios');
const openai = require('./openai');

async function transcribeWithWhisper(videoFileName) {
  const apiUrl = 'https://api.whisper.ai/v1/transcribe';

  try {
    const response = await axios.post(apiUrl, {
      audio: {
        source_type: 'file',
        source_file: videoFileName,
      },
    }, {
      headers: {
        'Authorization': `Bearer ${openai.apiKey}`,
      },

      
    });

    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error in transcribing with Whisper:', error.message);
    throw error;
  }
}

module.exports = { transcribeWithWhisper };

 