# Built-in MessageCreate Event

This event file essentially handles your command, check the permission level set, and arguments set for you. Once it pass the requirements you set it will execute the command.

This is the built-in MessageCreate event that you can disable in DiscordFeaturesHandlerOptions and then can use to tailor to your bot if desired.

!!! note "Using v3.1.0 or later and you decided to disable the built-in MessageCreate"
    Please use `executePrefix` property instead of `execute` property for running prefix commands to avoid any conflicts in future.

```javascript
const { ChannelType, Events } = require("discord.js");
module.exports = {
  name: Events.MessageCreate,
  execute(message, client) {
    const configPrefix = client.config.prefix;
    if (message.author.bot) return;

    if (
      (typeof configPrefix === "string" &&
        !message.content.startsWith(configPrefix)) ||
      (Array.isArray(configPrefix) &&
        !configPrefix.some((prefix) => message.content.startsWith(prefix)))
    ) {
      // if no prefix found; you can create your own logic here for handling messages without a prefix
      return;
    }
    
    const prefix = Array.isArray(configPrefix)
      ? configPrefix.find((prefix) => message.content.startsWith(prefix))
      : configPrefix;

    if (!prefix) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    const cmd =
      client.commands.get(command) ||
      client.commands.get(client.aliases.get(command));
    const level = client.getPermissionsLevel({
      author: message.author,
      channel: message.channel,
      guild: message.guild,
      guildMember: message.member,
    });
    if (!cmd) return;
    console.log(`[CMD]`, `[${message.author.tag}]`, `${message.content}`);

    if (cmd.guildOnly && message.channel.type === ChannelType.DM) {
      return message.reply("I can't execute that command inside DMs!");
    }

    const cmdPermissions = isNaN(cmd.permissions)
      ? client.levelCache[cmd.permissions]
      : cmd.permissions;

    if (level < cmdPermissions) {
      if (
        cmdPermissions > 7 &&
        client.config.displayAdminCommandCallsByNonAdmin
      ) {
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
      return cmd.executePrefix(message, args, client, level);
    } catch (e) {
      console.error(e, `Executing CMD: ${cmd.name}`);
      message.reply("There was an error trying to execute that command!");
    }
  },
};

```
