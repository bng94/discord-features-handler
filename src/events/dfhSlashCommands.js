const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const guildId = client.config.serverID ? client.config.serverID : "";

    const guild = client.guilds.cache.get(guildId);
    const commands = guild ? guild.commands : client.application?.commands;

    const cmds = client.commands;
    const slashCmds = cmds.filter((cmd) => cmd.slash === true || cmd.slashOnly);

    const cmdArray = [...slashCmds.values()];

    console.log(
      "[log]",
      "[Slash Commands]",
      `Loading a total of ${cmdArray.length} slash commands.`
    );

    cmdArray.forEach((cmd) => {
      let tempObj = {
        name: cmd.name,
        description: cmd.description,
      };

      if (cmd.slashOptions) {
        tempObj = { ...tempObj, options: cmd.slashOptions };
      }

      commands?.create(tempObj);
    });
  },
};
