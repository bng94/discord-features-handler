const fs = require("fs");
const path = require("path");
const { Client, Collection } = require("discord.js");
const loadCommands = require("./handlers/loadCommands.js");
const loadEvents = require("./handlers/loadEvents.js");
const loadModules = require("./handlers/loadModules.js");
const functions = require("./modules/dfhFunctions.js");

const disablesObject = {
  allBuiltIn: false,
  commands: {
    help: false,
    reload: false,
  },
  events: {
    messageCreate: false,
    interactionCreate: false,
    loadSlashCommandsReady: false,
  },
};
/**
 * DiscordFeaturesHandler that handles loading bot commands, discord events and modules files
 * @function DiscordFeaturesHandler
 * @param {Client} client - [Discord Client Object](https://discord.js.org/#/docs/discord.js/stable/class/Client)
 * @param {Object} options - DiscordFeaturesHandler configuration object 
 * @param {string} options.config Path to your configuration file, where you can define your bot commands permission levels, bot supports, admins, and bot owner IDs
 * @param {string} options.mainDirectory The path to your bot start script file. 
 * 
 * Expected value: **__dirname**
 * @param {string} options.commandDir This is the folder name that contains sub folders that contains your bot commands file. 
 * 
 * Default Folder Name: **commands**
 * @param {string} options.eventDir  This is the folder name that contains your discord event files. 
 * 
 * Default Folder Name: **events**
 * @param {string} options.modulesDir This is the folder name for your modules.export files. 
 * 
 * Default Folder Name: **modules**
 * @param {Object} options.disableBuiltIn Object to define what built-in commands and events to disable
 * @param {bool} options.disableBuiltIn.allBuiltIn Bool to disable all built-in commands and discord events
 * @param {Object} options.disableBuiltIn.commands Object to contain defined built-in command name to disable
 * @param {bool} options.disableBuiltIn.commands.help Bool to disable the built-in help command 
 * @param {bool} options.disableBuiltIn.commands.reload Bool to disable the built-in reload command 
 * @param {Object} options.disableBuiltIn.events Object to contain defined built-in discord event name to disable
 * @param {bool} options.disableBuiltIn.events.messageCreate Boolean to disable built-in discord messageCreate event to handle your bot commands execution
 * @param {bool} options.disableBuiltIn.events.interactionCreate Boolean to disable built-in discord interactionCreate event to handle your bot slash commands execution
 * @param {bool} options.disableBuiltIn.events.loadSlashCommandsReady Boolean to disable built-in discord ready event to handle and load your slash commands
 * @param {bool} options.loadCommandsLoggerOff Disable load command: filename.js console.log message
 * @param {bool} options.loadEventsLoggerOff Disable load event: filename.js console.log message
 * @param {bool} options.loadModulesLoggerOff Disable load module: filename.js console.log message
 * @param {Object} options.filesToExcludeInHandlers Object to contain filename and file extension name of files to not load with handler
 * @param {Array<string>} options.filesToExcludeInHandlers.commands Array of strings of command files to not load when this handler runs 
 * @param {Array<string>} options.filesToExcludeInHandlers.events Array of strings of event files to not load when this handler runs 
 * @param {Array<string>} options.filesToExcludeInHandlers.modules Array of strings of module files to not load when this handler runs 
 * @param {String} options.BOT_TOKEN Your Discord Bot token found in [Discord Developer Portal](https://discordapp.com/developers/applications/)
 */

