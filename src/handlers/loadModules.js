const path = require("path");
const fs = require("fs");

module.exports = (
  client,
  directory = ["../modules"],
  filesToExclude = [],
  mainDirectory
) => {
  const loadModules = async (dir) => {
    const builtInDirectory = dir.includes("../modules")
    const dirname = builtInDirectory ? __dirname : mainDirectory;
    const files = fs.readdirSync(path.join(dirname, dir));

    if (!builtInDirectory) {
      console.log(
        "[CMD]",
        ` Loading a total of ${files.length} modules in folder.`
      );
    }

    
    const mapping = files.map((file) => {
      const stat = fs.lstatSync(path.join(dirname, dir, file));
      console.log(file);
      if (stat.isDirectory()) {
        loadModules(path.join(dir, file));
      } else if (filesToExclude.includes(file) === false) {
        const feature = require(path.join(dirname, dir, file));
        if (!builtInDirectory) {
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
    })

    Promise.all(mapping).then(()=> {
      if (!builtInDirectory) console.log(`Modules Files Loaded`)
    })

  };

  const loadingModules = directory.map(async (dirs) => {
    await loadModules(dirs);
  });

  Promise.all(loadingModules);
};
