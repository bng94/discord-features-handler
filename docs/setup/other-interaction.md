# Setting up other interactions

Interaction such as buttons, select menu, auto complete, modals and context menus can all be setup within your command file

When setting up these interactions you will need to define a customIds property in your command file:

```javascript
import {
  ActionRowBuilder,
  ActionRowComponent,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

module.exports = {
        name: 'ping', 
        description: 'Ping Pong Command!',
        aliases: ['p'], 
        guildOnly: true,
        permissions: 0,  
        minArgs: 0,   
        data: new SlashCommandBuilder()
          .setName("ping")
          .setDescription("Ping Pong Command"),
        /**
         * customIds for your interaction components
         * 
         * or this can be a Array<string>
         * customIds: ["btnComponentId","backBtnId"]
         */
          customIds: {
              /**
               * customId for a button component
               */
              buttonComponent: 'btnComponentId',
              /**
               * customId for second button
               */
              secondButton: 'secondBtnId',
            },
          usage: '', 
          execute(message, args, client) { 
            return message.channel.send({ content: 'Pong.'});
          },
          async interactionReply(interaction, client, level){
            await interaction.deferReply({
              ephemeral: true,
            });
          
            let row = new ActionRowBuilder();
          const btnArray = [{
            id: this.customIds.buttonComponent,
            name: "Button1",
            color: ButtonStyle.Primary,
          },{
            id: this.customIds.secondButton,
            name: "Button1",
            color: ButtonStyle.Secondary,
          }].map((btn) => {
            return new ButtonBuilder()
              .setCustomId(btn.id)
              .setLabel(btn.name)
              .setStyle(btn.color)
              .setDisabled(disabled);
          });

          let row = new ActionRowBuilder();

          btnArray.map((btn) => row.addComponents(btn));

            return await interaction.editReply({
              content: "pong",
              components: [row],
            });

          }
          /**
           * this is the function to used when interacting with customIds
           */
          async customIdInteraction(interaction, client, level){
            /**
             * if(interaction.customId === this.customIds[0])
             */
            if(interaction.customId === this.customIds.buttonComponent){ 

              return interaction.update({
                content: "updated button component",
              })
            }
          }
};
```

If you are creating a customId interaction then you will need to add `customIdInteraction` method

<p>
  <strong>customIdInteraction(interaction, client, level)</strong>
  <span class="varType">Promise&lt;Interaction&gt;</span><br/>
</p>

| Property      | Type                                                                                                      | Required | Description                                                  |
|---------------|-----------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| interaction | [CommandInteraction Class](https://discord.js.org/docs/packages/discord.js/main/CommandInteraction:Class)  | true     | This is the command interaction object that represents a slash command interaction on Discord. |
| client        | [Discord.Client](https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class)                   | false    | This is the Discord client object.                           |
| level         | Number                                                                                                    | false    | This is the user's permission level.                         |
