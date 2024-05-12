# Bot Script File

Here is a sample of your index file, to get your discord bot up and running. Assuming you have followed the installation guide, folder structure and have setup your `.env` file correctly.

=== "JS"
      ```javascript title="index.js"
      require("dotenv").config();

      const { Client, GatewayIntentBits, Partials } = require("discord.js");
      const { DiscordFeaturesHandler } = require("discord-features-handler");

      const client = new Client({
      intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
        ],
        partials: [Partials.Channel, Partials.Channel],
      });

      DiscordFeaturesHandler(client, {
        config: "./config.js", // configuration file
        directories: {
          main: __dirname, // local path to your index.js file
        },
      });

      ```
=== "TS" 
      ```typescript title="index.ts"
      import dotenv from "dotenv";
      dotenv.config();

      import { Client, GatewayIntentBits, Partials } from "discord.js";
      import { DiscordFeaturesHandler } from "discord-features-handler";

      const client = new Client({
      intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
        ],
        partials: [Partials.Channel, Partials.Channel],
      });

      DiscordFeaturesHandler(client, {
        config: "./config", // configuration file
        directories: {
          main: __dirname, // local path to your index.js file
        },
      });

      ```
