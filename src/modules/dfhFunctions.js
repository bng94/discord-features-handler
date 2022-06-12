module.exports = (client) => {
  client.getPermissionsLevel = ({ author, user, channel, guild, member }) => {
    let permLvl = 0;
    const currentUser = author || user;
    const permOrder = client.config.permissions
      .slice(0)
      .sort((p, c) => (p.level < c.level ? 1 : -1));

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (currentLevel.check(currentUser, channel, guild, member)) {
        permLvl = currentLevel.level;
        break;
      }
    }
    return permLvl;
  };

  /**
   * 
   * @param {command properties} command // refer to command properties documentation
   * @returns string if an error exists
   */
  const checkCommandErrors = (command) => {
    let error = "";
    if (typeof command.permissions === "undefined") {
      error += `\n- Permission level is Missing!`;
    } else if (isNaN(command.permissions)) {
      error += `\n- Permission level must be a Number!`;
    }

    if (typeof command.minArgs === "undefined") {
      error += `\n- Minimum args is Missing!`;
    } else if (isNaN(command.minArgs)) {
      error += `\n- MinArgs must be a Number!`;
    }

    if (typeof command.usage === "undefined") {
      error += `\n- Command Usage is Missing!`;
    }

    if (typeof command.description === "undefined") {
      error += `\n- Description is Missing!`;
    }
    return error;
  };

  /**
   * 
   * @param {string} file name of the file
   * @param {string} folder name of the folder that contains the file
   * @param {boolean} loadingMsg if we should display loading msg or not
   * @param {boolean} handler  if this is invoked in the handler
   * @param {boolean} defaultCommands  if the filename is a built-in command
   * @returns false is commands are loaded, otherwise log error msg
   */
  client.loadCommand = (file, folder, loadingMsg = false, handler = false, defaultCommands = false) => {
    try {
      const command = !defaultCommands
        ? require(`${client.dfhSettings.mainDirectory}\\${client.dfhSettings.commandDir}\\${folder}\\${file}`)
        : require(`../commands/${folder}/${file}`);;
      const error = checkCommandErrors(command);
      if (error != "") {
        const placeHolder = `\nRequired:`;
        throw placeHolder + error;
      }
      /**
       * *in each cmd file,
       * *defines their category as folderName that contains the cmd file
       */
      command.category = folder.toProperCase();
      client.commands.set(command.name, command);

      //requires a permission level set; best to have an permission level set to prevent unauthorized usage of a command.

      if (command.aliases) {
        command.aliases.forEach((alias) => {
          client.aliases.set(alias, command.name);
        });
      }

      if (loadingMsg && !defaultCommands) {
        if(handler) {
          console.log(`Loaded Command: ${file}`);
        } else {
          console.log(`Loading Command: ${file}. 👌`, "CMD");
        }
      }
      return false;
    } catch (e) {
      return `Unable to load command ${file}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName, folderName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command)
      return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[
      require.resolve(`${client.dfhSettings.mainDirectory}\\${client.dfhSettings.commandDir}\\${folderName}\\${commandName}.js`)
    ];
    
    return false;
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // <String>.toPropercase() returns a proper-cased string such as:
  // "A quick brown fox jumps the lazy dog".toProperCase()
  // returns "A Quick Brown Fox Jumps The Lazy Dog"
  String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  process.on("unhandledRejection", (e) => {
    console.log(e);
  });
};
