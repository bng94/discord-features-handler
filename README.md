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
* Supports TypeScript Natively


## Demo

Here is a demo bot where I created a discord bot is created using DiscordFeaturesHandler in JavaScript and in TypeScript in the TypeScript Branch.

[Demo Bot](https://github.com/bng94/heroku-bot)

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
const { DiscordFeaturesHandler } = require("discord-features-handler");
const client = new Client({
  intents: [...],
  partials: [...],
});

DiscordFeaturesHandler(client,  {
  config: "./config.js",
  directories: {
    main: __dirname,
  },
}); 
```

>The intents are gateway intents are what discord gives for bot developers access to events based on what data it need for their function. You can find the [list of intents here](https://discord.com/developers/docs/topics/gateway#list-of-intents). You can read more about intents in the [discordjs.guide docs](https://discordjs.guide/popular-topics/intents.html#privileged-intents).You should enable all partials for your use cases, as missing one then the event does not get emitted. You can read more about partials in the [discordjs.guide docs](https://discordjs.guide/popular-topics/partials.html#handling-partial-data).

##### Folder Structure

```arduino
discord-bot/
├── commands/
│   ├── miscellaneous/   //this can be any name you want
│   │   └── ping.js
├── events/
│   └── ready.js
├── modules/
├── node_modules/
├── .env
├── config.js
├── index.js
├── package-lock.json
└── package.json
```


## Documentation

The official documentation can be found here: [DiscordFeaturesHandler Documentation](https://bng94.github.io/discord-features-handler/)

You can read all the version and changes history here: [ChangeLog](https://bng94.github.io/discord-features-handler/release-notes/)

### DiscordFeaturesHandler Properties
These are the properties of the DiscordFeaturesHandler:

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>client</td>
      <td><a href="https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class">Client</a></td>
      <td>client</td>
      <td>The DiscordJS BaseClient Object</td>
    </tr>
    <tr>
      <td>options</td>
      <td><a href="https://bng94.github.io/discord-features-handler/setup/DiscordFeaturesHandlerOptions/">DiscordFeaturesHandlerOptions</a></td>
      <td>{ ... }</td>
      <td>Options that contains parameters to configure DiscordFeaturesHandler</td>
    </tr>
  </tbody>
</table>

### DiscordFeaturesHandlerOptions
Here are the some parameters of options Object. For a full list please check out the [documentation](https://bng94.github.io/discord-features-handler/setup/DiscordFeaturesHandlerOptions/).
<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Required</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>directories</td>
      <td>object</td>
      <td>true</td>
      <td>{ ... }</td>
      <td>Contains a parameter called main that is the absolute path to the directory containing the executing main script file, and your folder names for commands, events, and modules folders. Expected Value: { main: __dirname }</td>
    </tr>
    <tr>
      <td>config</td>
      <td>string</td>
      <td>false</td>
      <td>"./config"</td>
      <td>The path to your configuration file. Default value is path to default configuration file provided.</td>
    </tr>
  </tbody>
</table>


## Commands Properties
The properties that are **required** to have when creating a command file
<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td>string</td>
      <td>""</td>
      <td>Name of your command</td>
    </tr>
    <tr>
      <td>description</td>
      <td>string</td>
      <td>""</td>
      <td>Description of your command</td>
    </tr>
    <tr>
      <td>aliases</td>
      <td>Array</td>
      <td>[""]</td>
      <td>Aliases of the command. You must set `[]`</td>
    </tr>
    <tr>
      <td>guildOnly</td>
      <td>boolean</td>
      <td>false</td>
      <td>If command is guild only (not a DM command)</td>
    </tr>
    <tr>
      <td>permission</td>
      <td>number</td>
      <td>""</td>
      <td>Permission level required to use command</td>
    </tr>
    <tr>
      <td>minArgs</td>
      <td>number</td>
      <td>""</td>
      <td>Minimum number of arguments required for command execution</td>
    </tr>
    <tr>
      <td>maxArgs</td>
      <td>number</td>
      <td>""</td>
      <td>Maximum number of arguments required for command execution</td>
    </tr>
    <tr>
      <td>usage</td>
      <td>string</td>
      <td>""</td>
      <td>Show by writing an example of how to execute the command using the command argument(s) in the command call</td>
    </tr>
    <tr>
      <td>executePrefix(message, args, client, level)</td>
      <td>func</td>
      <td>""</td>
      <td>This is a function that is invoked when the command is called to be executed. Parameters are `message` object, `arguments` array, `client` object, and user's permission level to run a command</td>
    </tr>
  </tbody>
</table>

   

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
	executePrefix(message, args, client, level) { 
		return message.channel.send('Pong.');
	},
};
```

### Properties for Slash commands
The properties that are required when creating a command file for slash commands are listed above, and they include the following additional properties.
<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><a href="https://discord.js.org/docs/packages/builders/1.6.0/SlashCommandBuilder:Class">SlashCommandBuilder</a></td>
      <td>DiscordJS SlashCommandBuilder</td>
    </tr>
    <tr>
      <td>execute(interaction, client, level)</td>
      <td>func</td>
      <td> This is a function that is invoked when the slash command is called to be executed Parameters are `interaction`, `client` object, and `user's permission level`.</td>
    </tr>
  </tbody>
</table>


##### Example Slash Command:
```javascript 
const { SlashCommandBuilder } = require("discord.js");
const name = "ping";
const description = "Ping Pong Command";

module.exports = {
	name,
	description,
	aliases: ['p'],
	guildOnly: true,
	permissions: 0,
	minArgs: 0, 
	usage: '',
	/**
	* This is required and set as true. Otherwise would not recognize as a slash command
	*/
	data: new SlashBuilderCommand().setName(name)
	    .setDescription(description),
    /** 
    * @param {message} message The discord message object
    * @param {Array<string>} args The arguments following the command call
    * @param {Client} client The discord client object
    * @param {number} level The permission level of the user who made the command call
    */
	executePrefix(message, args, client, level) { 
      return message.channel.send({ content: 'Pong.'});
    },
    /** 
    * @param {interaction} interaction The discord interaction object
    * @param {Client} client The discord client object
    * @param {number} level The permission level of the user who made the command call
    */
    async execute(interaction, client, level) {
      await interaction.reply({
	      content: 'Pong!'
      });
    }
};
```

## Discord Event File 
When creating a discord event file in your events folder, will required the following properties:

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td>string</td>
      <td>""</td>
      <td>Discord Event Name. List of names can be found <a href="https://discord.js.org/docs/packages/discord.js/14.14.1/Events:Enum">listed as enums</a> and <a href="https://discord.js.org/docs/packages/discord.js/14.14.1/ClientEvents:Interface">here with their params listed</a>.</td>
    </tr>
    <tr>
      <td>once</td>
      <td>boolean</td>
      <td>false</td>
      <td>If the event should run once on the first trigger or on every event trigger.</td>
    </tr>
    <tr>
      <td>execute(client, ...params)</td>
      <td>func</td>
      <td>""</td>
      <td>This is the method used to execute and handle the Discord event trigger. <strong>Params</strong> are parameters of the event you are defining.</td>
    </tr>
  </tbody>
</table>

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

You can create a plain module.exports file in your modules folder. The only parameter being passed is an optional parameter, the client object. If using TypeScript make sure this is an default exports instead.

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

You can read more about these and other built-in functions in the [official Documentation](https://bng94.github.io/discord-features-handler/builtIn/functions/).

## Bug and Issues
If you found and bug and issues please [report the issue](https://github.com/bng94/discord-features-handler/issues) and provide steps to reproducible bugs/issues.

## Notes
This handler also allows you to follow the Discord.js guide with a few changes, such as we are using a JavaScript file instead of a JSON file for the `config` file and without creating your own handler for loading commands and events file. Also loading your modules files that contains features of your bot.

## Support and New Features 
This package is looking for feedback and ideas to help cover more use cases. If you have any ideas feel free to share them or even contribute to this package! Please first discuss the add-on or change you wish to make, in the repository. If you like this package, and want to see more add-on, please don't forget to give a star to the repository and provide some feedbacks!


## License

[MIT](https://choosealicense.com/licenses/mit/)
