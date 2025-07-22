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
    if (!clientId) {
      console.error("[log]", "[Slash CMDs]", "Client ID is not defined.");
      return;
    }

    try {
      slashCommandIdsToDelete.map(async (id) => {
        await rest
          .delete(Routes.applicationCommand(clientId, guildId, id))

          .then(() =>
            console.log(
              "[log]",
              "[Slash CMDs]",
              `Successfully deleted slash command with ID: ${id}`
            )
          )
          .catch((e) => {
            console.error(
              "[log]",
              "[Slash CMDs]",
              `Failed to delete slash command with ID: ${id}`,
              e.message
            );
          });
      });
    } catch (err) {
      console.error(
        "[log]",
        "[Slash CMDs]",
        "Error deleting slash commands before loading:",
        err
      );
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

    const slashCommands = [];
    client.commands.forEach((cmd) => {
      if ("data" in cmd && "interactionReply" in cmd) {
        slashCommands.push(cmd.data.toJSON());
      }
    });

    if (slashCommands.length === 0) {
      console.log("[log]", "[Slash CMDs]", "No slash commands to load.");
      return;
    }

    try {
      if (guildId) {
        if (onSlashCommandsLoading.delete_guild_slash_commands === true) {
          console.log(
            "[log]",
            "[Slash CMDs]",
            "Started deleting guild slash commands..."
          );

          await rest
            .put(Routes.applicationGuildCommands(clientId, guildId), {
              body: [],
            })
            .then(() =>
              console.log(
                "[log]",
                "[Slash CMDs]",
                `Successfully deleted all guild commands before loading new ones.`
              )
            )
            .catch(console.error);
        }

        console.log(
          "[log]",
          "[Slash CMDs]",
          `Loading ${slashCommands.length} guild slash commands...`
        );
        const data = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: slashCommands }
        );

        console.log(
          "[log]",
          "[Slash CMDs]",
          `Successfully Loaded a total of ${data.length} slash commands.`
        );
      } else {
        if (
          onSlashCommandsLoading.delete_global_slash_commands === true ||
          toDeleteSlashCommand
        ) {
          console.log(
            "[log]",
            "[Slash CMDs]",
            "Started deleting global slash commands..."
          );
          const deleteAction =
            toDeleteSlashCommand && typeof toDeleteSlashCommand === "string"
              ? rest.delete(
                  Routes.applicationGuildCommand(clientId, toDeleteSlashCommand)
                )
              : rest.put(Routes.applicationCommands(clientId), { body: [] });

          deleteAction
            .then(() =>
              console.log(
                "[log]",
                "[Slash CMDs]",
                `Successfully deleted ${
                  typeof toDeleteSlashCommand === "string"
                    ? "specific guild command"
                    : "all application commands"
                }.`
              )
            )
            .catch(console.error);
        }
        console.log(
          "[log]",
          "[Slash CMDs]",
          `Loading ${slashCommands.length} global slash commands...`
        );
        const data = await rest.put(Routes.applicationGuildCommands(clientId), {
          body: slashCommands,
        });

        console.log(
          "[log]",
          "[Slash CMDs]",
          `Successfully Loaded a total of ${data.length} Global slash commands.`
        );
      }
    } catch (error) {
      console.error("[Error log]", "[Slash CMDs]", `error`);
    }
  });
};
