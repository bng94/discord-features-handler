const { version, MessageEmbed } = require("discord.js");
const pack = require("../../../package.json");

module.exports = {
  name: "about",
  description: "Display information about this bot.",
  aliases: [""],
  guildOnly: false,
  permissions: 0,
  minArgs: 0,
  usage: "",
  execute(message, args, client, level) {
    const embed = new MessageEmbed()
      .setColor(0x800000)
      .setThumbnail(`${client.user.avatarURL()}`)
      .setTitle(`About Me`)
      .setDescription(`${pack.description}`)
      .setAuthor({ name: `${pack.name} v${pack.version}` })
      .setFields(
        {
          name: `Developer:`,
          value: `${pack.author}`,
        },
        {
          name: `Library:`,
          value: `Discord.js v${version}\nNode ${process.version}`,
          inline: true,
        },
        {
          name: `Report Bugs Issues:`,
          value: `${pack.bugs.url}`,
        },
        {
          name: `Home Page:`,
          value: `${pack.homepage}`,
          inline: true,
        }
      );

    try {
      return message.channel.send({
        embeds: [embed],
      });
    } catch (e) {
      client.errorLog(e, `About CMD`);
    }
  },
};
