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


const options = {
  config: "./config.js",
  mainDirectory: __dirname,
  commandDir: "commands", // commands folder name ; add path to commands folder if it is a subfolder of another folder.
  eventDir: "events", // events folder name 
  modulesDir: "modules", // modules folder name
  BOT_TOKEN: "YOUR_BOT_TOKEN",
};

DiscordFeaturesHandler(client, options);

```
## Roadmap

##### I am currently working a full-time job, M-F, I will try to finish the documentations, please expect Saturday and Sunday for updates and releases.

- [ ] Events Setup Documentation / new md file
- [ ] Redo Command and Slash Command Setup Documentation / new md file
- [ ] Modules Setup Documentation 
- [ ] config.js file Documentation
- [ ] More usage examples


## Documentation

### [DiscordFeaturesHandler Documentation](https://bng94.gitbook.io/discord-features-handler-docs/)

## Bug and Issues
If you found and bug and issues please [report the issue](https://github.com/bng94/discord-features-handler/issues) and provide steps to reproducible bugs/issues.

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

For bugs and feedbacks 

## License

[MIT](https://choosealicense.com/licenses/mit/)


