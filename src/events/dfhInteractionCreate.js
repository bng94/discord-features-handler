const { InteractionType, Events } = require("discord.js");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    const { commandName, commandId, customId } = interaction;
    const level = client.getPermissionsLevel({
      author: interaction.user,
      channel: interaction.channel,
      guild: interaction.guild,
      guildMember: interaction.member,
    });

    try {
      if (interaction.type === InteractionType.ApplicationCommand) {
        const cmd = client.commands.get(commandName);

        if (!cmd) {
          console.error("Unable to find slash command:" + cmd);
          return interaction.reply({
            content: `Command not found: ${commandName}`,
            ephemeral: true,
          });
        }
        console.log(
          `[SLASH CMD]`,
          `[${interaction.user.tag}]`,
          `${commandName}`
        );
        console.log("[SLASH CMD]", "[ID]", commandId);

        try {
          return cmd.interactionReply(interaction, client, level);
        } catch (e) {
          console.log(
            "ApplicationCommand interaction (slash command) execution failed",
            e
          );
          return interaction.reply({
            content: `An error occurred while processing your command: ${commandName}. Error:
            ${e}`,
            ephemeral: true,
          });
        }
      }
      //  if (interaction.isUserContextMenuCommand()) {
      //   const cmd = client.commands.get(commandName);
      //   if (!cmd) {
      //     return console.error("Unable to find context menu command:" + cmd);
      //   }
      //   console.log(
      //     `[CONTEXT MENU CMD]`,
      //     `[${interaction.user.tag}]`,
      //     `${commandName} ID: ${commandId}`,
      //     commandId
      //   );
      //   cmd.contextMenuInteraction(interaction, client, level);
      // }

      const foundCmd = client.commands.find((cmd) => {
        if (!cmd.customIds) return false;

        if (Array.isArray(cmd.customIds)) {
          return cmd.customIds.includes(customId);
        }

        if (typeof cmd.customIds === "object") {
          return Object.values(cmd.customIds).includes(customId);
        }

        return false;
      });

      if (!foundCmd) {
        console.error("Unable to find command with customId: " + customId);

        return interaction.reply({
          content: `Command not found for customId: ${customId}`,
          ephemeral: true,
        });
      }

      if (
        typeof foundCmd.customIdInteraction !== "function" ||
        !foundCmd.customIdInteraction
      ) {
        console.error(
          `Command "${foundCmd.name}" has not implemented customIdInteraction.`
        );
        return interaction.reply({
          content: `Command "${foundCmd.name}" has not implemented customIdInteraction.`,
          ephemeral: true,
        });
      }

      console.log(
        `[CUSTOM ID CMD]`,
        `[${interaction.user.tag}]`,
        `${foundCmd.name} CustomID: ${customId}`
      );

      return foundCmd.customIdInteraction(interaction, client, level);
    } catch (e) {
      console.log("Interaction execution failed", e);
      return interaction.reply({
        content: "An error occurred while processing your interaction." + e,
      });
    }
  },
};
