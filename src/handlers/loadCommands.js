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
  const loadingCommands = directory.map((dirs) => {
    loadCommands(dirs);
  });

  Promise.all(loadingCommands).then(async () => {
    const rest = new REST().setToken(client.config.token);
    const { clientId, guildId, toDeleteSlashCommand } = client.config;

    const slashCommands = await client.commands
      .map((cmd) => {
        if (cmd.data) {
          return cmd.data.toJSON();
        }
      })
      .filter((data) => data !== undefined);

    if (slashCommands.length === 0) return;

    try {
      console.log(
        `Started refreshing ${slashCommands.length} application (/) commands.`
      );
      if (guildId) {
        const data = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: slashCommands }
        );

        if (typeof toDeleteSlashCommand === "string") {
          rest
            .delete(
              Routes.applicationGuildCommand(
                clientId,
                guildId,
                toDeleteSlashCommand
              )
            )
            .then(() => console.log("Successfully deleted guild command"))
            .catch(console.error);
        } else if (toDeleteSlashCommand === true) {
          rest
            .put(Routes.applicationGuildCommands(clientId, guildId), {
              body: [],
            })
            .then(() => console.log("Successfully deleted all guild commands."))
            .catch(console.error);
        }

        console.log(
          "[log]",
          "[Slash Commands]",
          `Successfully Loaded a total of ${data.length} slash commands.`
        );
      } else {
        const data = await rest.put(Routes.applicationGuildCommands(clientId), {
          body: slashCommands,
        });
        if (typeof toDeleteSlashCommand === "string") {
          rest
            .delete(
              Routes.applicationGuildCommand(clientId, toDeleteSlashCommand)
            )
            .then(() => console.log("Successfully deleted guild command"))
            .catch(console.error);
        } else if (toDeleteSlashCommand === true) {
          rest
            .put(Routes.applicationCommands(clientId), { body: [] })
            .then(() =>
              console.log("Successfully deleted all application commands.")
            )
            .catch(console.error);
        }

        console.log(
          "[log]",
          "[Slash Commands]",
          `Successfully Loaded a total of ${data.length} Global slash commands.`
        );
      }
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  });
};
