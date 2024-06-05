---
description: >-
  This is the release notes log of all version history and changes made to discord-features-handler npm package

  
hide:
  - navigation
---

# Release Notes

## 2.1.2 - Latest Version

### Fix
- Removed type check for cmd.data which caused an error for commands missing data property.

### Chore
- Updated build scripts for npm publish 
  


## 2.1.1 

### Docs
- Add TypeScript Support page
- Update config page and removed  `modRole` and `adminRole` property 

### Refactor
- Removed `modRole` and `adminRole` from config file (These property has been replaced with roles object property).
- Add more errors check for command files.
- Refactored minArgs and maxArgs check.
- Reformated README.md and updated package.json file
- remove requirement of cmd aliases and updated types file

### Chore
- Updated build scripts for deployment 
  


## 2.1.0

### Docs

- Switched documentation from GitBook to GitHub Pages using MkDocs
- Included demo bot documentation into the new GitHub Pages documentation
- Refreshed the UI for a new look and feel of the discord-features-handler documentation

### Features

- Added `roles` as an object property into config file, `modRole` and `adminRole` are one two properties replacing `modRole` and `adminRole` property of config file
- Added `customIds` as an object property into command files, contains the following keys: `messageComponent`, `modal`, and `autoComplete`. The values are an array of strings containing the customIds for the respective interaction.
- Added `componentInteraction(interaction, client, level)` method property into command files, as an optional property for select menu and button interactions if you are not using`createMessageComponentCollector`.
- Added `autoCompleteInteraction(interaction, client, level)` method property into command files for handling auto complete interactions
- Added `contextMenuInteraction(interaction, client, level)` method property into command files for handling user context menu interactions
- Added `modalInteraction(interaction, client, level)` method property into command files for handling modalInteraction interactions

You will need to define the customIds property and use those ids name for the respective component in order for interactions to be handled.

## 2.0.2

### Patch:

- Fixed issue with missing JSDoc for config and env typos
- Fixed issue where compiled TypeScript code had problems loading module files

## 2.0.1

### Patch:

- Fixed issue where JSDoc was not showing in JavaScript code

## 2.0.0

### Feature:

- Upgraded to discord.js v14.9
- Revamped DiscordFeaturesHandlerOptions setup
  - Deprecated variables:
    - mainDirectory
    - commandDir
    - eventDir
    - modulesDir
    - BOT_TOKEN
      - Redefined in your .env file as DISCORD_TOKEN and token property in your config file
    - disableBuiltIn
    - loadCommandsLoggerOff
    - loadEventsLoggerOff
    - loadModulesLoggerOff
- Replaced `slash` and `slashOptions` property with `data` property to use DiscordJS SlashCommandBuilder to create slash commands
- Enabled developers to delete slash commands based on Ids
- Updated JSDoc documentation for easier readability by developers
- Supports TypeScript natively

### Documentation:

- Improved JSDoc and index.d.ts file for better readability and easier access in the developer IDE

## 1.1.2

### Feature/Fix:

- Updated interaction handler for isButton, isAutoComplete, isContextMenu, isModalSubmit with code that works for the respective interaction instead of a blank if statement. Implemented try/catch for these interactions to prevent bot crashes
  - Command properties for the interactionCreate event of interaction.isContextMenu or interaction.isUserContextMenu (discord.js v13):
    - contextMenuInteraction(interaction, client, level) is used to execute the interaction
  - Command properties for the interactionCreate event of interaction.isAutocomplete:
    - autoCompleteInteraction(interaction, client, level) is used to execute the interaction
  - Command properties for the interactionCreate event of interaction.isModalSubmit:
    - modalCustomId, for customId of a button interaction object
    - modalInteraction(interaction, client, level) is used to execute the interaction
  - Command properties for the interactionCreate event of interaction.isButton:
    - buttonCustomId, for customId of a button interaction object
    - buttonInteraction(interaction, client, level) is used to execute the interaction

## 1.1.1

### Documentation:

- Updated README file about the dev branch and folder structure, support, and notes sections
- Added code examples in the README file to help developers understand the structure better

