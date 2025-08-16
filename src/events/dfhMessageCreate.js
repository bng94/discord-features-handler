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
      return;
    }

    const prefix = Array.isArray(configPrefix)
      ? configPrefix.find((prefix) => message.content.startsWith(prefix))
      : configPrefix;

    if (!prefix) return;

    const args = (args = message.content
      .slice(prefix.length)
      .trim()
      .split(/\s+/));
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

    const length = args.length;

    if (
      (cmd.minArgs !== 0 && length < cmd.minArgs) ||
      (cmd.maxArgs && length > cmd.maxArgs)
    ) {
      return message.channel.send(
        `Incorrect Arguments Length for the command call! ${prefix}${command} ${cmd.usage}`
      );
    }

    try {
      if (cmd.executePrefix) {
        return cmd.executePrefix(message, args, client, level);
      } else {
        return cmd
          .execute(message, args, client, level)
          .then((reply) => {
            console.warn(
              "Please use executePrefix property for prefix commands as next version of discord-features-handler will use, 'execute' property for slash commands only."
            );
          })
          .catch((e) => {
            console.error(e, `Executing CMD: ${cmd.name}`);
            console.error(
              "[log]",
              "[Prefix CMDs]",
              `Failed to execute prefix command: ${command}, please update to executePrefix property instead`,
              e.message
            );
            message.reply("There was an error trying to execute that command!");
          });
      }
    } catch (e) {
      console.error(e, `Executing CMD: ${cmd.name}`);
      message.reply("There was an error trying to execute that command!");
    }
  },
};
