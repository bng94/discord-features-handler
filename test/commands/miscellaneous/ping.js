module.exports = {
  name: "ping",
  description: "Ping!",
  aliases: ["p"],
  guildOnly: true,
  permissions: 0,
  minArgs: 0,
  usage: "",
  executePrefix(message, args, client, level) {
    return message.channel.send("Pong!");
  },
};
