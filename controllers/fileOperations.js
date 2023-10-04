const fs = require("fs");

const path = require('path');

function createFile(folderName, fileName, content) {
  try {
    const folderPath = path.join(__dirname, "..", folderName);;
    const filePath = path.join(folderPath, fileName);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      throw new Error(`File "${filePath}" already exists. Cannot overwrite.`);
    }

    // Create the file
    fs.writeFileSync(filePath, content);
    console.log(`File "${filePath}" created successfully.`);
    return filePath;
  } catch (e) {
    console.error(`Failed to create file: ${e.message}`);
    return null;
  }
};



function deleteFile(file) {
  if (!fs.existsSync(file)) {
    console.log(`Failed to delete file: ${file}`);
  } else {
    fs.unlinkSync(file);
  }
}

module.exports = {
  createFile,
  deleteFile,
};