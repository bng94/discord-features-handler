module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        const { commandName, commandId  } = interaction;
        const cmd = client.commands.get(commandName);
        
        console.log(`${commandName}`, `${interaction.user.tag}`, `SLASH CMD`);
        console.log(commandId, 'ID', 'SLASH CMD');
        
        const level = client.getPermissionsLevel(interaction);
        cmd.interactionReply(interaction, client, level);
    },
};