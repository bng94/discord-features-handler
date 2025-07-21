const fs = require("fs");
const path = require("path");

module.exports = ({
  client,
  directory = ["../events"],
  filesToExclude = [],
  mainDirectory,
  logger,
}) => {
  const loadEvents = (dir) => {
    const builtInDirectory = dir.includes("../events");
    const baseDir = builtInDirectory ? __dirname : mainDirectory;
    const dirPath = path.join(baseDir, dir);

    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.lstatSync(fullPath);

      if (stat.isDirectory()) {
        loadEvents(path.join(dir, file));
        continue;
      }

      if (filesToExclude.includes(file)) {
        if (logger) console.log(`[log] [Event] Excluded: ${file}`);
        continue;
      }

      const event = require(fullPath);
      const { name: eventName, once = false, execute } = event;

      if (!eventName || typeof execute !== "function") {
        console.error(
          `[Event] Invalid event file ${file}. ` +
            `Make sure it exports { name, execute, [once] }.`
        );
        continue;
      }

      const handler = (...args) => execute(...args, client);

      if (once) {
        client.once(eventName, handler);
      } else {
        client.on(eventName, handler);
      }

      if (logger) console.log(`[log] [Event] Loaded: ${file}`);
    }
  };

  for (const dir of directory) {
    loadEvents(dir);
  }
};
