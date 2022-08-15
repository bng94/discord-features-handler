# discord-features-handler
Discord-features-handler is a handler for discord commands, slash commands and discord events that allows you to easily start creating command and events files to interact with discord.js and connect to discord api to easily create your own discord.js bot without the worrying of how to setup and run the commands and events files.

<a href="https://www.npmjs.com/package/discord-features-handler"><img src="https://img.shields.io/npm/v/discord-features-handler?color=blue" alt="npm version" /></a>
<a href="https://www.npmjs.com/package/discord-features-handler"><img src="https://img.shields.io/npm/dt/discord-features-handler.svg?maxAge=3600" alt="npm downloads" /></a>

## Features

* Command Handler
* Slash Command Handler
* Events Handler
* Modules Handler
* Pre-Made Reload Command
* Pre-made Help Command
* Unhandled Rejection Handler
* String.prototype.toProperCase()
* Array.prototype.Random()


## Demo

Here is github repository of mine where a discord bot is created using DiscordFeaturesHandler.

[Discord Bot using DiscordFeaturesHandler](https://github.com/bng94/heroku-bot)

## Installation

Installing DiscordFeaturesHandler

```js
  npm install discord-features-handler
```

## Usage

Here is a basic example of how to setup discord-features-handler. 
A simple example with only the essentials to get a bot up and running:

```js
const { Client, Intents } = require("discord.js");
const DiscordFeaturesHandler = require("discord-features-handler");
const client = new Client({
  intents: [...],
  partials: [...],
});

DiscordFeaturesHandler(client,  {
  mainDirectory: __dirname,
  config: "./config.js",
  BOT_TOKEN: "YOUR_BOT_TOKEN",
}); 
```
>The intents are gateway intents are what discord gives for bot developers access to events based on what data it need for their function. You can find the [list of intents here](https://discord.com/developers/docs/topics/gateway#list-of-intents). You can read more about intents in the [discordjs.guide docs](https://discordjs.guide/popular-topics/intents.html#privileged-intents).You should enable all partials for your use cases, as missing one then the event does not get emitted. You can read more about partials in the [discordjs.guide docs](https://discordjs.guide/popular-topics/partials.html#handling-partial-data).


## DiscordFeaturesHandler Properties
Thees are the properties of the DiscordFeaturesHandler
| Property      | Type        | Default        |  Description                |
| ------------- | ----------- | -------------- | --------------------------- |
| client        | Client      | ""             | [Discord Client Object](https://discord.js.org/#/docs/main/stable/class/Client)        |
| options       | Object      | {...}          | Object that contains parameters to configure DiscordFeaturesHandler 

### options
Here are the some parameters of options Object. For a full list please check out the [documentation](https://bng94.gitbook.io/discord-features-handler-docs/structure/discordfeatureshandler-setup).
| Parameter     | Type        | Required       | Default        |  Description                |
| ------------- | ----------- | -------------- | -------------- | --------------------------- |
| mainDirectory | string      | true  |  ""             | The absolute path to the directory containing the executing main script file. Expected Value: **__dirname**        |
| config       | string       | false  | "./config"      | The path to your configuration file. Default value is path to default configuration file provided.              |
| BOT_TOKEN   | string        | true  | ""      | This is your bot token that you can find in your [Discord Developer Portal](https://discordapp.com/developers/applications/). This is required to login to your discord bot. |
| commandDir   | string        | false  | "commands"      | Folder name of your command folder that contains sub-folders which contains the command files. The sub-folders are the category names of the command inside those folders. Default folder name is: **commands**.    |
| eventDir     | string        | false  | "events"      | Folder name of your event folder containing discord event files. Default folder name is: **events**.    |
| modulesDir   | string        | false  | "modules"      | Folder name of your module folder that contains your module files. Default folder name is: **modules**.    |
| modulesPreloadTime   | number        | false  | 5000      | Establish a waiting time to connect to the Discord API and load the data required for the module files. The time value is in milliseconds. You can set the time based off how many files in the module folder requires access to the API. Default time in milliseconds is 5000. |


## Commands Properties
The properties that are required to have when creating a command file

| Property      | Type        | Default        |  Description                |
| ------------- | ----------- | -------------- | --------------------------- |
| name          | string      | ""             | name of your command        |
| description   | string      | ""             | description of your command        |
| aliases      | Array | [""]             | aliases of the command, you must set []      |
| guildOnly      | bool | false             | If command is guild only (not a DM command) |
| permission      | number | ""             | Permission level required to use command |
| minArgs      | number | ""             | Minimum number of arguments required for command execution |
| maxArgs      | number | ""             |Maximum number of arguments required for command execution |
| usage      | string | ""             | Show how to use the command arguments in the command call |
| execute(message, args, client, level)      | func | ""             | Functionality and response of the command call. Parameters are `message object`, `arguments array`, `client Object`, and `user's permission level` |

##### Example Command:
```js
module.exports = {
	name: 'ping',
	description: 'Ping Pong Command!',
	aliases: ['p'],
	guildOnly: true,
	permissions: 0,
	minArgs: 0, 
	usage: '',
    /** 
    * @param {message} message The discord message object
    * @param {Array<string>} args The arguments following the command call
    * @param {Client} client The discord client object
    * @param {number} level The permission level of the user who made the command call
    */
	execute(message, args, client, level) { 
		return message.channel.send('Pong.');
	},
};
```

## Slash Command Properties
The properties that are required to have when creating a slash command file
The properties of all command listed above and the following:

| Property      | Type        | Default        |  Description                |
| ------------- | ----------- | -------------- | --------------------------- |
| slash         | bool     | false          | State if this command is a slash command        |
| slashOptions   | JSON object | ""             | OPTIONAL: Options properties of a slash command, documentation can be found here. [Discord Developer Doc](https://discord.com/developers/docs/interactions/application-commands#slash-commands) |
| interactionReply(interaction, client, level)   | func | ""             | Functionality and response of the slash command call. Parameters are `interaction` and `client Object`, and `user's permission level`  |


##### Example Slash Command:
```js
module.exports = {
	name: 'ping',
	description: 'Ping Pong Command!',
	aliases: ['p'],
	guildOnly: true,
	permissions: 0,
	minArgs: 0, 
	usage: '',
	/**
	* This is required and set as true. Otherwise would not recognize as a slash command
	*/
	slash: true,
    /** 
    * @param {message} message The discord message object
    * @param {Array<string>} args The arguments following the command call
    * @param {Client} client The discord client object
    * @param {number} level The permission level of the user who made the command call
    */
	execute(message, args, client, level) { 
      return message.channel.send('Pong.');
    },
    /** 
    * @param {interaction} interaction The discord interaction object
    * @param {Client} client The discord client object
    * @param {number} level The permission level of the user who made the command call
    */
    async interactionReply(interaction, client, level) {
      await interaction.reply({
	content: 'Pong!'
      });
    }
};
```

## Discord Event File 
When creating a discord event file in your events folder, will required the following properties:

| Property      | Type        | Default        |  Description                |
| ------------- | ----------- | -------------- | --------------------------- |
| name          | string      | ""             | Discord Event Name. List of names can be found [here](https://discord.js.org/#/docs/main/stable/class/Client).          |
| once          | bool        | false          | if the event should run once on first trigger or on every event trigger |
| execute (client, ...params)  | func | ""             | Functionality and response of the discord event trigger. **Params** are parameters of the event you are defining.  |

##### Example Ready Event
```js
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
      console.log('Bot just started!');
  },
};
```

## Modules Files 

You can create a plain module.exports file in your modules folder. The only parameter being passed in is the client object. No properties are required to be defined.

```js
  module.exports = (client) => {
    // do something
  }; 
```

## Built-in functions

### String.prototype.toProperCase()
This add a new function to a String constructor object where you can make all the first letter of a word in that object, capitalize. 
```js
const str = "A quick brown fox jumps over the lazy dog";

console.log(str.toProperCase());
//expected output: "A Quick Brown Fox Jumps Over The Lazy Dog"
```

### Array.prototype.random()
This add a new function to a Array constructor object where in returns a random element in the array.
```js
const arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.random());
//expected output is either: a, b, c, d, or e
```

### unhandledRejection
> :warning:  **Catches unhandled promise rejections**

This handles and console.log any unhandled errors. Which are methods that are missing .catch(e) that causes to crashes the bot. This function prevent the  crash and handles it by console logging it.

```js
process.on("unhandledRejection", (e) => {
  console.log(e);
});
```

### The following functions can be overwritten by re-defining
If you create a new `client.<functionName>` you can override then existing function with the new function.

#### client.getPermissionsLevel ( parameter )

> :warning:  **Please do not override unless you are creating your own permission level configuration with a different approach then this handler uses!**

This parameter is either an interaction object or message object, based off the command type and which type of command was called. This function returns a permission level based off the `config.js` file. 

#### client.loadCommand

> :x:  **When overriding this will override the handler and commands will not load!**

This function handles load the command 

#### client.unloadCommand
> :x:  **When overriding this will override the handler and commands may be able to unload to reload the new command file!**

Unload the command, by clearing the cache so you can reload the command with a new command file.

#### client.commands and client.aliases
> :x:  **DO NOT OVERRIDE: This saves all the properties of the command files so that we can load the commands for you**

These are Discord.Collection object that contains the command and aliases information to handle loading commands and executing them based off their properties
## Documentation

The official documentation can be found here: [DiscordFeaturesHandler Documentation](https://bng94.gitbook.io/discord-features-handler-docs/)

You can read all the version and changes history here: [ChangeLog](https://bng94.gitbook.io/discord-features-handler-docs/project-development/changelog)

## Bug and Issues
If you found and bug and issues please [report the issue](https://github.com/bng94/discord-features-handler/issues) and provide steps to reproducible bugs/issues.

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue before making a change or PR.

## Notes
discord-features-handler allows you to create the command and event files by using the pre-define properties with the respective command name or event name (event name associated with the event, such as ready, messageCreate, messageUpdate, or interactionCreate as listed on [discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Client). As a *flexible handler*, this help the developer focus on what required for their discord bot without worrying about how to connect to the Discord API using discord.js and focus on the main aspect of the bot which is the functionality and features for their bot.

This is my first npm package that I created due to having three bots that I have created for different purposes and using the same formats. Feel free to check this package out, contribute, PR and send any issues that you come across! 

## License

[MIT](https://choosealicense.com/licenses/mit/)
