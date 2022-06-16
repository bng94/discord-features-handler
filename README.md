# discord-features-handler
Discord-features-handler is a handler for discord commands, slash commands and discord events that allows you to easily start creating command and events files to interact with discord.js and connect to discord api to easily create your own discord.js bot without the worrying of how to setup and run the commands and events files.

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
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
## Documentation

The official documentation can be found here: [DiscordFeaturesHandler Documentation](https://bng94.gitbook.io/discord-features-handler-docs/)

## Bug and Issues
If you found and bug and issues please [report the issue](https://github.com/bng94/discord-features-handler/issues) and provide steps to reproducible bugs/issues.

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue before making a change or PR.


## Notes
discord-features-handler allows you to create the command and event files settings by setting the pre-define properties with the respective command name or event name (event name associated with the event, such as ready, messageCreate, messageUpdate, or interactionCreate as listed on [discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Client).

This is my first npm package that I created due to having three bots that I have created for different purposes and using the same formats. Feel free to check this package out, contribute, PR and send any issues that you come across! 

## Privacy Concerns
We do not save or maintain any information of your bot token. Discord-Features-Handler requires your bot token, to allow async/await tasks inside the modules folder, which can enables databases connection such as for MongoDB. For MongoDB to work and allowing it to post and update channels. We need all our discord event, ready event and bot to be logged in to be able to connect to the servers which uses the databases and display the information when bot starts up.

## License

[MIT](https://choosealicense.com/licenses/mit/)