const { InteractionType, Events } = require("discord.js");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    const { commandName, commandId, customId } = interaction;
    const level = client.getPermissionsLevel(interaction);
    if (interaction.type === InteractionType.ApplicationCommand) {
      const cmd = client.commands.get(commandName);

      console.log(`[SLASH CMD]`, `[${interaction.user.tag}]`, `${commandName}`);
      console.log("[SLASH CMD]", "[ID]", commandId);

      try {
        return cmd.interactionReply(interaction, client, level);
      } catch (e) {
        console.log(
          "ApplicationCommand interaction (slash command) execution failed",
          e
        );
      }
    } else if (
      interaction.type === InteractionType.ApplicationCommandAutocomplete
    ) {
      const cmd = client.commands.get(commandName);
      try {
        return cmd.autoCompleteInteraction(interaction, client, level);
      } catch (e) {
        console.log(
          "ApplicationCommandAutocomplete interaction (slash command) execution failed",
          e
        );
      }
    } else if (interaction.type === InteractionType.MessageComponent) {
      const cmd = client.commands.filter((cmd) => cmd.customId === customId)[0];

      try {
        return cmd.componentInteraction(interaction, client, level);
      } catch (e) {
        console.log("MessageComponent interaction execution failed", e);
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      const cmd = client.commands.filter(
        (cmd) => cmd.modalCustomId === customId
      )[0];

      try {
        return cmd.modalInteraction(interaction, client, level);
      } catch (e) {
        console.log("ModalSubmit interaction execution failed", e);
      }
    }
  },
};
