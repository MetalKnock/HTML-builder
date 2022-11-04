const path = require("path");
const { mkdir, unlink, copyFile, readdir } = require("fs/promises");

const pathFiles = path.join(__dirname, "files");
const pathFilesCopy = path.join(__dirname, "files-copy");

async function copyFolder(
  folderPath,
  destinationFolderPath,
  firstCall = false,
  newFolder = false
) {
  if (newFolder) {
    await mkdir(destinationFolderPath, { recursive: true });
  }
  if (firstCall) {
    await mkdir(destinationFolderPath, { recursive: true });
    const filesCopy = await readdir(destinationFolderPath);
    for (const file of filesCopy) {
      await unlink(path.join(destinationFolderPath, file));
    }
  }

  const files = await readdir(folderPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      await copyFile(
        path.join(folderPath, file.name),
        path.join(destinationFolderPath, file.name)
      );
    } else {
      copyFolder(
        path.join(folderPath, file.name),
        path.join(destinationFolderPath, file.name),
        false,
        true
      );
    }
  }
}
copyFolder(pathFiles, pathFilesCopy, true);
