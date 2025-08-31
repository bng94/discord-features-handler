const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = ({
  client,
  directory = ["../commands/"],
  filesToExclude = [""],
  mainDirectory,
  logger,
  slashCommandIdsToDelete = {
    global: [],
    guild: [],
  },
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
    const rest = new REST({
      timeout: 30000,
      retries: 3,
    }).setToken(client.config.token);
    const { clientId, guildId } = client.config;
    if (!clientId) {
      console.error("[log]", "[Slash CMDs]", "Client ID is not defined.");
      return;
    }

    try {
      if (slashCommandIdsToDelete.global.length > 0) {
        slashCommandIdsToDelete.global.map(async (id) => {
          await rest
            .delete(Routes.applicationCommand(clientId, id))

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
      }
      if (slashCommandIdsToDelete.guild.length > 0) {
        slashCommandIdsToDelete.guild.map(async (id) => {
          await rest
            .delete(Routes.applicationGuildCommand(clientId, guildId, id))
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
      }
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
    if (
      (slashCommandIdsToDelete.global &&
        slashCommandIdsToDelete.global.length > 0) ||
      (slashCommandIdsToDelete.guild &&
        slashCommandIdsToDelete.guild.length > 0)
    ) {
      await deleteSlashCommands();
    }
  })();

  const loadingCommands = directory.map((dirs) => {
    loadCommands(dirs);
  });

  Promise.all(loadingCommands).then(async () => {
    const rest = new REST({
      timeout: 30000,
      retries: 3,
    }).setToken(client.config.token);
    const { clientId, guildId, toDeleteSlashCommand } = client.config;

    const slashCommands = [];
    const globalSlashCommands = [];

    client.commands.forEach((cmd) => {
      if ("data" in cmd && ("interactionReply" in cmd || "execute" in cmd)) {
        if ("global" in cmd && cmd.global === true) {
          globalSlashCommands.push(cmd.data.toJSON());
        } else {
          slashCommands.push(cmd.data.toJSON());
        }
      }
    });

    if (slashCommands.length === 0) {
      console.log("[log]", "[Slash CMDs]", "No slash commands to load.");
      return;
    }

    try {
      if (guildId && slashCommands.length > 0) {
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

        // Check if commands actually need updating
        console.log(
          "[log]",
          "[Slash CMDs]",
          "Checking if commands need updating..."
        );

        try {
          const existingCommands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
          );

          // Filter to only THIS bot's commands
          const myExistingCommands = existingCommands.filter(
            (cmd) => cmd.application_id === clientId
          );

          // Create comparison objects
          const existingCommandData = myExistingCommands
            .map((cmd) => ({
              name: cmd.name,
              description: cmd.description,
              options: cmd.options || [],
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          const newCommandData = slashCommands
            .map((cmd) => ({
              name: cmd.name,
              description: cmd.description,
              options: cmd.options || [],
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          // Deep comparison
          const commandsChanged =
            JSON.stringify(existingCommandData) !==
            JSON.stringify(newCommandData);

          if (commandsChanged) {
            console.log(
              "[log]",
              "[Slash CMDs]",
              `Commands changed - Loading ${slashCommands.length} guild slash commands...`
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
            console.log(
              "[log]",
              "[Slash CMDs]",
              "Commands unchanged - skipping registration to preserve daily limit"
            );
          }
        } catch (error) {
          if (error.code === 30034) {
            console.error(
              "[ERROR] Hit daily command creation limit (200/day) - wait 24 hours"
            );
          } else if (error.name === "AbortError") {
            console.error(
              "[ERROR] Command registration timed out after 30 seconds"
            );
          } else {
            console.error(
              "[Error log]",
              "[Slash CMDs]",
              "Failed to load guild slash commands:",
              error
            );
          }
        }
      }
      if (globalSlashCommands.length > 0 || !guildId) {
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

          await deleteAction
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

        // Check if global commands actually need updating
        console.log(
          "[log]",
          "[Slash CMDs]",
          "Checking if global commands need updating..."
        );

        try {
          const existingGlobalCommands = await rest.get(
            Routes.applicationCommands(clientId)
          );

          // Create comparison objects for global commands
          const existingGlobalData = existingGlobalCommands
            .map((cmd) => ({
              name: cmd.name,
              description: cmd.description,
              options: cmd.options || [],
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          const newGlobalData = globalSlashCommands
            .map((cmd) => ({
              name: cmd.name,
              description: cmd.description,
              options: cmd.options || [],
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          // Deep comparison for global commands
          const globalCommandsChanged =
            JSON.stringify(existingGlobalData) !==
            JSON.stringify(newGlobalData);

          if (globalCommandsChanged) {
            console.log(
              "[log]",
              "[Slash CMDs]",
              `Global commands changed - Loading ${globalSlashCommands.length} global slash commands...`
            );

            const data = await rest.put(Routes.applicationCommands(clientId), {
              body: globalSlashCommands,
            });

            console.log(
              "[log]",
              "[Slash CMDs]",
              `Successfully Loaded a total of ${data.length} Global slash commands.`
            );
          } else {
            console.log(
              "[log]",
              "[Slash CMDs]",
              "Global commands unchanged - skipping registration to preserve daily limit"
            );
          }
        } catch (error) {
          if (error.code === 30034) {
            console.error(
              "[ERROR] Hit daily command creation limit (200/day) - wait 24 hours"
            );
          } else if (error.name === "AbortError") {
            console.error(
              "[ERROR] Global command registration timed out after 30 seconds"
            );
          } else {
            console.error(
              "[Error log]",
              "[Slash CMDs]",
              "Failed to load global slash commands:",
              error
            );
          }
        }
      }
    } catch (error) {
      console.error("[Error log]", "[Slash CMDs]", `error`);
    }
  });
};
