# Built-in Functions


You can access your config properties using the `client.config`.

```javascript
client.config
```

You can access your command files properties and method by using `client.commands`.

```javascript
client.commands
```

For this method, we use to check the person who sent the message. This will return a number, the permission level of the user.

```javascript
client.getPermissionsLevel({
  author, // user of the person who send the message
  channel, // channel where the message was sent
  guild, // guild where the message was sent
  guildMember // the guildMember, if its a guildMember who sent the message
});
```

For this method, it will load a command when given command file name and folder name. Typically ran during startup of the bot to ensure the command is ready to use on startup.

```javascript
client.loadCommand({
  file, // name of the command file
  folder, // folder name where the command is located
  loadingMsg //if we should display which file been loaded
});
```

For this method, it will unload a command when given command name and folder name that the command is in. Your bot will no longer have access to the specific command unload until bot restarts.
```javascript
client.unLoadCommand(commandName, folderName) 
```

## Here are some other features provided:

A built-in Capitalization String Function for words in a sentence format.

```javascript
  // <String>.toProperCase() returns a proper-cased string such as:
  // "A quick brown fox jumps the lazy dog".toProperCase()
  // returns "A Quick Brown Fox Jumps The Lazy Dog"
  String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
```

A built-in Array.random() function to return a random element of an Array.

```javascript
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };
```

Handling unhandledRejection, events that fails because of missing .catch(e => {...}); to prevent bot from crashing in middle of production. You can disable this if prefer to have your bot to stop if running into an unexpected error.

```javascript
  process.on("unhandledRejection", (e) => {
    console.log(e);
  });
```
