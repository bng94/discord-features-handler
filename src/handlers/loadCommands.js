const fs = require("fs");
const path = require("path");

module.exports = (
  client,
  directory = ["../commands/"],
  filesToExclude = [""],
  mainDirectory,
  loggerOff
) => {
  const loadCommands = (dir) => {
    const builtInDirectory = dir.includes("../commands/");
    const dirname = builtInDirectory ? __dirname : mainDirectory;
    const commandFolders = fs.readdirSync(path.join(dirname, dir));
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(dirname, dir, folder))
        .filter((file) => file.endsWith(".js"));

      if (!builtInDirectory) {
        console.log(
          "[log]",
          "[CMD]",
          ` Loading a total of ${commandFiles.length} commands from ${folder} folder.`
        );
      }
      commandFiles.forEach((file) => {
        if (filesToExclude.includes(file)) {
          console.log(`Command File Excluded: ${file}`);
          return;
        }
        result = client.loadCommand(
          file,
          folder,
          !loggerOff,
          true,
          dirname !== mainDirectory
        );
        if (result) console.log(result);
      });
    }
  };
  const loadingCommands = directory.map((dirs) => {
    loadCommands(dirs);
  });

  Promise.all(loadingCommands);
};
