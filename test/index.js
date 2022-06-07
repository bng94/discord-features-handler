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
  config: "./config.js",
  mainDirectory: __dirname,
  commandDir: "commands",
  eventDir: "events",
  modulesDir: "modules",
  BOT_TOKEN: "YOUR_BOT_TOKEN",
});