const DiscordFeaturesHandler = async (
  client,
 {
    config = "./defaultConfig.js",
    mainDirectory = "",
    commandDir = "commands",
    eventDir = "events",
    modulesDir = "modules",
    disableBuiltIn = {
      allBuiltIn: false,
      commands: {
        help: false,
        reload: false,
      },
      events: {
        messageCreate: false,
        interactionCreate: false,
        loadSlashCommandsReady: false,
      },
    },
    loadCommandsLoggerOff = false,
    loadEventsLoggerOff = false,
    loadModulesLoggerOff = false,
    filesToExcludeInHandlers = {
      commands: [""],
      events: [""],
      modules: [""],
    },
    BOT_TOKEN,
  }
) => {
  const commandsExcluded = filesToExcludeInHandlers.commands
    ? filesToExcludeInHandlers.commands
    : [""];
  const eventsExcluded = filesToExcludeInHandlers.events
    ? filesToExcludeInHandlers.events
    : [""];
  const modulesExcluded = filesToExcludeInHandlers.modules
    ? filesToExcludeInHandlers.modules
    : [""];

  const disableProperties = {
    ...disablesObject,
    ...disableBuiltIn,
  };

  if (!client) {
    throw new Error("No Discord JS Client provided as first argument!");
  } else if (client instanceof Client === false) {
    throw new TypeError(`client is not a valid discord.js Client Object`);
  }

  if (!BOT_TOKEN) {
    throw new TypeError("Discord Bot Token is undefined");
  }

  if (!mainDirectory) {
    throw new TypeError(
      `mainDirectory declaration is required: Value is: \'mainDirectory: __dirname,\'`
    );
  } else if (!fs.lstatSync(mainDirectory).isDirectory()) {
    throw new TypeError(`mainDirectory must have the value of: \'__dirname\'`);
  }

  if (
    typeof disableProperties.allBuiltIn !== "boolean" &&
    typeof disableProperties.commands.help !== "boolean" &&
    typeof disableProperties.commands.reload !== "boolean" &&
    typeof disableProperties.events.interactionCreate !== "boolean" &&
    typeof disableProperties.events.messageCreate !== "boolean" &&
    typeof disableProperties.events.loadSlashCommandsReady !== "boolean"
  ) {
    throw new TypeError(
      `disableBuiltIn Object properties must be an boolean Value`
    );
  }

  if (typeof loadCommandsLoggerOff !== "boolean") {
    throw new TypeError(
      `loadCommandsLoggerOff must be a boolean value`
    );
  }

  if (typeof loadEventsLoggerOff !== "boolean") {
    throw new TypeError(
      `loadEventsLoggerOff must be a boolean value`
    );
  }
  
  if (typeof loadModulesLoggerOff !== "boolean") {
    throw new TypeError(
      `loadModulesLoggerOff must be a boolean value`
    );
  }

  console.log(`Thank you for installing DiscordFeaturesHandler!`);
  console.log(`Loading your files now...
  `);

  functions(client);
  await client.wait(10000);
  client.config = config.endsWith("./defaultConfig.js")
    ? require(config)
    : require(path.join(mainDirectory, config));
  client.commands = new Collection();
  client.aliases = new Collection();

  client.dfhSettings = {
    mainDirectory,
    commandDir
  };

  //Disable all built in commands and events
  if (disableProperties.allBuiltIn) {
    commandsExcluded.push("dfhHelp.js");
    commandsExcluded.push("dfhReload.js");
    eventsExcluded.push("dfhMessageCreate.js");
    eventsExcluded.push("dfhInteractionCreate.js");
    eventsExcluded.push("dfhSlashCommands.js");
  } else {
    if (disableProperties.commands.help) {
      commandsExcluded.push("dfhHelp.js");
    }
    if (disableProperties.commands.reload) {
      commandsExcluded.push("dfhReload.js");
    }
    if (disableProperties.events.messageCreate) {
      eventsExcluded.push("dfhMessageCreate.js");
    }
    if (disableProperties.events.interactionCreate) {
      eventsExcluded.push("dfhInteractionCreate.js");
    }
    if (disableProperties.events.loadSlashCommandsReady) {
      eventsExcluded.push("dfhSlashCommands.js");
    }
  }

  const disableDefaultCommands =
    disableProperties.allBuiltIn ||
    (disableProperties.commands.help && disableProperties.commands.reload);
  const disableDefaultEvents =
    disableProperties.allBuiltIn ||
    (disableProperties.events.interactionCreate &&
      disableProperties.events.messageCreate &&
      disableProperties.events.loadSlashCommandsReady);

  const commandDirectories = disableDefaultCommands
    ? [commandDir]
    : ["../commands/", commandDir];

  const eventDirectories = disableDefaultEvents
    ? [eventDir]
    : ["../events/", eventDir];

  loadCommands(
    client,
    commandDirectories,
    commandsExcluded,
    mainDirectory,
    loadCommandsLoggerOff
  );
  loadEvents(
    client,
    eventDirectories,
    eventsExcluded,
    mainDirectory,
    loadEventsLoggerOff
  );

  client.levelCache = {};
  for (let i = 0; i < client.config.permissions.length; i++) {
    const thisLevel = client.config.permissions[i];
    client.levelCache[thisLevel.name.toString()] = thisLevel.level;
  }

  client.login(BOT_TOKEN).catch(e => {
    console.warn(e);
    throw new Error(`Please check if your discord bot token is valid!`);
  });
  await client.wait(10000);
  loadModules(
    client,
    ["../modules", modulesDir],
    modulesExcluded,
    mainDirectory,
    loadModulesLoggerOff
  );
};

module.exports = DiscordFeaturesHandler;
