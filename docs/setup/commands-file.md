# Setting up Commands

Follow the folder structure and create sub folders inside your command folder. Name these sub-folders as a category name for your command files.  In order for commands to run when placed inside their respective sub-folders of the command folder, you need to set the properties for each command.

Here is a sample command example with the filename of "ping.js" and it's the command  properties:

```javascript
module.exports = {
	name: 'ping',  //name of command when using <prefix>ping
	description: 'Ping Pong Command!', // description of command
	aliases: ['p'],  // aliases of command
	guildOnly: true,  // guild command only?
	/**
	* @property {Number} permissions 
	* Permission Level of the command: 
	* 0 = Any User
        * 5 = Server Owner
        * 10 = Bot Owner
        * The permission level can be set and changed by updating the config.js file
	**/
	permissions: 0,  
	minArgs: 0,   // minimum arguments required to execute command
	usage: '',  // example of how to use / call the command
	execute(message, args, client) { // function named execute; define what the command does
		return message.channel.send({ content: 'Pong.'});
	},
};
```

## Properties

<p>
  <strong>name</strong> <span class="varType">string</span><br/>
  This is the command name
</p>

<p>
  <strong>description</strong> <span class="varType">string</span><br/>
  This is the description of the command and its functionality
</p>

<p>
  <strong>aliases</strong> <span class="varType">Array&lt;String&gt;</span><br/>
  This is the different abbreviation (aliases) of the command that you can use to call and execute the command
</p>

<p>
  <strong>guildOnly</strong> <span class="varType">boolean</span> = false
  <span class="optional-label"></span><br/>
  This is set the command if it can only be used within a server or can be used within direct message with the bot
</p>

<p>
  <strong>permissions</strong> <span class="varType">number</span><br/>
  This is the permission level value of who can execute the command. If set to 0, any user can run this command, 5 is the server owner and 10 is only the bot owner can run the command. For more details, please refer to the config file on the permission levels.
</p>

<p>
  <strong>minArgs</strong> <span class="varType">number</span><br/>
  This is the minimum arguments required to execute the command
</p>


<p class="hasLabel">
<strong>maxArgs</strong> <span class="varType">number</span>
<span class="optional-label"></span>
<br/>
<span>
This is the maximum arguments required to execute the command</span>
</p>

<p>
  <strong>customIds</strong> <span class="varType">Object</span><br/>
  An object containing interaction name properties that are an <code>Array&lt;string&gt;</code> containing the custom id names for button/autoComplete/userContext/modal interactions
</p>
<p>
  <strong>usage</strong> <span class="varType">string</span><br/>
  Show by writing an example of how to execute the command using the command argument(s) in the command call  Example: <code>!ping</code>
</p>

<p class="hasLabel">
  <strong>execute(message, args, client, level)</strong>
  <span class="varType">Promise&lt;Message&gt;</code></span><br/>
  This is a function that is invoked when the command is called to be executed
</p>

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th align="center">Type</th>
      <th align="center">Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>message</td>
      <td align="center"><a href="https://discord.js.org/docs/packages/discord.js/main/Message:Class">Message Class</a></td>
      <td align="center">true</td>
      <td>This is the message object that represents a message on Discord.</td>
    </tr>
    <tr>
      <td>args</td>
      <td align="center">Array&lt;string&gt;</td>
      <td align="center">false</td>
      <td>This is the arguments array that is required and sent by the user when the command gets executed.</td>
    </tr>
    <tr>
      <td>client</td>
      <td align="center"><a href="https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class">Discord.Client</a></td>
      <td align="center">false</td>
      <td>This is the Discord client object.</td>
    </tr>
    <tr>
      <td>level</td>
      <td align="center">Number</td>
      <td align="center">false</td>
      <td>This is the user's permission level.</td>
    </tr>
  </tbody>
</table>

