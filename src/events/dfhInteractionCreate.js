module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      const { commandName, commandId } = interaction;
      const cmd = client.commands.get(commandName);

      console.log(`[SLASH CMD]`, `[${interaction.user.tag}]`, `${commandName}`);
      console.log("[SLASH CMD]", "[ID]", commandId);

      const level = client.getPermissionsLevel(interaction);
      cmd.interactionReply(interaction, client, level);
    }
    if (interaction.isButton()) {
      //TODO: add interaction from cmd property
      console.log("interaction button");
    }
    if (interaction.isAutocomplete()) {
      //TODO: add interaction from cmd property
      console.log("interaction isAutocomplete");
    }
    if (interaction.isContextMenu()) {
      //TODO: add interaction from cmd property
      console.log("interaction isContextMenu");
    }
    if (interaction.isModalSubmit()) {
      //TODO: add interaction from cmd property
      console.log("interaction isModalSubmit");
    }
  },
};
