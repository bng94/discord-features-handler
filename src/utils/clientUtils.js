const { Collection, SlashCommandBuilder } = require("discord.js");
const path = require("path");
/**
 *
 * @param {import("..").CommandFile} cmd refer to command properties documentation
 * @returns string if an error exists
 */
const checkCommandErrors = (cmd) => {
  let error = "";
  if (typeof cmd.permissions === "undefined") {
    error += `\n- Permission level is Missing!`;
  } else if (isNaN(cmd.permissions)) {
    error += `\n- Permission level must be a Number!`;
  }

  if (typeof cmd.minArgs === "undefined") {
    error += `\n- Minimum args is Missing!`;
  } else if (
    isNaN(cmd.minArgs) ||
    (isNaN(cmd.minArgs) === false && cmd.minArgs < 0)
  ) {
    error += `\n- MinArgs must be a Number equal to 0 or greater!`;
  }

  if (cmd.maxArgs && isNaN(cmd.maxArgs)) {
    if (isNaN(cmd.maxArgs)) {
      error += `\n- maxArgs must be a number and greater then MinArgs`;
    } else if (cmd.maxArgs !== -1 && cmd.maxArgs <= cmd.minArgs) {
      error += `\n- maxArgs must be a number greater then MinArgs`;
    }
  }

  if (cmd.aliases && !Array.isArray(cmd.aliases)) {
    error += `\n- aliases must be a Array of String`;
  }

  if (cmd.customIds) {
    if (cmd.customIds.modal && !Array.isArray(cmd.customIds.modal)) {
      error += `\n- customIds for modal must be a Array of String`;
    }
    if (
      cmd.customIds.messageComponent &&
      !Array.isArray(cmd.customIds.messageComponent)
    ) {
      error += `\n- customIds for MessageComponent must be a Array of String`;
    }
    if (
      cmd.customIds.autoComplete &&
      !Array.isArray(cmd.customIds.autoComplete)
    ) {
      error += `\n- customIds for AutoComplete must be a Array of String`;
    }
  }

  if (typeof cmd.usage === "undefined") {
    error += `\n- Command Usage is Missing!`;
  }

  if (typeof cmd.description === "undefined") {
    error += `\n- Description is Missing!`;
  }
  return error;
};

/**
 *
 * @param {client} client
 * @param {import("..").Config} config
 * @param {*} directories
 * @returns {Client}
 */
const configureClient = (client, config, directories) => {
  client.levelCache = {};
  client.config = config;
  client.commands = new Collection();
  client.aliases = new Collection();
  client.dfhSettings = {
    mainDirectory: directories.main,
    commandDir: directories.commands,
  };
  client.wait = require("util").promisify(setTimeout);
  client.getPermissionsLevel = ({ author, channel, guild, guildMember }) => {
    let permLvl = 0;
    const permOrder = client.config.permissions
      .slice(0)
      .sort((p, c) => (p.level < c.level ? 1 : -1));

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (
        currentLevel.check({
          author,
          channel,
          guild,
          guildMember,
        })
      ) {
        permLvl = currentLevel.level;
        break;
      }
    }
    return permLvl;
  };

  client.loadCommand = ({
    file,
    folder,
    loadingMsg = false,
    handler = false,
    defaultCommand = false,
  }) => {
    try {
      const command = !defaultCommand
        ? require(path.join(
            client.dfhSettings.mainDirectory,
            client.dfhSettings.commandDir,
            folder,
            file
          ))
        : require(`../commands/${folder}/${file}`);
      const error = checkCommandErrors(command);
      if (error !== "") {
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

      if (loadingMsg && !defaultCommand) {
        if (handler) {
          console.log(`Loaded Command: ${file}`);
        } else {
          console.log(`Loading Command: ${file}. 👌`, "CMD");
        }
      }
      return false;
    } catch (e) {
      return `Unable to load command ${file}: \n${e}`;
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
      require.resolve(
        path.join(
          client.dfhSettings.mainDirectory,
          client.dfhSettings.commandDir,
          folderName,
          commandName + ".js"
        )
      )
    ];

    return null;
  };

  return client;
};

module.exports = { configureClient };
