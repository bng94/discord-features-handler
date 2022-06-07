const Discord = require("discord.js");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        const guildId = [client.config.serverID, ''];
      
        const guild = client.guilds.cache.get(guildId)
        let commands
        if (guild) {
            commands = guild.commands
        } else {
            commands = client.application?.commands
        }

        const cmds = client.commands;
        const slashCmds = cmds.filter((cmd) => cmd.slash === true);

        const cmdArray = [...slashCmds.values()];
        
        console.log(`Loading slash commands...`)
        for (const cmd of cmdArray) { 
            let tempObj = {
                name: cmd.name,
                description: cmd.description
            }

            if(cmd.slashOptions){
                tempObj = {...tempObj, options: cmd.slashOptions}
            }

            commands?.create(tempObj);
        }       
	},
};