const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = ({
  client,
  directory = ["../commands/"],
  filesToExclude = [""],
  mainDirectory,
  logger,
}) => {
  const loadCommands = (dir) => {
    const builtInDirectory = dir.includes("../commands/");
    const dirname = builtInDirectory ? __dirname : mainDirectory;
    const commandFolders = fs.readdirSync(path.join(dirname, dir));
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(dirname, dir, folder))
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

      if (!builtInDirectory) {
        console.log(
          "[log]",
          "[CMD]",
          `Loading a total of ${commandFiles.length} commands from ${folder} folder.`
        );
      }
      commandFiles.forEach((file) => {
        if (filesToExclude.includes(file)) {
          console.log(`Command File Excluded: ${file}`);
          return;
        }

        try {
          const result = client.loadCommand({
            file: file,
            folder: folder,
            loadingMsg: logger,
            handler: true,
            defaultCommand: dirname !== mainDirectory,
          });
          if (result) console.log(result);
        } catch (e) {
          console.error(`Error loading command file ${file}: ${e.message}`);
        }
      });
    }
  };

  // Possible Feature: Delete all slash commands before loading new ones
  /*
  const rest = new REST().setToken(client.config.token);
  const { clientId, guildId } = client.config;
  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
      console.log("Successfully deleted all guild slash commands before loading new ones.");
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      console.log("Successfully deleted all global slash commands before loading new ones.");
    }
  } catch (err) {
    console.error("Error deleting slash commands before loading:", err);
  }
  */

  const loadingCommands = directory.map((dirs) => {
    loadCommands(dirs);
  });

  Promise.all(loadingCommands).then(async () => {
    const rest = new REST().setToken(client.config.token);
    const { clientId, guildId, toDeleteSlashCommand } = client.config;

    const slashCommandMap = new Map();
    client.commands.forEach((cmd) => {
      if (cmd.data && cmd.data.name) {
        slashCommandMap.set(cmd.data.name, cmd.data.toJSON());
      }
    });
    const slashCommands = Array.from(slashCommandMap.values());

    if (slashCommands.length === 0) return;

    try {
      console.log(
        `Started refreshing ${slashCommands.length} application (/) commands.`
      );
      if (guildId) {
        await rest
          .put(Routes.applicationGuildCommands(clientId, guildId), {
            body: [],
          })
          .then(() => console.log(`Successfully refreshed all guild commands.`))
          .catch(console.error);

        const data = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: slashCommands }
        );

        console.log(
          "[log]",
          "[Slash Commands]",
          `Successfully Loaded a total of ${data.length} slash commands.`
        );
      } else {
        if (toDeleteSlashCommand) {
          const deleteAction =
            typeof toDeleteSlashCommand === "string"
              ? rest.delete(
                  Routes.applicationGuildCommand(clientId, toDeleteSlashCommand)
                )
              : rest.put(Routes.applicationCommands(clientId), { body: [] });

          deleteAction
            .then(() =>
              console.log(
                `Successfully deleted ${
                  typeof toDeleteSlashCommand === "string"
                    ? "specific guild command"
                    : "all application commands"
                }.`
              )
            )
            .catch(console.error);
        }
        const data = await rest.put(Routes.applicationGuildCommands(clientId), {
          body: slashCommands,
        });

        console.log(
          "[log]",
          "[Slash Commands]",
          `Successfully Loaded a total of ${data.length} Global slash commands.`
        );
      }
    } catch (error) {
      console.error("[Error log]", "[Slash Commands]", `error`);
    }
  });
};
