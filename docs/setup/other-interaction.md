# Setting up other interactions

Interaction such as buttons, select menu, auto complete, modals and context menus can all be setup within your command file

When setting up these interactions you will need to define a customIds property in your command file:

```javascript
module.exports = {
	name: 'ping', 
	description: 'Ping Pong Command!',
	aliases: ['p'], 
	guildOnly: true,
	permissions: 0,  
	minArgs: 0,   
  /**
   * customIds for your interaction components
   */
    customIds: {
        /**
         * customIds for select menus and buttons
         */
        messageComponent: ['msgComponentId'],
        /**
         * customIds for auto complete interaction
         */
        autoComplete: ['autoCompleteId'],
        /**
         * customIds for modal
         * 
         */
        modal: ['modalId'],
    },
	usage: '', 
	execute(message, args, client) { // function named execute; define what the command does
		return message.channel.send({ content: 'Pong.'});
	},
};
```

If you are creating a modal then you will need to add `modalInteraction` method

<p>
  <strong>modalInteraction(interaction, client, level)</strong>
  <span class="varType">Promise&lt;Interaction&gt;</span><br/>
</p>

| Property      | Type                                                                                                      | Required | Description                                                  |
|---------------|-----------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| interaction | [ModalSubmitInteraction Class](https://discord.js.org/docs/packages/discord.js/main/ModalSubmitInteraction:Class) | true     | This is the command interaction object that represents a slash command interaction on Discord. |
| client        | [Discord.Client](https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class)                   | false    | This is the Discord client object.                           |
| level         | Number                                                                                                    | false    | This is the user's permission level.                         |


If you are creating a message component then you will need to add `componentInteraction` method

<p>
  <strong>componentInteraction(interaction, client, level)</strong>
  <span class="varType">Promise&lt;Interaction&gt;</span><br/>
</p>

!!! info
    If you are using `createMessageComponentCollector` then you do not need to define this method to handle the button or select menu interaction

| Property      | Type                                                                                                      | Required | Description                                                  |
|---------------|-----------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| interaction | [MessageComponentInteraction Class](https://discord.js.org/docs/packages/discord.js/main/MessageComponentInteraction:Class) | true     | This is the command interaction object that represents a button or select menu interaction on Discord. |
| client        | [Discord.Client](https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class)                   | false    | This is the Discord client object.                           |
| level         | Number                                                                                                    | false    | This is the user's permission level.                         |


If you are creating a auto complete component then you will need to add `autoCompleteInteraction` method

<p>
  <strong>autoCompleteInteraction(interaction, client, level)</strong>
  <span class="varType">Promise&lt;Interaction&gt;</span><br/>
</p>

| Property      | Type                                                                                                      | Required | Description                                                  |
|---------------|-----------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| interaction | [AutocompleteInteraction Class](https://discord.js.org/docs/packages/discord.js/main/AutocompleteInteraction:Class) | true     | This is the command interaction object that represents a auto complete interaction on Discord. |
| client        | [Discord.Client](https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class)                   | false    | This is the Discord client object.                           |
| level         | Number                                                                                                    | false    | This is the user's permission level.                         |


If you are creating a user context menu component then you will need to add `contextMenuInteraction` method

<p>
  <strong>contextMenuInteraction(interaction, client, level)</strong>
  <span class="varType">Promise&lt;Interaction&gt;</span><br/>
</p>

| Property      | Type                                                                                                      | Required | Description                                                  |
|---------------|-----------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| interaction | [UserContextMenuCommandInteraction Class](https://discord.js.org/docs/packages/discord.js/main/UserContextMenuCommandInteraction:Class) | true     | This is the command interaction object that represents a user context menu interaction on Discord. |
| client        | [Discord.Client](https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class)                   | false    | This is the Discord client object.                           |
| level         | Number                                                                                                    | false    | This is the user's permission level.                         |

