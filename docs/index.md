---
hide:
  - navigation
  - toc
  
---

# discord-features-handler  
DiscordFeaturesHandler is a handler for Discord.js commands, slash commands, and discord events

[![npm version](https://img.shields.io/npm/v/discord-features-handler?color=blue)](https://www.npmjs.com/package/discord-features-handler) 
[![npm downloads](https://img.shields.io/npm/dt/discord-features-handler.svg?maxAge=3600)](https://www.npmjs.com/package/discord-features-handler)

<strong> Source Code: </strong>[https://github.com/bng94/discord-features-handler](https://github.com/bng94/discord-features-handler)

<strong> Changelog: </strong> [Release Notes](release-notes.md)

<hr/>

**discord-features-handler** allows you to follow the Discord.js guide with a few changes, such as using a JavaScript file instead of a JSON file for the `config` file, using the `interactionReply` function instead of `execute` for slash commands, and without creating your own handler for loading commands and events file. This package also supports TypeScript natively, so you can create your bot in JavaScript or TypeScript, based on your preferences.

 Some key Features are: 

- **Loads Commands File**
- **Loads Events File**
- **Pre-built messageCreate event to run commands call**
- **Pre-built interactionCreate event to run slash commands call**
- **String.prototype.toProperCase()**: returns a capitalization String function for words in a sentence format.
- **Array.random()**: returns a random element of an Array.

<hr/>

You do not need to worry about how to handle and make a command or event run. This package provides a well-versed, all-around handler to create your Discord.js bot. This ensures that all your event, command, and module files are loaded without worrying about how to run these files. The only focus should be on what commands, events, and their functionality you should have for your bot.&#x20;



<div class="grid cards" markdown>

- :fontawesome-solid-earth-americas: __[Want to jump right in?]__ - Feeling like an eager beaver? Starting by installing the package and setup the folder structure and layout


- :material-page-layout-sidebar-left: __[Want to deep dive?]__ – Dive a little deeper by starting with configuring DiscordFeaturesHandlerOptions
- :material-page-layout-header: __[Setting up DiscordJS Events]__ – Create your DiscordJS events to listen for events to handled
- :material-page-layout-footer: __[Setting up Commands Files]__ – Create your command files for your DiscordJS bot and allow users to interact with the bot.
- :material-tab-search: __[Setting up your bot permissions]__ – Set up and configure your bot permissions for what  a user can use with your bot.

</div>

[Want to jump right in?]:getting-started/installation.md
[Want to deep dive?]: setup/DiscordFeaturesHandlerOptions.md
[Setting up DiscordJS Events]: setup/events-file.md
[Setting up Commands Files]: setup/commands-file.md
[Setting up your bot permissions]: setup/config-file.md


## Bugs / Support / Suggestions

If you encounter a problem with the bot, please [ file an issue](https://github.com/bng94/discord-features-handler/issues/new).

When reporting an issue, please include the following details:

- Steps to reproduce the issue
- Expected behavior
- Actual (unexpected) behavior
- Any relevant screenshots or logs

Your detailed report will help us resolve the issue as quickly as possible. 

Feel free to submit a pull request if you have any suggestions or improvements.