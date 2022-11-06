const path = require("path");
const { mkdir, unlink, copyFile, readdir } = require("fs/promises");
const fs = require("fs");

async function buildPage() {
  const pathProject = path.join(__dirname, "project-dist");
  await mkdir(pathProject, { recursive: true });

  buildHtml();
  copyFolder(
    path.join(__dirname, "assets"),
    path.join(__dirname, "project-dist", "assets"),
    true
  );
  styleBundler(
    path.join(__dirname, "styles"),
    path.join(__dirname, "project-dist"),
    "style.css"
  );
}

function buildHtml() {
  fs.readFile(
    path.join(__dirname, "template.html"),
    "utf8",
    function (err, data) {
      if (err) {
        throw err;
      }

      const template = data;

      const indexStartTemplateTag = template.search(/{{/gm);
      const indexEndTemplateTag = template.search(/}}/gm) + 2;
      if (indexStartTemplateTag !== -1) {
        const nameComponent = template.slice(
          indexStartTemplateTag,
          indexEndTemplateTag
        );
        addComponent(template, nameComponent);
      }
    }
  );
}

function addComponent(template, nameComponent) {
  const nameFileComponent = nameComponent.slice(2, -2) + ".html";
  fs.readFile(
    path.join(__dirname, "components", nameFileComponent),
    "utf8",
    function (err, data) {
      if (err) {
        throw err;
      }
      template = template.replace(nameComponent, data);

      const indexStartTemplateTag = template.search(/{{/gm);
      const indexEndTemplateTag = template.search(/}}/gm) + 2;
      if (indexStartTemplateTag !== -1) {
        const nameComponent = template.slice(
          indexStartTemplateTag,
          indexEndTemplateTag
        );

        addComponent(template, nameComponent);
      } else {
        fs.writeFile(
          path.join(__dirname, "project-dist", "index.html"),
          template,
          (err) => {
            if (err) throw err;
          }
        );
      }
    }
  );
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

buildPage();
