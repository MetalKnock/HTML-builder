const { stdin, stdout } = process;
const fs = require("fs");
const path = require("path");

const pathNotes = path.join(__dirname, "notes.txt");
const output = fs.createWriteStream(pathNotes);

fs.writeFile(pathNotes, "", (err) => {
  if (err) throw err;
});

stdout.write("Enter text:\n");
stdin.on("data", (data) => {
  if (data.toString().slice(0, -2) === "exit") {
    process.exit();
  }
  output.write(data);
});

process.on("SIGINT", () => {
  process.exit();
});
process.on("exit", () => stdout.write("Bye-bye"));
