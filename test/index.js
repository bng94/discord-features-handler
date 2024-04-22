const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { DiscordFeaturesHandler } = require("../src");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Channel, Partials.Reaction],
});

DiscordFeaturesHandler(client, {
  config: "./config.js",
  directories: {
    main: __dirname,
  },
  onLoad_list_files: {
    commands: true,
    events: true,
    modules: true,
  },
  filesToExcludeInHandlers: {
    commands: ["ping.js"],
  },
});
