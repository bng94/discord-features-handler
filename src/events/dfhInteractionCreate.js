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
      const cmdName = client.commands.find(
        (cmd) => cmd.autoCompleteCustomId === customId
      ).name;
      const cmd = client.commands.get(cmdName);
      try {
        return cmd.autoCompleteInteraction(interaction, client, level);
      } catch (e) {
        console.log(
          "ApplicationCommandAutocomplete interaction (slash command) execution failed",
          e
        );
      }
    } else if (interaction.type === InteractionType.MessageComponent) {
      const cmdName = client.commands.find(
        (cmd) => cmd.customId === customId
      ).name;
      const cmd = client.commands.get(cmdName);
      try {
        return cmd.componentInteraction(interaction, client, level);
      } catch (e) {
        console.log("MessageComponent interaction execution failed", e);
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      const cmdName = client.commands.find(
        (cmd) => cmd.modalCustomId === customId
      ).name;
      const cmd = client.commands.get(cmdName);

      try {
        return cmd.modalInteraction(interaction, client, level);
      } catch (e) {
        console.log("ModalSubmit interaction execution failed", e);
      }
    }
  },
};
