module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { commandName, commandId, customId } = interaction;
    if (interaction.isCommand()) {
      const cmd = client.commands.get(commandName);

      console.log(`[SLASH CMD]`, `[${interaction.user.tag}]`, `${commandName}`);
      console.log("[SLASH CMD]", "[ID]", commandId);

      const level = client.getPermissionsLevel(interaction);
      cmd.interactionReply(interaction, client, level);
    }
    if (interaction.isButton()) {
      //TODO: add interaction from cmd property
    }
    if (interaction.isAutocomplete()) {
      //TODO: add interaction from cmd property
    }
    if (interaction.isContextMenu()) {
      //TODO: add interaction from cmd property
    }
    if (interaction.isModalSubmit()) {
      //TODO: add interaction from cmd property
    }
  },
};
