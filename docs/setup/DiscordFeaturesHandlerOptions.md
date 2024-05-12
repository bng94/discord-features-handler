---
description: Dive into the specifics details of each parameters and properties.
---

# DiscordFeaturesHandlerOptions
The properties to configure DiscordFeaturesHandler how you want it and to get your discord.js bot up and running.

Here is a sample usage with the all properties and parameters.

```javascript
DiscordFeaturesHandler(client, {
  config = "./config.js", // if using TS, remove the extension: "./config"
  directories = {
    main: __dirname 
    commands: "commands", 
    events: "events",
    modules: "modules",
  },
  builtin_files = { 
    disable_all: false,
    commands: {
      help: false, 
      reload: false,  
    },
    events: {
      messageCreate: false, 
      interactionCreate: false,
    },
  },
  onLoad_list_files = {
    commands: false,  
    events: false,
    modules: false,
  },
  disableUnhandledRejectionHandler = false,
  modulesPreloadTime = 500,
 filesToExcludeInHandlers = {
    commands: [""],
    events: [""],
    modules: [""],
  },
});
```

## Properties

The DiscordFeaturesHandlerOptions object contains properties to configure DiscordFeaturesHandler how you want it and to get your discord.js bot up and running.

<p>
  <strong>config</strong> <span class="varType">string</span>
<span class="optional-label"></span><br/>
  The path and filename to your config file. If empty, it will use a default config file. Please refer to <a href="../config-file">config file</a> to see the setup and customization.<br/>
</p>

<p>
  <strong>directories</strong> <span class="varType">object</span><br/>
  The object containing the folder names and main directory path. The main property is required.<br/>
</p>
<table>
  <thead>
    <tr>
      <th>Properties</th>
      <th>Type</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>main</td>
      <td>string</td>
      <td>true</td>
      <td>
        The full path location to the script file<br>
        Expected value: __dirname
      </td>
    </tr>
    <tr>
      <td>commands</td>
      <td>string</td>
      <td>false</td>
      <td>
        Folder name that contains your command files. Default: "commands"
      </td>
    </tr>
    <tr>
      <td>events</td>
      <td>string</td>
      <td>false</td>
      <td>
        Folder name that contains your event files. Default: "events"
      </td>
    </tr>
    <tr>
      <td>modules</td>
      <td>string</td>
      <td>false</td>
      <td>
        Folder name that contains your modules files. Default: "modules"
      </td>
    </tr>
  </tbody>
</table>


<p>
  <strong>builtin_files</strong> <span class="varType">object</span>
<span class="optional-label"></span><br/>
  This object contains properties of true or false values of what built-in commands and events to disable.
</p>

<table>
  <thead>
    <tr>
      <th>Properties</th>
      <th align="center">Type</th>
      <th align="center">Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>disable_all</td>
      <td align="center">boolean</td>
      <td align="center">false</td>
      <td>Disables all built-in commands and events</td>
    </tr>
    <tr>
      <td>commands</td>
      <td align="center">Object</td>
      <td align="center">{ ... }</td>
      <td>Object contains the name of all built-in commands, that you may want to disable. Commands: help and reload</td>
    </tr>
    <tr>
      <td>events</td>
      <td align="center">Object</td>
      <td align="center">{ ... }</td>
      <td>Object contains names of all built-in events that you may want to disable. Events: messageCreate, interactionCreate</td>
    </tr>
  </tbody>
</table>



<p>
  <strong>onLoad_list_files</strong> <span class="varType">object</span>
<span class="optional-label"></span><br/>
  This object contains properties of true or false values of what built-in commands and events to disable.
</p>

<table>
  <thead>
    <tr>
      <th>Properties</th>
      <th align="center">Type</th>
      <th align="center">Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>commands</td>
      <td align="center">boolean</td>
      <td align="center">false</td>
      <td>Enable console log of command files being loaded</td>
    </tr>
    <tr>
      <td>events</td>
      <td align="center">boolean</td>
      <td align="center">false</td>
      <td>Enable console log of event files being loaded</td>
    </tr>
    <tr>
      <td>modules</td>
      <td align="center">Object</td>
      <td align="center">false</td>
      <td>Enable console log of module files being loaded</td>
    </tr>
  </tbody>
</table>


<p>
  <strong>disableUnhandledRejectionHandler</strong> <span class="varType">Boolean</span>
  <span class="optional-label"></span><br/>
  A Boolean to disable the pre-defined unhandledRejection function to handle uncaught promise rejections, where the bot would not crash upon reaching the rejection.

</p>

!!! info
      Recommend disabling **only** to use if you are re-creating this handler to print out the error tailored to read. Otherwise your bot may crash more often.

<p>
  <strong>modulesPreloadTime</strong> <span class="varType">Number</span>
  <span class="optional-label"></span><br/>
  The time to wait before loading module files. This is used to establish a waiting time to connect to the Discord API and ensure we can access the guilds the bot has access to and their Discord Channels, users, and guild information to use within the module files that are waiting to be loaded. The time value is in milliseconds, and by default, the wait time is 500 ms or half a second before the module files are loaded. You can update the time if you require a longer wait time for other API-related tasks such as connecting to a database.
</p>

<p>
  <strong>filesToExcludeInHandlers</strong> <span class="varType">Object</span>
  <span class="optional-label"></span><br/>
  An object that contains properties of handler names for the array of strings. The strings represent files that should not run when the bot starts up.
</p>




<strong>Properties</strong>
<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>commands</strong></td>
      <td><code>Array&lt;string&gt;</code></td>
      <td>The command files that should not run when the handler is invoked</td>
    </tr>
    <tr>
      <td><strong>events</strong></td>
      <td><code>Array&lt;string&gt;</code></td>
      <td>The event files that should not run when the handler is invoked</td>
    </tr>
    <tr>
      <td><strong>modules</strong></td>
      <td><code>Array&lt;string&gt;</code></td>
      <td>The module files that should not run when the handler is invoked</td>
    </tr>
  </tbody>
</table>
