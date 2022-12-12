module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { commandName, commandId, customId } = interaction;
    const level = client.getPermissionsLevel(interaction);
    if (interaction.isCommand()) {
      const cmd = client.commands.get(commandName);

      console.log(`[SLASH CMD]`, `[${interaction.user.tag}]`, `${commandName}`);
      console.log("[SLASH CMD]", "[ID]", commandId);

      try {
        return cmd.interactionReply(interaction, client, level);
      } catch (e) {
        console.log(
          "isCommand interaction (slash command) execution failed",
          e
        );
      }
    }

    /**
     ** NOTE:
     ** Since interactionReply return a command response, these modal/buttons may not, error may encounter (haven't fully tested all if else scenarios)
     **
     */
    if (interaction.isButton()) {
      //TODO: add interaction from cmd property
      //* Similar to interactionReply, this should return the command
      //* Since we need to check the id to ensure it matches the button action we are trying to execute, we need to filter here, since it may not match to the cmd file name (which it should in theory), it is easier to trace this method
      const cmd = client.commands.filter(
        (cmd) => cmd.buttonCustomId === customId
      )[0];

      try {
        return cmd.buttonInteraction(interaction, client, level);
      } catch (e) {
        console.log("isButton interaction execution failed", e);
      }
    }
    if (interaction.isAutocomplete()) {
      const cmd = client.commands.get(commandName);
      try {
        return cmd.autoCompleteInteraction(interaction, client, level);
      } catch (e) {
        console.log(
          "isCommand interaction (slash command) execution failed",
          e
        );
      }
    }
    if (interaction.isContextMenu() || interaction.isUserContextMenu()) {
      const cmd = client.commands.get(commandName);
      try {
        return cmd.contextMenuInteraction(interaction, client, level);
      } catch (e) {
        console.log(
          "isCommand interaction (slash command) execution failed",
          e
        );
      }
    }
    if (interaction.isModalSubmit()) {
      const cmd = client.commands.filter(
        (cmd) => cmd.modalCustomId === customId
      )[0];

      try {
        return cmd.modalInteraction(interaction, client, level);
      } catch (e) {
        console.log("isModalSubmit interaction execution failed", e);
      }
    }
  },
};
