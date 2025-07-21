const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = ({
  client,
  directory = ["../commands/"],
  filesToExclude = [""],
  mainDirectory,
  logger,
  slashCommandIdsToDelete = [],
  onSlashCommandsLoading = {
    delete_global_slash_commands: false,
    delete_guild_slash_commands: false,
  },
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

  const deleteSlashCommands = async () => {
    const rest = new REST().setToken(client.config.token);
    const { clientId, guildId } = client.config;
    try {
      for (const id of slashCommandIdsToDelete) {
        await rest
          .delete(Routes.applicationCommand(clientId, id))
          .then(() =>
            console.log(`Successfully deleted slash command with ID: ${id}`)
          )
          .catch(console.error);
      }
    } catch (err) {
      console.error("Error deleting slash commands before loading:", err);
    }
  };
  (async () => {
    if (slashCommandIdsToDelete.length > 0) {
      await deleteSlashCommands();
    }
  })();

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
        if (onSlashCommandsLoading.delete_guild_slash_commands) {
          await rest
            .put(Routes.applicationGuildCommands(clientId, guildId), {
              body: [],
            })
            .then(() =>
              console.log(
                `Successfully deleted all guild commands before loading new ones.`
              )
            )
            .catch(console.error);
        }

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
        if (
          onSlashCommandsLoading.delete_global_slash_commands ||
          toDeleteSlashCommand
        ) {
          const deleteAction =
            toDeleteSlashCommand && typeof toDeleteSlashCommand === "string"
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
