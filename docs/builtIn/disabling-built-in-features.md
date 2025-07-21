# Disabling Built-in Features

If you don't want the built-in features you can disable them by configuring with the DiscordFeaturesHandlerOptions object. 

Here is an example of disabling all the features.

```javascript
DiscordFeaturesHandler(client, {
    // object for disablinig the built-in command(s) and/or events(s)
    builtin_files = {
      commands: {
        help: false,
        reload: false,
      },
      events: {
        messageCreate: false,
        interactionCreate: false,
      },
    },
    //Object to enable console logs of which file is being loaded
    onLoad_list_files = {
      commands: false,
      events: false,
      modules: false,
    },

    //Disable discord-features-handler unhandledRejection handler functions
    disableUnhandledRejectionHandler = false,
});
```