### Fix:

- Reload command can now read the category folders when unloading and loading a command
- Improved console log messages when loading a slash command

## 1.1.0

### Feature:

- Disable the built-in unhandledRejection handler
  - The option parameter is `disableUnhandledRejectionHandler`, to disable unhandled promise rejection to prevent bot crashes. Default value is **false**.
- Turn off console log stating the filenames that are being loaded
  - The DiscordFeaturesHandler option parameter `loadCommandsLoggerOff` is used to turn off stating the filename of the command file being loaded. Default value is **false**.
  - The DiscordFeaturesHandler option parameter `loadEventsLoggerOff` is used to turn off stating the filename of the event file being loaded. Default value is **false**.
  - The DiscordFeaturesHandler option parameter `loadModulesLoggerOff` is used to turn off stating the filename of the module file being loaded. Default value is **false**.
- Reduced wait time before loading module files from 10 to 5 seconds
  - The DiscordFeaturesHandler option parameter `modulesPreloadTime` expected value is a number reflecting milliseconds. The default value is **500**.
- Added Array.prototype.random()
  - Allows getting a random element from an array, e.g., ['a','b','c','d','e'].random() returns any element at random

### Documentation:

- More inline documentation using JSDoc
  - Provides parameter descriptions and correct spelling when hovering or typing
- Updated README files with more demo code and detailed explanations

## 1.0.3

### Bug Fix:

- Fixed reload command, which was missing concatenation between the filename and .js when unloading the command

## 1.0.2

### Documentation:

- Updated README and JSDoc3 documentation
  - Longer README.md file for npmjs website, providing a quick start guide instead of full documentation
  - JSDoc displays details when hovering over property names after installing DiscordFeaturesHandler

## 1.0.1

### Patch Fix:

- DiscordFeaturesHandler can now be correctly imported without typing out import after installation

### Bug Fix:

- `disableProperties` was not implemented correctly

## 1.0.0

### Feature:

- Compatible with Heroku and other hosting services for Node.js code
- Ability to turn off console.log for stating what file is loaded on runtime
  - `loadCommandsLoggerOff` - type boolean
  - `loadEventsLoggerOff` - type boolean
  - `loadModulesLoggerOff` - type boolean
- Deprecated: `disableAllDefaults`, `disableDefaultHelpCmd`, `disableDefaultReloadCmd`, and `disableDefaultMessageCreate`
  - Use `disableBuiltIn` object instead

### Documentation:

- Complete documentation and definition of "official" release

## 0.13.11

### Fix:

- Fixed path to load commands file for Heroku/server-based hosting

## 0.13.10

### Fix:

- Find path of configuration file when using Heroku server

## 0.13.9

### New Object:

- Added `disableBuiltIn` object to DiscordFeaturesHandler options for disabling built-in features
- Deprecation warnings for `disableAllDefaults
- Bug Fix: Overriding default properties when new features were declared

## 0.13.7

### Patch Fix:

- Syntax error fix to re-enable ability to disable reload and messageCreate events

## 0.13.6

### Update:

- Updated command, events, modules handler from for loops to map and use of Promises
  - Handles module files load time better with async/await for basic files, such as loading MongoDB data into a channel on run

## 0.13.1

### Change:

- Changed property `filesToExcludeInHandlers` from an Array<String> to an object
- Property `filesToExcludeInHandlers` now contains object properties of `commands`, `events`, and `modules`, all optional Array<String>

## 0.13.0

### Removal:

- Removed requirement of defining folder property names, using default names instead:
  - Default Command Folder name as "commands"
  - Default Events Folder name as "events"
  - Default Modules Folder name as "modules"
- Updated README.md file

## 0.12.0

### Update:

- Updated README.md file and link to documentation for npmjs.com Readme page

## 0.11.1

### Update:

- Updated README.md file

## 0.11.0

### Rename:

- Revisited properties name and clarified naming conventions
  - `mainDir` => `mainDirectory`

## 0.10.0

### First Version:

- Launch of Discord Features Handler





