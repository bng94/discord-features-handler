# discord-features-handler
An discord regular and slash commands, events and modules handler with folder structure

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)


## Installation

Install my-project with npm

```js
  npm install discord-features-handler
```
    
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


## Commands Handler & Setup

Upon setting up the discord-features-handler, you can now create the commands folder.

if you define it in ` commandDir: "commands"`, it should be called "commands",


# coming soon...

## Events Handler & Setup

Upon setting up the discord-features-handler, you can now create the commands folder.

if you define it in ` commandDir: "commands"`, it should be called "commands",


# coming soon...

## Modules Handler & Setup

Upon setting up the discord-features-handler, you can now create the commands folder.

if you define it in ` commandDir: "commands"`, it should be called "commands",


# coming soon...
