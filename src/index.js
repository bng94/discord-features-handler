const fs = require("fs");
const { Client, Collection } = require("discord.js");
const loadCommands = require("./handlers/loadCommands.js");
const loadEvents = require("./handlers/loadEvents.js");
const loadModules = require("./handlers/loadModules.js");
const functions = require("./modules/dfhFunctions.js");

const DiscordFeaturesHandler = async (
  client,
  {
    /**
     * Configuration file for bot support,admin, and owner Ids and cmd permissions levels
     */
    config = "./defaultConfig.js",
    /**
     * mainDirectory value should always be: __dirname
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

    // DEPRECATION WARNING: Use disableBuiltIn.allBuiltIn instead
    disableAllDefaults = false,
    // DEPRECATION WARNING: Use disableBuiltIn.commands.help instead
    disableDefaultHelpCmd = false,
    // DEPRECATION WARNING: Use disableBuiltIn.commands.reload instead
    disableDefaultReloadCmd = false,
    // DEPRECATION WARNING: Use disableBuiltIn.events.messageCreate instead
    disableDefaultMessageCreate = false,
    filesToExcludeInHandlers = {
      commands: [""],
      events: [""],
      modules: [""],
    },
    BOT_TOKEN,
  }
) => {
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
    typeof disableAllDefaults !== "boolean" &&
    typeof disableDefaultHelpCmd !== "boolean" &&
    typeof disableDefaultReloadCmd !== "boolean" &&
    typeof disableDefaultMessageCreate !== "boolean"
  ) {
    throw new TypeError(`Disable properties must be a type of Boolean`);
  }

  if (
    typeof disableBuiltIn.allBuiltIn !== "boolean" &&
    typeof disableBuiltIn.commands.help !== "boolean" &&
    typeof disableBuiltIn.commands.reload !== "boolean" &&
    typeof disableBuiltIn.events.interactionCreate !== "boolean" &&
    typeof disableBuiltIn.events.messageCreate !== "boolean" &&
    typeof disableBuiltIn.events.loadSlashCommandsReady !== "boolean"
  ) {
    throw new TypeError(
      `disableBuiltIn Object properties must be an Boolean Value`
    );
  }

  console.log(`DiscordFeaturesHandler is starting...
  `);

  functions(client);
  await client.wait(10000);
  client.config = config.endsWith("./defaultConfig.js")
    ? require(config)
    : require(`${mainDirectory}\\${config.replaceAll("/", "\\")}`);
  client.commands = new Collection();
  client.aliases = new Collection();

  client.dfhSettings = {
    mainDirectory,
    commandDir
  };

  //disable all built in commands and events
  if (disableBuiltIn.allBuiltIn) {
    filesToExcludeInHandlers.commands.push("dfhHelp.js");
    filesToExcludeInHandlers.commands.push("dfhReload.js");
    filesToExcludeInHandlers.events.push("dfhMessageCreate.js");
    filesToExcludeInHandlers.events.push("dfhInteractionCreate.js");
    filesToExcludeInHandlers.events.push("dfhSlashCommands.js");
  } else {
    if (disableBuiltIn.commands.help) {
      filesToExcludeInHandlers.commands.push("dfhHelp.js");
    }
    if (disableBuiltIn.commands.reload) {
      filesToExcludeInHandlers.commands.push("dfhReload.js");
    }
    if (disableBuiltIn.events.messageCreate) {
      filesToExcludeInHandlers.events.push("dfhMessageCreate.js");
    }
    if (disableBuiltIn.events.interactionCreate) {
      filesToExcludeInHandlers.events.push("dfhInteractionCreate.js");
    }
    if (disableBuiltIn.events.loadSlashCommandsReady) {
      filesToExcludeInHandlers.events.push("dfhSlashCommands.js");
    }
  }

  const disableDefaultCommands =
    disableBuiltIn.allBuiltIn ||
    (disableBuiltIn.commands.help && disableBuiltIn.commands.reload) ||
    disableAllDefaults ||
    (disableDefaultHelpCmd && disableDefaultReloadCmd);
  const disableDefaultEvents =
    disableBuiltIn.allBuiltIn ||
    (disableBuiltIn.events.interactionCreate &&
      disableBuiltIn.events.messageCreate &&
      disableBuiltIn.events.loadSlashCommandsReady) ||
    disableAllDefaults ||
    disableDefaultMessageCreate;

  if (disableAllDefaults)
    console.warn(`DEPRECATION WARNING: disableAllDefaults deprecated in next update
     Use disableBuiltIn.allBuiltIn instead`);
  if (disableDefaultHelpCmd && !disableDefaultCommands) {
    console.log(`DEPRECATION WARNING: disableDefaultHelpCmd deprecated in next update
     Use disableBuiltIn.commands.help instead`);
    filesToExcludeInHandlers.commands.push("dfhHelp.js");
  }
  if (disableDefaultReloadCmd && !disableDefaultCommands) {
    console.log(`DEPRECATION WARNING: disableDefaultReloadCmd deprecated in next update
    Use disableBuiltIn.commands.reload instead`
    );
    filesToExcludeInHandlers.commands.push("dfhReload.js");
  }
  if (disableDefaultMessageCreate && !disableDefaultEvents) {
    console.log(`DEPRECATION WARNING: disableDefaultMessageCreate deprecated in next update
    Use disableBuiltIn.events.messageCreate instead`
    );
    filesToExcludeInHandlers.events.push("dfhMessageCreate.js");
  }
  const commandDirectories = disableDefaultCommands
    ? [commandDir]
    : ["../commands/", commandDir];
  const eventDirectories = disableDefaultEvents
    ? [eventDir]
    : ["../events/", eventDir];

  loadCommands(
    client,
    commandDirectories,
    filesToExcludeInHandlers.commands,
    mainDirectory
  );
  loadEvents(
    client,
    eventDirectories,
    filesToExcludeInHandlers.events,
    mainDirectory
  );

  client.levelCache = {};
  for (let i = 0; i < client.config.permissions.length; i++) {
    const thisLevel = client.config.permissions[i];
    client.levelCache[thisLevel.name.toString()] = thisLevel.level;
  }

  client.login(BOT_TOKEN);
  await client.wait(10000);
  loadModules(
    client,
    ["../modules", modulesDir],
    filesToExcludeInHandlers.modules,
    mainDirectory
  );
};

module.exports = DiscordFeaturesHandler;
