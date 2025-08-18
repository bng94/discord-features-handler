# Built-in interactionCreate Event

This event handles the creation execution of the slash commands, using the built-in slash command executing from the slash properties of a command file and also using the built-in `client.commands` Collection object. We will also display the slash command Id, incase you decide to delete a slash command.

!!! note "Using v3.1.0 or later and you decided to disable the built-in IntercationCreate"
    Please use `execute` property instead of `interactionReply` property for running slash commands and make sure for the prefix version of the command use `executePrefix` property if you choose to use a prefix version of the command.


```javascript
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
          return cmd.execute(interaction, client, level);
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

      const foundCmd = client.commands.find((cmd) => {
        if (!cmd.customIds) return false;

        if (Array.isArray(cmd.customIds)) {
          return cmd.customIds.includes(customId);
        }

        return false;
      });

      if (!foundCmd || !foundCmd.name) {
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
      try {
        return foundCmd.customIdInteraction(interaction, client, level);
      } catch (e) {
        console.error(
          `Error executing customIdInteraction for command "${foundCmd.name}":`,
          e
        );
        return interaction.reply({
          content: `An error occurred while processing your interaction: ${foundCmd.name} and customId: ${customId}. Error: ${e}`,
        });
      }
    } catch (e) {
      console.log("Interaction execution failed", e);
      return interaction.reply({
        content: "An error occurred while processing your interaction." + e,
      });
    }
  },
};


```