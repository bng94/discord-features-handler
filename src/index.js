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

const DiscordFeaturesHandler = async (
  client,
  {
    /**
     * Configuration file for bot support,admin, and owner Ids and cmd permissions levels
     */
    config = "./defaultConfig.js",
    /**
     * mainDirectory value should always be: __dirname
     * parent folder of your start script file
     */
    mainDirectory = "",
    /**
     * The parent folder name that contains folders of discord bot command files
     */
    commandDir = "commands",
    /**
     * The folder name that contains your discord bot event files
     */
    eventDir = "events",
    /**
     * the folder name that contains your module.exports files
     */
    modulesDir = "modules",
    /**
     * object that contains boolean variables for built-in features to disable. Default: false
     */
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

  //disable all built in commands and events
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
    console.warn(e)
    throw new Error(`Please check if your discord bot token is valid!`)
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
