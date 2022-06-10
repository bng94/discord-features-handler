# discord-features-handler
Discord-feature-handler is a handler for discord commands, slash commands and discord events that allows you to easily start creating command and events files to interact with discord.js and connect to discord api to easily create your own discord.js bot without the worrying of how to setup and run the commmds and events. Using discord-feature-handler you can straight up create the command and event files settings a key/value with the respective command name or event name (event name assosiated with the event, such as ready, messageCreate, messageUpdate and so forth listed from the discord.js documentation.

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
const { Client, Intents } = require("discord.js");
import DiscordFeaturesHandler = from("discord-features-handler");
const client = new Client({
  intents: [...],
  partials: [...],
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

### Setting up DiscordFeaturesHandler function 

---
```js
DiscordFeaturesHandler(client, object);
```

#### Argument: `client`

---

This is the Client object from discord.js 
```js
const { Client, Intents } = require("discord.js"); 
const client = new Client({
  intents: [...],
  partials: [...],
});
```

### Argument: `object`

---

This object consists of multiple key/values that are required for discord-features-handler to manage and handle commands, events files for you and pass in the arugments requested from pre-define parameters for each commands or discord events.

#### config
The key consist of a value for the file path to your configuration file

| Key | config |
| --- | --- |
| Type | `String` |
| Required | `true` |

#### mainDirectory
The file path to your main file, index.js file

| Key | mainDirectory |
| --- | --- |
| Value | `__dirname` 
| Required | `true` |

#### commandDir 
Folder name of your sub-folders that contains your command files, these sub folders are folders you name to categories the commands.

| Key | commandDir |
| --- | --- |
| Type | `String` |
| Required | `true` |


#### eventDir
Folder name to contain your discord events file

| Key | eventDir |
| --- | --- |
| Type | `String` |
| Required | `true` |

#### modulesDir
Folder name to contain your modules.export files. 
These files should be functions to can used throughout your bot.

| Key | modulesDir |
| --- | --- |
| Type | `String` |
| Required | `true` |

#### BOT_TOKEN
Discord-features-handler will handle the client.login on function setup, so you will need to enter Discord Bot Token

| Key | BOT_TOKEN |
| --- | --- |
| Type | `String` |
| Required | `true` 


#### disableAllDefaults
Disable all default command and events file provided by discord-features-handler

| Key | disableAllDefaults |
| --- | --- |
| Type | `Boolean` |
| Default | `false` |


#### disableDefaultHelpCmd
Disable all default Help command provided by discord-features-handler

| Key | disableDefaultHelpCmd |
| --- | --- |
| Type | `Boolean` |
| Default | `false` |


#### disableDefaultReloadCmd
Disable all default Reload command provided by discord-features-handler. This command reload your command files.

| Key | disableDefaultReloadCmd |
| --- | --- |
| Type | `Boolean` |
| Default | `false` |

#### disableDefaultMessageCreate
Disable all default Message Create Event file provided by discord-features-handler. This event manages and setup your commands files.

| Key | disableDefaultMessageCreate |
| --- | --- |
| Type | `Boolean` |
| Default | `false` |

#### filesToExcludeInHandlers 
In this Array of Strings are file names + extensions of file you don't want the discord-features-handler to run.

| Key | filesToExcludeInHandlers |
| --- | --- |
| Type | `Array` |

### Setting up Commands

You can now create the commands folder, if you define it in ` commandDir: "commands"`, it should be called "commands",

In the folder, must contain sub-folders and the sub-folders should be named as categories of the commands file you will put in them.

* ❌ Parent folder should never contain script files(.js files)

* ✅ Parent folder must always contain sub folders

| Folder Structure | Command Directory |
| --- | --- |
| Parent Folder | commands |
| sub folder | `category_name` |
| commands file in sub folder | `pings.js`, `help.js` |

#### ping.js command file example:
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
#### ping.js as slash command example:
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
 ##### Slash command to requires user to mention someone then set this option
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
#### You can learn more by reading the [Discord Dev Docs](https://discord.com/developers/docs/interactions/slash-commands) about Slash Commands.

### Setting Up Discord Events
You can now create the discord events folder, if you define it in `eventDir: "events"`, it should be called "events",

In this folder, you can just simply create JavaScript files and the name files so forth to reflect what the file contains or what event it is.

For example creating a ready event file:

#### ready.js: 
```js
module.exports = {
  name: "ready", //name of discord event
  once: true,  // if the event should execute once only
  async execute(client) {  // functionality of the event
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

## Config.js sample file

### coming soon...


## Roadmap

##### I am currently working a full-time job, M-F, I will try to finish the documentations, please expect Saturday and Sunday for updates and releases.

- [ ] Events Setup Documentation / new md file
- [ ] Redo Command and Slash Command Setup Documentation / new md file
- [ ] Modules Setup Documentation 
- [ ] config.js file Documentation
- [ ] More usage examples


## Documentation

### [TBA](https://github.com/bng94/discord-features-handler)

## Bug and Issues
If you found and bug and issues please [report the issue](https://github.com/bng94/discord-features-handler/issues) and provide steps to reproducible bugs/issues.

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

For bugs and feedbacks 

## License

[MIT](https://choosealicense.com/licenses/mit/)


