const { Client, Collection, Intents } = require("discord.js");
const DiscordFeaturesHandler = require("../src");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

DiscordFeaturesHandler(client, {
  // file path to your script file
  mainDirectory: __dirname,
  // file path and filename of your configuration file
  config: "./config.js",
  // bot token that can be found in your discord dev portal
  BOT_TOKEN: "YOUR_BOT_TOKEN",
  // optional: 
  // files we want to excludes when handler is invoked
  // files must be in their respective folders to work
  // commands files in their sub folders
  // events and modules files in their folder
  filesToExcludeInHandlers: {
    commands: ['ping.js']
  }
});
