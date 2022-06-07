module.exports = {
  name: "messageCreate",
  execute(message, client) {
    const prefix = client.config.prefix;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const cmd =
      client.commands.get(command) ||
      client.commands.get(client.aliases.get(command));
    const level = client.getPermissionsLevel(message);
    if (!cmd) return;
    console.log(`[CMD]`, `[${message.author.tag}]`, `${message.content}`);

    if (cmd.guildOnly && message.channel.type === "DM") {
      return message.reply("I can't execute that command inside DMs!");
    }

    const cmdPermissions = isNaN(cmd.permissions)
      ? client.levelCache[cmd.permissions]
      : cmd.permissions;

    if (level < cmdPermissions) {
      if (cmdPermissions > 7 && client.config.hideDeniedBotAdminCommandsUsage) {
        return console.log(
          `[CMD DENIED]`,
          `${message.content}`,
          `${message.author.tag}`
        );
      }
      return message.channel
        .send(`You do not have permission to use this command.
    Your permission level is ${level} (${
        client.config.permissions.find((l) => l.level === level).name
      })
    This command requires level ${
      client.config.permissions.find((l) => l.level === cmd.permissions).name
    }} (${cmd.permissions})`);
    }

    //Check if cmd usage does NOT meet the usage criteria then return
    if (
      ((!cmd.maxArgs || cmd.maxArgs === -1) && args.length < cmd.minArgs) ||
      (cmd.maxArgs &&
        cmd.maxArgs != -1 &&
        (args.length < cmd.minArgs || args.length > cmd.maxArgs))
    ) {
      return message.channel.send(
        `Incorrect syntax usage! ${prefix}${command} ${cmd.usage}`
      );
    }

    
    try {
      cmd.execute(message, args, client, level);
    } catch (e) {
      console.error(e, `Executing CMD: ${cmd.name}`);
      message.reply("There was an error trying to execute that command!");
    }
  },
};
