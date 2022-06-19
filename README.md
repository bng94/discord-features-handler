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


const options = {
  mainDirectory: __dirname,
  config: "./config.js",
  BOT_TOKEN: "YOUR_BOT_TOKEN",
};

DiscordFeaturesHandler(client, options);

```
>The intents are gateway intents are what discord gives for bot developers access to events based on what data it need for their function. You can find the [list of intents here](https://discord.com/developers/docs/topics/gateway#list-of-intents). You can read more about intents in the [discordjs.guide docs](https://discordjs.guide/popular-topics/intents.html#privileged-intents). You should enable all partials for your use cases, as missing one then the event does not get emitted. You can read more about partials in the [discordjs.guide docs](https://discordjs.guide/popular-topics/partials.html#handling-partial-data).
## Documentation

The official documentation can be found here: [DiscordFeaturesHandler Documentation](https://bng94.gitbook.io/discord-features-handler-docs/)

You can read all the version and changes history here: [ChangeLog](https://bng94.gitbook.io/discord-features-handler-docs/project-development/changelog)

## Bug and Issues
If you found and bug and issues please [report the issue](https://github.com/bng94/discord-features-handler/issues) and provide steps to reproducible bugs/issues.

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue before making a change or PR.


## Notes
discord-features-handler allows you to create the command and event files settings by setting the pre-define properties with the respective command name or event name (event name associated with the event, such as ready, messageCreate, messageUpdate, or interactionCreate as listed on [discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Client).

This is my first npm package that I created due to having three bots that I have created for different purposes and using the same formats. Feel free to check this package out, contribute, PR and send any issues that you come across! 

## Privacy Concerns
We do not save or maintain any information of your bot token. Discord-Features-Handler requires your bot token, to allow async/await tasks inside the modules folder, which can enables databases connection such as for MongoDB. For MongoDB to work and allowing it to post and update channels. We need all our discord events, ready event and bot to be logged in to be able to connect to the servers which uses the databases and display the information when bot starts up.

## License

[MIT](https://choosealicense.com/licenses/mit/)
