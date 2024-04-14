const {
  TextChannel,
  Guild,
  GuildMember,
  User,
  Collection,
} = require("discord.js");
const path = require("path");
/**
 *
 * @param {object} cmd refer to command properties documentation
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
  } else if (isNaN(cmd.minArgs)) {
    error += `\n- MinArgs must be a Number!`;
  }

  if (typeof cmd.usage === "undefined") {
    error += `\n- Command Usage is Missing!`;
  }

  if (typeof cmd.description === "undefined") {
    error += `\n- Description is Missing!`;
  }
  return error;
};

const configureClient = (client, config, directories) => {
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
