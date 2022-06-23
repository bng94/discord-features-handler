const path = require("path");
module.exports = (client) => {

  /**
   * Takes in an interaction  object if its a slash command
   * @param {Interaction} interaction [Discord Interaction Object](https://discord.js.org/#/docs/discord.js/stable/class/Interaction)
   * @param {User} interaction.user User which sent this interaction
   * @param {TextBasedChannels} interaction.channel The channel which this interaction was sent
   * @param {Guild} interaction.guild The guild which this interaction was sent
   * @param {GuildMember} interaction.member The guild member which sent this interaction was sent
   * or
   * Takes in an message object if its a regular command
   * @param {message} message [Discord Message Object](https://discord.js.org/#/docs/discord.js/stable/class/Message)
   * @param {User} message.author User of the person who sent the message
   * @param {TextBasedChannels} message.channel Channel which the message was sent
   * @param {Guild} message.guild Guild which the message was sent
   * @param {GuildMember} message.member Guild member, the person who sent the message
   * @returns permLevel The permission level of the user
   */

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
   * @param {command} command refer to command properties documentation
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
  client.loadCommand = (
    file,
    folder,
    loadingMsg = false,
    handler = false,
    defaultCommands = false
  ) => {
    try {
      const command = !defaultCommands
        ? require(path.join(
            client.dfhSettings.mainDirectory,
            client.dfhSettings.commandDir,
            folder,
            file
          ))
        : require(`../commands/${folder}/${file}`);
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
        if (handler) {
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

  /**
   * 
   * @param {string} commandName name of the command to unload
   * @param {string} folderName folder name where the command is located in
   * @returns {String} result of what happen when attempt to unload the command
   */
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
      require.resolve(
        path.join(
          client.dfhSettings.mainDirectory,
          client.dfhSettings.commandDir,
          folderName,
          commandName,
          ".js"
        )
      )
    ];

    return false;
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // <String>.toProperCase() returns a proper-cased string such as:
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
