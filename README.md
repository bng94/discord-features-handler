# discord-features-handler
Discord-feature-handler is a handler for discord commands, slash commands and discord events that allows you to easily start creating command and events files to interact with discord.js and connect to discord api to easily create your own discord.js bot without the worrying of how to setup and run the commands and events files.

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

## Roadmap
##### Currently, updates are made on weekends only, will maintain and update documentation when as possible. Please feel free to PR to fix an issue or submit an issue.

- [ ] Documentation
  - [ ] Event Setup  
  - [ ] Built-in features explained
  - [ ] ChangeLog.md on github repo
- [ ] testing mongoDB modules files
  - [ ] Remove bot token if mongoDb modules files test failed  
- [ ] Official version 1.0.0 Release 

## Bug and Issues
If you found and bug and issues please [report the issue](https://github.com/bng94/discord-features-handler/issues) and provide steps to reproducible bugs/issues.

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue before making a change or PR.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Notes
This is a pre-release version. Official version 1.0.0 will be released soon with full documentation.

Using discord-feature-handler you can straight up create the command and event files settings a key/value with the respective command name or event name (event name assosiated with the event, such as ready, messageCreate, messageUpdate and so forth listed from the discord.js documentation.

This is my first npm package that I created due to the usage for my three bots that I have created for different purposes. Feel free to check this package out, contribute, PR and send any issues that you come across! 

This package will be updated for future version of discord.js as I will be using for all my discord.js bots.