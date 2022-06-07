const fs = require("fs");
const path = require("path");

module.exports = (
  client,
  directory = ["../commands"],
  filesToExclude = [""],
  mainDirectory
) => {
  const loadCommands = (dir) => {
    const dirname = dir.includes("../commands/") ? __dirname : mainDirectory;
    const commandFolders = fs.readdirSync(path.join(dirname, dir));
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(dirname, dir, folder))
        .filter((file) => file.endsWith(".js"));

      if (!dir.includes("../commands"))
        console.log(
          "[CMD]",
          ` Loading a total of ${commandFiles.length} commands from ${folder} folder.`
        );
      commandFiles.forEach((file) => {
        if (filesToExclude.includes(file)) return;
        result = client.loadCommand(file, folder, dirname === mainDirectory);
        if (result) console.log(result);
      });
    }
  };
  for (const dirs of directory) {
    loadCommands(dirs);
  }
};
