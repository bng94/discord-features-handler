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
      if (interaction.isCommand()) {
        if (!client.commands.has(commandName)) {
          return console.error("Unable to find command:" + commandName);
        }

        const cmd = client.commands.get(commandName);
        if (!cmd) {
          return console.error("Unable to find command:" + commandName);
        }
      }

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
        return console.error(
          "Unable to find command with customId: " + customId
        );
      }

      if (typeof foundCmd.customIdInteraction !== "function") {
        return console.error(
          `Command "${foundCmd.name}" does not implement customIdInteraction.`
        );
      }

      return foundCmd.customIdInteraction(interaction, client, level);
    } catch (e) {
      console.log("Interaction execution failed", e);
      return interaction.reply({
        content: "An error occurred while processing your interaction." + e,
      });
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
      const cmd = client.commands.get(commandName);

      if (!cmd) {
        return console.error("Unable to find slash command:" + cmd);
      }
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
    } else if (interaction.isUserContextMenuCommand()) {
      const cmd = client.commands.get(commandName);
      if (!cmd) {
        return console.error("Unable to find context menu command:" + cmd);
      }
      console.log(
        `[CONTEXT MENU CMD]`,
        `[${interaction.user.tag}]`,
        `${commandName} ID: ${commandId}`,
        commandId
      );
      cmd.contextMenuInteraction(interaction, client, level);
    } else if (
      interaction.type === InteractionType.ApplicationCommandAutocomplete
    ) {
      const cmdName = client.commands.find((cmd) =>
        cmd.customIds?.autoComplete?.includes(customId)
      )?.name;
      if (!cmdName) return;

      const cmd = client.commands.get(cmdName);
      try {
        return cmd.autoCompleteInteraction(interaction, client, level);
      } catch (e) {
        console.log("auto complete interaction execution failed", e);
      }
    } else if (interaction.type === InteractionType.MessageComponent) {
      const cmdName = client.commands.find((cmd) =>
        cmd.customIds?.messageComponent?.includes(customId)
      )?.name;
      if (!cmdName) return;
      const cmd = client.commands.get(cmdName);
      try {
        return cmd.componentInteraction(interaction, client, level);
      } catch (e) {
        console.log("MessageComponent interaction execution failed", e);
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      const cmdName = client.commands.find((cmd) =>
        cmd.customIds?.modal?.includes(customId)
      )?.name;
      if (!cmdName)
        return console.error(
          interaction.customId,
          "no modal interaction found"
        );

      const cmd = client.commands.get(cmdName);

      try {
        return cmd.modalInteraction(interaction, client, level);
      } catch (e) {
        console.log("ModalSubmit interaction execution failed", e);
      }
    }
  },
};
