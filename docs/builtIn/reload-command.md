# Built-in Reload Command

This is the built-in reload command, that will reload your command files for you so you do not need to restart or reboot your bot for the change of your the current running command file to go into effect.

!!! info 
    However if you just add/upload a new file then you will need to restart your bot.

If you want to modify this built-in file you can disable it in DiscordFeaturesHandlerOptions and create the following reload command file

```javascript
const fs = require("fs");
const path = require("path");
const absolute = path.resolve();
module.exports = {
  name: "reload",
  description: "Reload a command!",
  aliases: [""],
  guildOnly: false,
  permissions: 8,
  minArgs: 1,
  maxArgs: 1,
  usage: "<command name>",
  async executePrefix(message, args, client) {
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
        const filePathJS = path.join(
          client.dfhSettings.mainDirectory,
          client.dfhSettings.commandDir,
          folder,
          fileName + ".js"
        );
        const filePathTS = path.join(
          client.dfhSettings.mainDirectory,
          client.dfhSettings.commandDir,
          folder,
          fileName + ".ts"
        );
        if (fs.existsSync(filePathJS) || fs.existsSync(filePathTS)) {
          return folder;
        }
      })
      .join("");
    let response = await client.unloadCommand(fileName, folderName);
    if (response) return message.reply(`Error Unloading: ${response}`);

    response = client.loadCommand({
      file: fileName,
      folder: folderName,
      loadingMsg: true,
    });
    if (response) return message.reply(`Error Loading: ${response}`);
    message.reply(`The command \`${commandName}\` has been reloaded`);
  },
};
```