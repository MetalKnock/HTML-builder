const path = require("path");
const { readdir, stat } = require("fs/promises");

const pathSecretFolder = path.join(__dirname, "secret-folder");

async function list() {
  const files = await readdir(pathSecretFolder, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const pathFile = path.join(pathSecretFolder, file.name);
      const lastIndexDot = file.name.lastIndexOf(".");
      const fileName = file.name.slice(0, lastIndexDot);
      const fileExtension = path.extname(file.name).slice(1);

      const stats = await stat(pathFile);
      const sizeBytes = Number(stats.size);
      const sizeKilobytes = sizeBytes / 1024;
      const fileWeight = sizeKilobytes + "kb";

      console.log(`${fileName} - ${fileExtension} - ${fileWeight}`);
    }
  }
}

list();
