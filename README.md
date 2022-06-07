# discord-features-handler
An discord regular and slash commands, events and modules handler with folder structure

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)


## Installation

Install my-project with npm

```js
  npm install discord-features-handler
```
    
## Features

* Command Handler
* Slash Command Handler
* Events Handler
* Modules Handler
* Pre-Made Reload Command
* Pre-made Help Command
* Unhandled Rejection Handler
* String.prototype.toPropercase()

## Usage

Here is a basic example of how to setup discord-features-handler. 
A simple example with only the essentials to get a bot up and running:

```js
const { Client, Collection, Intents } = require("discord.js");
import DiscordFeaturesHandler = from("discord-features-handler");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL"],
});
DiscordFeaturesHandler(client, {
  config: "./config.js",
  mainDirectory: __dirname,
  commandDir: "commands", // commands folder name ; add path to commands folder if it is a subfolder of another folder.
  eventDir: "events", // events folder name 
  modulesDir: "modules", // modules folder name
  BOT_TOKEN: "YOUR_BOT_TOKEN",
});

```
You can now create the commands folder,if you define it in ` commandDir: "commands"`, it should be called "commands",

In the folder, must contain sub-folders and the sub-folders should be named as categories of the commands file you will put in them.

commands  //commandDir name
  |_ _ _ category1 // subfolder + category
          |_ _ _ ping.js
  |_ _ _ category2  
          |_ _ _ help.js

ping.js command file example:
```js
module.exports = {
	name: 'ping',  //name of command when using <prefix>ping
	description: 'Ping Pong Command!', // description of command
	aliases: ['p'],  // aliases of command
	guildOnly: true,  // guild command only?
	permissions: 0,  // permission level of command, refer to config.js file
	minArgs: 0,   // minimum arguments required to execute command
	usage: '',  // example of how to use / call the command
	execute(message, args, client) { // function named execute; define what the command does
		return message.channel.send('Pong.');
	},
};
```

ping.js as slash command example:
```js
module.exports = {
	name: 'ping',
	description: 'Ping Pong Command!',
	aliases: ['p'],
	guildOnly: true,
	permissions: 0,
	minArgs: 0, 
	usage: '',
	slash: true, // state if this command is a slash command or not
	execute(message, args, client) {
		return message.channel.send('Pong.');
	},
	async interactionReply(interaction) { // define what the slash command does
		await interaction.reply({
			content: 'Pong!'
		});
	}
};
```
> If the slash command requires you to mention someone then set this option
```javascript
slash: true,
slashOptions: [{ 
    name: 'someone', 
    description: 'Mention Someone', 
    required: true, 
    type: 6 
}],
async interactionReply(interaction) {
	const { options } = interaction;
  const user = await options.getUser('someone');
	await interaction.reply({
		content: `Hello ${user.username}!`
	});
}
```
You can learn more by reading the [Discord Dev Docs](https://discord.com/developers/docs/interactions/slash-commands) about Slash Commands.

You can now create the discord events folder,if you define it in `eventDir: "events"`, it should be called "events",

In this folder, you can just simply create JavaScript files and the name should reflect what the file contains or what event it is.

For example creating a ready event file:

ready.js: 
```js
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    //prints out total number of users bot can interact with from all guilds/servers it is currently in
    console.log(`Serving ${client.guilds.cache.reduce((acc, curr) => (acc += curr.memberCount), 0 )} users`,"Ready!");
    //prints out total number of guilds/servers it is currently in
    console.log(`Servers: ${client.guilds.cache.size}`,"Ready!");
    console.log(`${client.user.tag}`,"Ready!");
  },
};
```
## Modules Folder Setup Usage
### coming soon...
