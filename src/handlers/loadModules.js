const path = require("path");
const fs = require("fs");

module.exports = (
  client,
  directory = ["../modules"],
  filesToExclude = [],
  mainDirectory
) => {
  const loadModules = async (dir) => {
    const dirname = dir.includes("../modules") ? __dirname : mainDirectory;
    const files = fs.readdirSync(path.join(dirname, dir));

    if (!dir.includes("../modules")) {
      console.log(
        "[CMD]",
        ` Loading a total of ${files.length} modules in folder.`
      );
    }

    for (const file of files) {
      const stat = fs.lstatSync(path.join(dirname, dir, file));
      if (stat.isDirectory()) {
        loadModules(path.join(dir, file));
      } else if (filesToExclude.includes(file) === false) {
        const feature = require(path.join(dirname, dir, file));
        if (!dir.includes("../modules")) {
          console.log(`Loading module file: ${file}`);
        }
        try {
          await feature(client);
        } catch (e) {
          console.error(`Failed to Load ${file}: ${e}`);
        }
      } else if (filesToExclude.includes(file)) {
        console.log(`Modules File Excluded on load: ${file}`);
        return;
      }
    }
  };

  const loadingModules = directory.map(async (dirs) => {
    await loadModules(dirs);
  });

  Promise.all(loadingModules).then(() => {
    console.log("Finished loading all modules");
  });
};
