const fs = require("fs");
const path = require("path");

module.exports = (
  client,
  directory = ["../events"],
  filesToExclude = [],
  mainPath
) => {
  const loadEvents = (dir) => {
    const builtInDirectory = dir.includes("../events")
    const dirname = builtInDirectory ? __dirname : mainPath;
    const files = fs.readdirSync(path.join(dirname, dir));
    let counter = 0;
    for (const file of files) {
      const stat = fs.lstatSync(path.join(dirname, dir, file));
      if (stat.isDirectory()) {
        loadEvents(path.join(dir, file));
      } else if (filesToExclude.includes(file) === false) {
        const event = require(path.join(dirname, dir, file));
        const eventName = event.name ? event.name : path.basename(file, ".js");
        if (!eventName) continue;
        try {
          if (event.once) {
            client.once(
              eventName,
              async (...args) => await event.execute(...args, client)
            );
          } else {
            client.on(
              eventName,
              async (...args) => await event.execute(...args, client)
            );
          }
          counter++;
        } catch (e) {
          console.log(`Unable to load event ${file}: ${e}`);
        }
      } else if(filesToExclude.includes(file)) {
        console.log(`Event File Excluded on load: ${file}`)
        return;
      }
    }
    if (builtInDirectory) return;
    console.log(`Successfully loaded ${counter} events.`, "Event");
  };
  
  const loadingEvents = directory.map((dirs) => {
    loadEvents(dirs);
  });

  Promise.all(loadingEvents);
};
