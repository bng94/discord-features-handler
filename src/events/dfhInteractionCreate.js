module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;
    const { commandName, commandId } = interaction;
    const cmd = client.commands.get(commandName);

    console.log(`[SLASH CMD]`, `[${interaction.user.tag}]`, `${commandName}`);
    console.log("[SLASH CMD]", "[ID]", commandId);

    const level = client.getPermissionsLevel(interaction);
    cmd.interactionReply(interaction, client, level);
  },
};
