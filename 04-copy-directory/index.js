const path = require("path");
const { mkdir, unlink, copyFile, readdir } = require("fs/promises");

const pathFiles = path.join(__dirname, "files");
const pathFilesCopy = path.join(__dirname, "files-copy");

async function clearFolder(destinationFolderPath) {
  await mkdir(destinationFolderPath, { recursive: true });
  const filesCopy = await readdir(destinationFolderPath, {
    withFileTypes: true,
  });
  for (const file of filesCopy) {
    if (file.isFile()) {
      await unlink(path.join(destinationFolderPath, file.name));
    } else {
      clearFolder(path.join(destinationFolderPath, file.name));
    }
  }
}

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
    await clearFolder(destinationFolderPath);
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
