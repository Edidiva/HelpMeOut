const fs = require('fs');
const axios = require('axios');

async function sendVideoChunks(filePath, chunkSize, apiUrl) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileSize = fileBuffer.length;

  let offset = 0;
  let chunkNumber = 1;

  while (offset < fileSize) {
    const end = Math.min(offset + chunkSize, fileSize);

    // Use Buffer.from(Uint8Array.prototype.slice.call(...)) instead of slice()
    const chunk = Buffer.from(Uint8Array.prototype.slice.call(fileBuffer, offset, end));

    console.log(`Sending Chunk ${chunkNumber}: ${chunk.length} bytes`);

    // Simulate the headers added by Postman
    const headers = {
      'Content-Type': 'multipart/form-data',  // Adjust this based on your Postman request
      // Add other headers if necessary
    };

    // Send the chunk to the server using axios with headers
    const formData = new FormData();
    formData.append('chunk', chunk);
    
    await axios.post(apiUrl, formData, { headers });

    offset += chunkSize;
    chunkNumber += 1;
  }

  console.log('Streaming complete.');
}

// Set the path to the video file and the server endpoint
const videoFilePath = './inputchunkFiles/apple.webm';
const serverApiUrl = 'http://localhost:4000/api/video/upload-chunk'; // Update with your server URL

// Set the chunk size (in bytes)
const chunkSize = 20 * 1024; // 1 MB

// Call the function to send video chunks
sendVideoChunks(videoFilePath, chunkSize, serverApiUrl);
