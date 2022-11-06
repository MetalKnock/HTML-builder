const path = require("path");
const fs = require("fs");
const { readdir, unlink } = require("fs/promises");

async function styleBundler(pathStyles, pathBundle, nameBundle) {
  const filesProjectDist = await readdir(pathBundle, { withFileTypes: true });
  for (const file of filesProjectDist) {
    if (file.isFile()) {
      if (file.name === nameBundle) {
        await unlink(path.join(pathBundle, nameBundle));
      }
    }
  }

  const filesStyles = await readdir(pathStyles, { withFileTypes: true });
  const output = fs.createWriteStream(path.join(pathBundle, nameBundle));
  for (const file of filesStyles) {
    if (file.isFile()) {
      const extension = file.name.split(".")[file.name.split(".").length - 1];
      if (extension === "css") {
        const stream = fs.createReadStream(
          path.join(pathStyles, file.name),
          "utf-8"
        );
        stream.on("data", (chunk) => output.write(`${chunk}\n`));
        stream.on("error", (error) => console.log("Error", error.message));
      }
    }
  }
}

styleBundler(
  path.join(__dirname, "styles"),
  path.join(__dirname, "project-dist"),
  "bundle.css"
);
