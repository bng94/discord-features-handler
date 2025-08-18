# Setting up Slash Commands

If you have a prefix command execution, it can be created in the same command file. 

All properties required for prefix commands are optional for slash commands.


```javascript
data: new SlashCommandBuilder(),
async execute(interaction) {},
```

Here is a sample slash command created from our prefix command, ping:

```javascript
const { SlashCommandBuilder } = require("discord.js");

const name = "ping";
const description = "Ping Pong Command!";

module.exports = {
	name,
	description,
	data: new SlashCommandBuilder()
	    .setName(name)
	    .setDescription(description),
	executePrefix(message, args, client) {
		return message.channel.send('Pong.');
	},
	async execute(interaction) {
		return await interaction.reply({
			content: 'Pong!'
		});
	}
};
```

### Properties


<p>
  <strong>data</strong><span class="varType"><a href="https://discord.js.org/docs/packages/builders/1.6.0/SlashCommandBuilder:Class">SlashCommandBuilder</a></span><br/>
  This is where you define the properties of the slash command using the SlashCommandBuilder Class. You can also follow the <a href="https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files">official Discord.js guide</a>.
</p>

<p>
  <strong>permissions</strong> <span class="varType">number</span> = 0  <span class="optional-label"></span><br/>
	In slash commands, you can use this permission level to add an extra layer or feature based on the level, but it will not prevent execution since slash commands are manageable at the server/guild level.
</p>

<p markdown>
  <strong>global</strong> <span class="varType">boolean</span> = false  <span class="optional-label"></span><br/>
	Default is always false. This is used to define if you want the slash command to be a global slash command. For guild based slash commands you will need to go to your `.env` file to set environment variable `DEVELOPMENT_GUILD_ID`, then you will have guild based slash commands for that specific guild id.  
</p>

<div markdown>
  <strong>execute(interaction, client, level)</strong>
  <span class="varType">Promise&lt;Interaction&gt;</span><br/>
  This is a function that is invoked when the slash command is called to be executed.

??? warning "Original `interactionReply` property in v3.1.0 or later"
    If both the `interactionReply` and `data` properties are defined for the same command, the `execute` property will still run prefix commands. This is provided for backward compatibility and will be removed in v4.0.0.

    However, if the `data` property is defined and the `interactionReply` property is not, then it will execute as a slash command as expected in v4.0.0 and later.

</div>


| Property      | Type                                                                                                      | Required | Description                                                  |
|---------------|-----------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| interaction | [CommandInteraction Class](https://discord.js.org/docs/packages/discord.js/main/CommandInteraction:Class) | true     | This is the command interaction object that represents a slash command interaction on Discord. |
| client        | [Discord.Client](https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class)                   | false    | This is the Discord client object.                           |
| level         | Number                                                                                                    | false    | This is the user's permission level.                         |


**returns `Promise<Interaction>`**
