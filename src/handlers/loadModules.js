const path = require("path");
const fs = require("fs");

module.exports = (client, directory =["../modules"], filesToExclude = [], mainDirectory) => {
  const loadModules = (dir) => {

    const dirname = dir.includes("../modules") ? __dirname : mainDirectory;
    const files = fs.readdirSync(path.join(dirname, dir));

    for (const file of files) {
      const stat = fs.lstatSync(path.join(dirname, dir, file));
      if (stat.isDirectory()) {
        loadModules(path.join(dir, file));
      } else if (filesToExclude.includes(file) === false) {
        const feature = require(path.join(dirname, dir, file));
        try {
          feature(client);
        } catch (e) {
          console.error(`Failed to Load ${file}: ${e}`);
        }
      } else if(filesToExclude.includes(file)) {
        console.log(`Modules File Excluded on load: ${file}`)
        return;
      }
    }
  };
  for(const dirs of directory) {
    loadModules(dirs);
  }
};
