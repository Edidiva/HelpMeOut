const fs = require('fs');

async function appendChunksToFile(videoFileName, blob) {
  try {
    
    // Create a writable stream for the file in 'a' (append) mode
    const fileStream = fs.createWriteStream(videoFileName, { flags: 'a' });

    // Convert each chunk to a Buffer and write it to the stream
    for (const blob of blob) {
      const buffer = Buffer.from(blob);
      fileStream.write(buffer);
    }

    // Close the writable stream
    fileStream.end();
    
    // Wait for the stream to finish (optional)
    await new Promise(resolve => fileStream.on('finish', resolve));
  } catch (error) {
    console.error('Error appending chunks to file:', error.message);
    throw error;
  }
}

module.exports = { appendChunksToFile };
