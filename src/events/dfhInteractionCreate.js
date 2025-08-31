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
          return await interactionErrorReply(interaction, {
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
          if (cmd.execute && !cmd.interactionReply) {
            return await cmd.execute(interaction, client, level);
          }
          return await cmd
            .interactionReply(interaction, client, level)
            .then((reply) => {
              console.warn(
                "Please use execute property for slash commands as next version of discord-features-handler will use, 'executePrefix' property for prefix commands and deprecate interactionReply."
              );
            });
        } catch (e) {
          console.log(
            "ApplicationCommand interaction (slash command) execution failed",
            e
          );
          return await interactionErrorReply(interaction, {
            content: `An error occurred while processing your command: ${commandName}. Error: ${e}`,
            ephemeral: true,
          });
        }
      }

      const foundCmd = client.commands.find((cmd) => {
        if (!cmd.customIds) return false;

        if (Array.isArray(cmd.customIds)) {
          return cmd.customIds.includes(customId);
        }

        return false;
      });

      if (!foundCmd || !foundCmd.name) {
        console.error("Unable to find command with customId: " + customId);
        return await interactionErrorReply(interaction, {
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
        return await interactionErrorReply(interaction, {
          content: `Command "${foundCmd.name}" has not implemented customIdInteraction.`,
          ephemeral: true,
        });
      }

      console.log(
        `[CUSTOM ID CMD]`,
        `[${interaction.user.tag}]`,
        `${foundCmd.name} CustomID: ${customId}`
      );

      try {
        return await foundCmd.customIdInteraction(interaction, client, level);
      } catch (e) {
        console.error(
          `Error executing customIdInteraction for command "${foundCmd.name}":`,
          e
        );
        return await interactionErrorReply(interaction, {
          content: `An error occurred while processing your interaction: ${foundCmd.name} and customId: ${customId}. Error: ${e}`,
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log("Interaction execution failed", e);
      return await interactionErrorReply(interaction, {
        content: "An error occurred while processing your interaction: " + e,
        ephemeral: true,
      });
    }
  },
};

/**
 * Safely handles interaction replies with comprehensive error handling
 * Designed specifically to prevent "Unknown interaction" errors
 */
async function interactionErrorReply(interaction, options) {
  try {
    // Final validation check before attempting to reply
    if (!interaction.isRepliable()) {
      console.log(
        "[DFH] Cannot reply to interaction - already handled or expired"
      );
      return;
    }

    // Handle different interaction states
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply(options);
      console.log("[DFH] Successfully replied to interaction");
    } else if (interaction.deferred) {
      await interaction.editReply(options);
      console.log("[DFH] Successfully edited deferred interaction");
    } else if (interaction.replied) {
      // Already replied, try followUp
      await interaction.followUp(options);
      console.log("[DFH] Successfully sent follow-up to interaction");
    }
  } catch (error) {
    if (error.code === 10062) {
      console.log(
        "[DFH] Unknown interaction error - interaction already handled by another bot instance"
      );
    } else if (error.code === 40060) {
      console.log("[DFH] Interaction has already been acknowledged");
    } else if (error.code === 10008) {
      console.log("[DFH] Unknown message - interaction may have expired");
    } else {
      console.error(
        "[DFH] Failed to send interaction response:",
        error.code || "Unknown",
        error.message
      );
    }
  }
}
