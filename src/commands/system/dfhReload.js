const fs = require("fs");
const path = require("path");
const absolute = path.resolve();
module.exports = {
  name: "reload",
  description: "Reload a command!",
  aliases: [],
  guildOnly: false,
  permissions: 8,
  minArgs: 1,
  maxArgs: 1,
  usage: "<command name>",
  async execute(message, args, client) {
    const commandName = args[0];
    let command;

    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }

    if (!command)
      return message.channel.send(
        `The command \`${commandName}\` doesnt seem to exist, nor is it an alias. Try again!`
      );

    const fileName = command.name;
    const commandFolders = fs.readdirSync(absolute + "/commands");

    const folderName = commandFolders
      .map((folder) => {
        if (
          fs.existsSync(
            path.join(
              client.dfhSettings.mainDirectory,
              client.dfhSettings.commandDir,
              folder,
              fileName + ".js"
            )
          )
        ) {
          return folder;
        } else if (fs.existsSync(`./commands/${folder}/${fileName}.js`)) {
          return folder;
        }
      })
      .join("");
    let response = await client.unloadCommand(fileName, folderName);
    if (response) return message.reply(`Error Unloading: ${response}`);

    response = client.loadCommand(fileName, folderName, true);
    if (response) return message.reply(`Error Loading: ${response}`);
    message.reply(`The command \`${commandName}\` has been reloaded`);
  },
};
