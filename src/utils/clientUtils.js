const { Collection, SlashCommandBuilder } = require("discord.js");
const path = require("path");
/**
 *
 * @param {import("..").CommandFile} cmd refer to command properties documentation
 * @returns string if an error exists
 */
const checkCommandErrors = (cmd) => {
  let error = "";
  if (cmd.permissions !== undefined && typeof cmd.permissions !== "number") {
    error += `\n- Permission level must be a Number!`;
  }
  if (cmd.minArgs !== undefined && typeof cmd.minArgs !== "number") {
    error += `\n- MinArgs must be a Number!`;
  }
  if (typeof cmd.minArgs === "number" && cmd.minArgs < 0) {
    error += `\n- MinArgs must be a Number equal to 0 or greater!`;
  }

  if (typeof cmd.maxArgs === "number") {
    const minArgs = cmd.minArgs || 0;
    if (cmd.maxArgs !== 0 && cmd.maxArgs <= minArgs) {
      error += `\n- maxArgs must be a number greater then MinArgs`;
    }
  }

  if (cmd.aliases && !Array.isArray(cmd.aliases)) {
    error += `\n- aliases must be a Array of String`;
  }

  if (cmd.customIds) {
    if (
      !Array.isArray(cmd.customIds) &&
      (typeof cmd.customIds !== "object" || cmd.customIds === null)
    ) {
      error += `\n- customIds must be an Array of String or an object of [k:string]: string`;
    } else if (cmd.customIds.length < 1) {
      error += `\n- customIds must contain at least one String`;
    }
  }

  if (cmd.usage && typeof cmd.usage !== "string") {
    error += `\n- Command Usage is  not a String!`;
  }

  if (cmd.data && !(cmd.data instanceof SlashCommandBuilder)) {
    error += `\n- Command Data is not a SlashCommandBuilder instance!`;
  } else if (cmd.data && cmd.data instanceof SlashCommandBuilder) {
    if (
      (!cmd.executePrefix &&
        (!cmd.interactionReply ||
          typeof cmd.interactionReply !== "function")) ||
      (cmd.executePrefix && (!cmd.execute || typeof cmd.execute !== "function"))
    ) {
      error += `\n- Command must have either an execute property function for slash commands!`;
    }
  }

  if (
    !cmd.data &&
    !(
      (cmd.execute && typeof cmd.execute === "function") ||
      (cmd.executePrefix && typeof cmd.executePrefix === "function")
    )
  ) {
    error += `\n- Command must have either a executePrefix property function for prefix commands!`;
  }

  if (!cmd.name && !(cmd.data && cmd.data.name)) {
    error += `\n- Command Name is Missing!`;
  }
  if (
    cmd.name &&
    typeof cmd.name !== "string" &&
    !(cmd.data && cmd.data.name)
  ) {
    error += `\n- Command Name is not a String!`;
  }

  if (!cmd.description && !(cmd.data && cmd.data.description)) {
    error += `\n- Command Description is Missing!`;
  }
  if (
    cmd.description &&
    typeof cmd.description !== "string" &&
    !(cmd.data && cmd.data.description)
  ) {
    error += `\n- Command Description is not a String!`;
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

      if (!command.minArgs) {
        command.minArgs = 0;
      }
      if (!command.permissions) {
        command.permissions = 0;
      }
      if (!command.aliases) {
        command.aliases = [];
      }
      if (!command.usage) {
        command.usage = "";
      }

      const commandName = command.name || command.data.name;

      /**
       * *in each cmd file,
       * *defines their category as folderName that contains the cmd file
       */
      command.category = folder.toProperCase();
      client.commands.set(commandName, command);

      //requires a permission level set; best to have an permission level set to prevent unauthorized usage of a command.

      if (command.aliases) {
        command.aliases.forEach((alias) => {
          client.aliases.set(alias, commandName);
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
