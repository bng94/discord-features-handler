const fs = require("fs");
const { Client, Collection } = require("discord.js");
const loadCommands = require("./handlers/loadCommands.js");
const loadEvents = require("./handlers/loadEvents.js");
const loadModules = require("./handlers/loadModules.js");
const functions = require("./modules/dfhFunctions.js");

const DiscordFeaturesHandler = async (
  client,
  {
    config = "./defaultConfig.js",
    mainDirectory = "",
    commandDir = "commands",
    eventDir = "events",
    modulesDir = "modules",
    disableAllDefaults = false,
    disableDefaultHelpCmd = false,
    disableDefaultReloadCmd = false,
    disableDefaultMessageCreate = false,
    filesToExcludeInHandlers = [""],
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
  functions(client);
  await client.wait(10000);
  client.config = config.endsWith("./defaultConfig.js")
    ? require(config)
    : require(`${mainDirectory}\\${config.replaceAll("/", "\\")}`);
  client.commands = new Collection();
  client.aliases = new Collection();

  client.dfhSettings = { mainDirectory, commandDir };

  const disableDefaultCommands =
    disableAllDefaults || (disableDefaultHelpCmd && disableDefaultReloadCmd);
  const disableDefaultEvents =
    disableAllDefaults || disableDefaultMessageCreate;

  if (disableDefaultHelpCmd && !disableDefaultCommands) {
    filesToExcludeInHandlers.push("dfhHelp.js");
  }
  if (disableDefaultReloadCmd && !disableDefaultCommands) {
    filesToExcludeInHandlers.push("dfhReload.js");
  }
  if (disableDefaultMessageCreate && !disableDefaultEvents) {
    filesToExcludeInHandlers.push("dfhMessageCreate.js");
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
    filesToExcludeInHandlers,
    mainDirectory
  );
  loadEvents(client, eventDirectories, filesToExcludeInHandlers, mainDirectory);

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
    filesToExcludeInHandlers,
    mainDirectory
  );
};

module.exports = DiscordFeaturesHandler;
