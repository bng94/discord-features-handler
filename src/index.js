require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("discord.js");
const loadCommands = require("./handlers/loadCommands.js");
const loadEvents = require("./handlers/loadEvents.js");
const loadModules = require("./handlers/loadModules.js");
const functions = require("./modules/functions.js");
const UnhandledRejection = require("./modules/UnhandledRejection.js");
const { configureClient } = require("./utils/clientUtils.js");
const { checkConfig } = require("./utils/configUtils.js");

const BUILT_IN_FILES = {
  disable_all: false,
  commands: {
    help: false,
    reload: false,
  },
  events: {
    messageCreate: false,
    interactionCreate: false,
  },
};

const LOG_FILES = {
  commands: false,
  events: false,
  modules: false,
};

const DEFAULT_DIRECTORIES = {
  main: ".",
  commands: "commands",
  events: "events",
  modules: "modules",
};

const DiscordFeaturesHandler = async (
  client,
  {
    config = "./defaultConfig.js",
    directories = {
      commands: "commands",
      events: "events",
      modules: "modules",
    },
    builtin_files = {
      commands: {
        help: false,
        reload: false,
      },
      events: {
        messageCreate: false,
        interactionCreate: false,
      },
    },
    onLoad_list_files = {
      commands: false,
      events: false,
      modules: false,
    },
    slashCommandIdsToDelete = [],
    onSlashCommandsLoading = {
      delete_global_slash_commands: false,
      delete_guild_slash_commands: false,
    },
    disableUnhandledRejectionHandler = false,
    modulesPreloadTime = 500,
    filesToExcludeInHandlers = {
      commands: [""],
      events: [""],
      modules: [""],
    },
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
    ...BUILT_IN_FILES,
    ...builtin_files,
  };
  directories = {
    ...DEFAULT_DIRECTORIES,
    ...directories,
  };

  onLoad_list_files = {
    ...LOG_FILES,
    ...onLoad_list_files,
  };

  if (!directories.main) {
    throw new TypeError(
      `mainDirectory declaration is required: Value is: \'mainDirectory: __dirname,\'`
    );
  } else if (!fs.lstatSync(directories.main).isDirectory()) {
    throw new TypeError(`mainDirectory must have the value of: \'__dirname\'`);
  }

  if (!client) {
    throw new Error("No Discord JS Client provided as first argument!");
  } else if (client instanceof Client === false) {
    throw new TypeError(`client is not a valid discord.js Client Object`);
  }

  if (
    typeof disableProperties.disable_all !== "boolean" &&
    typeof disableProperties.commands === "undefined" &&
    typeof disableProperties.events === "undefined"
  ) {
    throw new TypeError(`builtin_files properties must be an boolean Value`);
  }

  if (typeof disableUnhandledRejectionHandler !== "boolean") {
    throw new TypeError(
      `disableUnhandledRejectionHandler must be a boolean value`
    );
  }

  if (typeof modulesPreloadTime !== "number") {
    throw new TypeError(`modulesPreloadTime is not a valid number value`);
  }

  if (typeof onLoad_list_files.commands !== "boolean") {
    throw new TypeError(`onLoad_list_files.commands must be a boolean value`);
  }

  if (typeof onLoad_list_files.events !== "boolean") {
    throw new TypeError(`onLoad_list_files.events must be a boolean value`);
  }

  if (typeof onLoad_list_files.modules !== "boolean") {
    throw new TypeError(`onLoad_list_files.modules must be a boolean value`);
  }

  if (
    !Array.isArray(slashCommandIdsToDelete) ||
    !slashCommandIdsToDelete.every((id) => typeof id === "string")
  ) {
    console.warn(
      "slashCommandIdsToDelete should be an array of strings representing slash command IDs"
    );
    slashCommandIdsToDelete = [];
  }

  if (typeof process.env.DISCORD_TOKEN === "undefined") {
    throw new Error(
      "Environment variable DISCORD_TOKEN is undefined, your bot secret token"
    );
  }
  if (typeof process.env.OWNER_ID === "undefined") {
    throw new Error(
      "Environment variable OWNER_ID is undefined, your discord user Id"
    );
  }
  if (typeof process.env.CLIENT_ID === "undefined") {
    throw new Error(
      `Environment variable CLIENT_ID is undefined, You can find it by going to Discord Developer Portal > "General Information" > application id)`
    );
  }

  if (!disableUnhandledRejectionHandler) {
    UnhandledRejection();
  }

  functions();

  console.log(`Thank you for installing DiscordFeaturesHandler!`);
  console.log(`Loading your files now...`);

  const configFile = config.endsWith("./defaultConfig.js")
    ? require(config)
    : require(path.join(directories.main, config));

  await checkConfig(configFile);
  client = configureClient(client, configFile, directories);

  if (disableProperties.disable_all) {
    commandsExcluded.push("dfhHelp.js");
    commandsExcluded.push("dfhReload.js");
    eventsExcluded.push("dfhMessageCreate.js");
    eventsExcluded.push("dfhInteractionCreate.js");
  } else {
    if (disableProperties.commands) {
      if (disableProperties.commands.help) {
        commandsExcluded.push("dfhHelp.js");
      }
      if (disableProperties.commands.reload) {
        commandsExcluded.push("dfhReload.js");
      }
    }
    if (disableProperties.events) {
      if (disableProperties.events.messageCreate) {
        eventsExcluded.push("dfhMessageCreate.js");
      }
      if (disableProperties.events.interactionCreate) {
        eventsExcluded.push("dfhInteractionCreate.js");
      }
    }
  }

  const disableDefaultCommands =
    disableProperties.disable_all ||
    (disableProperties.commands &&
      disableProperties.commands.help &&
      disableProperties.commands.reload);
  const disableDefaultEvents =
    disableProperties.disable_all ||
    (disableProperties.events &&
      disableProperties.events.interactionCreate &&
      disableProperties.events.messageCreate);

  const commandDirectories = disableDefaultCommands
    ? [directories.commands]
    : ["../commands/", directories.commands];

  const eventDirectories = disableDefaultEvents
    ? [directories.events]
    : ["../events/", directories.events];

  loadCommands({
    client,
    directory: commandDirectories,
    filesToExclude: commandsExcluded,
    mainDirectory: directories.main,
    logger: onLoad_list_files.commands,
    slashCommandIdsToDelete,
    onSlashCommandsLoading,
  });
  loadEvents({
    client,
    directory: eventDirectories,
    filesToExclude: eventsExcluded,
    mainDirectory: directories.main,
    logger: onLoad_list_files.events,
  });

  for (let i = 0; i < client.config.permissions.length; i++) {
    const thisLevel = client.config.permissions[i];
    client.levelCache[thisLevel.name.toString()] = thisLevel.level;
  }

  client.login(client.config.token).catch((e) => {
    console.warn(e);
    throw new Error(
      `Please check if your discord bot token is valid! The token should be defined in config.token`
    );
  });
  await client.wait(modulesPreloadTime);

  loadModules({
    client,
    directory: [directories.modules],
    filesToExclude: modulesExcluded,
    mainDirectory: directories.main,
    logger: onLoad_list_files.modules,
  });
};

exports.DiscordFeaturesHandler = DiscordFeaturesHandler;
