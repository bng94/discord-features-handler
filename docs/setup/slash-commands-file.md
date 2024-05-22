# Setting up Slash Commands

You will need to follow properties to create a regular command and the following data, and interactionReply properties to create a slash command.


```javascript
data: new SlashCommandBuilder(),
async interactionReply(interaction) {},
```

Here is a sample slash command created from our previous ping command:

```javascript
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: 'ping',
	description: 'Ping Pong Command!',
	aliases: ['p'],
	guildOnly: true,
	permissions: 0,
	minArgs: 0, 
	usage: '',
        data: new SlashCommandBuilder()
	    .setName("ping")
	    .setDescription("Ping Pong Command"),
	execute(message, args, client) {
		return message.channel.send('Pong.');
	},
	async interactionReply(interaction) {
		await interaction.reply({
			content: 'Pong!'
		});
	}
};
```

### Properties


<p>
  <strong>data</strong><span class="varType"><a href="https://discord.js.org/docs/packages/builders/1.6.0/SlashCommandBuilder:Class">SlashCommandBuilder</a></span><br/>
  This is where you define the properties of the slash command using the SlashCommandBuilder Class. You can follow the <a href="https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files">official Discord.js guide</a> or <a href="https://discord.js.org/docs/packages/builders/1.6.0/SlashCommandBuilder:Class">builders guide</a>, however, we are using <code>interactionReply</code> and not using <code>execute</code> for the slash command functionality.<br/>
</p>

<p>
  <strong>interactionReply(interaction, client, level)</strong>
  <span class="varType">Promise&lt;Interaction&gt;</span><br/>
  This is a function that is invoked when the command is called to be executed.
</p>

| Property      | Type                                                                                                      | Required | Description                                                  |
|---------------|-----------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| interaction | [CommandInteraction Class](https://discord.js.org/docs/packages/discord.js/main/CommandInteraction:Class) | true     | This is the command interaction object that represents a slash command interaction on Discord. |
| client        | [Discord.Client](https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class)                   | false    | This is the Discord client object.                           |
| level         | Number                                                                                                    | false    | This is the user's permission level.                         |


**returns `Promise<Interaction>`**
