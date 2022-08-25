module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { commandName, commandId, customId } = interaction;
    if (interaction.isCommand()) {
      const cmd = client.commands.get(commandName);

      console.log(`[SLASH CMD]`, `[${interaction.user.tag}]`, `${commandName}`);
      console.log("[SLASH CMD]", "[ID]", commandId);

      const level = client.getPermissionsLevel(interaction);
      try {
        return cmd.interactionReply(interaction, client, level);
      } catch (e) {
        console.log(
          "isCommand interaction (slash command) execution failed",
          e
        );
      }
    }

    if (interaction.isButton()) {
      //TODO: add interaction from cmd property
      const cmd = client.commands.filter(
        (cmd) => cmd.buttonCustomId === customId
      )[0];

      try {
        return cmd.buttonInteraction();
      } catch (e) {
        console.log("isButton interaction execution failed", e);
      }
    }
    if (interaction.isAutocomplete()) {
      //TODO: add interaction from cmd property
    }
    if (interaction.isContextMenu()) {
      //TODO: add interaction from cmd property
    }
    if (interaction.isModalSubmit()) {
      const cmd = client.commands.filter(
        (cmd) => cmd.modalCustomId === customId
      )[0];


      try {
        return cmd.modalInteraction();
      } catch (e) {
        console.log("isModalSubmit interaction execution failed", e);
      }
    }
  },
};
