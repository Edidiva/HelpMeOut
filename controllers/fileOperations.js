const fs = require("fs");

function createFile( fileName, content, destination,) {
  try {
    if (!fs.existsSync(destination)) {
      console.error(`failed to create file, destination path doesn't exists.`);
      return false;
    }
    const file = `${dest_path}/${fileName}`;
    fs.writeFileSync(file, content);
    return true;
  } catch (e) {
    console.error(`failed to create file: ${e.message}`);
    return false;
  }
}

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