const path = require("path");
const fs = require("fs");

module.exports = (
  client,
  directory = ["../modules"],
  filesToExclude = [],
  mainDirectory,
  loggerOff
) => {
  const loadModules = async (dir) => {
    const builtInDirectory = dir.includes("../modules");
    const dirname = builtInDirectory ? __dirname : mainDirectory;
    const files = fs.readdirSync(path.join(dirname, dir));

    if (!builtInDirectory) {
      console.log(
        "[log]",
        "[Modules]",
        `Loading a total of ${files.length} modules in folder.`
      );
    }

    const filesExcluded = [];

    const mapping = files.map(async (file) => {
      const stat = fs.lstatSync(path.join(dirname, dir, file));
      if (stat.isDirectory()) {
        loadModules(path.join(dir, file));
      } else if (filesToExclude.includes(file) === false) {
        const feature = require(path.join(dirname, dir, file));
        if (!builtInDirectory && !loggerOff) {
          console.log(`Loading module file: ${file}`);
        }
        try {
          await feature(client);
        } catch (e) {
          console.error(`Failed to Load ${file}: ${e}`);
        }
      } else if (filesToExclude.includes(file)) {
        filesExcluded.push(file);
        return;
      }
    });

    Promise.all(mapping).then(() => {
      if (!builtInDirectory) {
        if(filesExcluded){
          console.log(`Modules Files Excluded on load:`);
          console.log("[Files]", filesExcluded.join(', '))
        }
        console.log(`Modules Files Loaded`);
      }
    });
  };

  const loadingModules = directory.map(async (dirs) => {
    await loadModules(dirs);
  });

  Promise.all(loadingModules);
};
