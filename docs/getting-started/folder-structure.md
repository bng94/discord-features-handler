# Folder Structure

Now we want to make sure the folder layout is formatted in the following format in order for discord-features-handler to load the commands, events and feature files.

!!! info
    discord-features-handler provides built-in names defined for `commands`, `events`, and `modules` folders. These folders can be renamed to something else tailored to you. You can redefine these names inside the DiscordFeaturesHandlerOptions. Please make sure you also rename the respective folders.

=== "JS"
    ```
    discord-bot/
    ├── commands/
    │   ├── miscellaneous/   //this can be any name you want
    │   │   └── ping.js
    ├── events/
    │   └── ready.js
    ├── modules/
    ├── node_modules/
    ├── .env
    ├── config.js
    ├── index.js
    ├── package-lock.json
    └── package.json
    ```
=== "TS"
    ```
    discord-bot/
    ├── src/
    │   ├── commands/
    │   │   ├── miscellaneous/   //this can be any name you want
    │   │   │   └── ping.ts
    │   ├──  events/
    │   │   └── ready.ts
    │   ├── modules/
    │   ├── config.ts
    │   ├── index.ts
    ├── node_modules/
    ├── .env
    ├── package-lock.json
    └── package.json
    ```

!!! danger
    Do not put any files inside the top-level of the command folder, put them inside the sub-folders.

The commands folder is based on the built-in structure where we rely on the sub-folders to be the category names of the commands inside the folder.


