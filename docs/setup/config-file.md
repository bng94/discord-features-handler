# Built-in config.js file

This file will handle your command permissions level setup and who is the bot owner, your bot admin, and bot support users. Build your own config.js file and define how your permissions level should work.

!!! tip 
    You can access the config variables by using _"client.config"_


Here is the default config.js that is used if no config file is found:

=== "JS"
    ```javascript title="config.js"
    const { ChannelType } = require("discord.js");

    const config = {
      ownerID: process.env.OWNER_ID,
      admins: process.env.OWNER_ID,
      support: process.env.OWNER_ID,
      prefix: "!",
      token: process.env.DISCORD_TOKEN,
      clientId: process.env.CLIENT_ID,
      guildId: process.env.DEVELOPMENT_GUILD_ID,
      toDeleteSlashCommand: "",
      displayAdminCommandCallsByNonAdmin: false,
      roles: {
        modRole: {
          name: "mod"
        },
        adminRole: {
          name: "admin"
        },
      },
      modRole: "Mod",
      adminRole: "Admin",
      permissions: [
        {
          level: 0,
          name: "User",
          check: () => true,
        },
        {
          level: 3,
          name: "Moderator",
          check: ({ guild, guildMember }) => {
            const modRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.roles.modRole.name.toLowerCase()
            );
            const oldModRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.modRole.toLowerCase()
            );
            if (modRole && guildMember.roles.cache.has(modRole.id)) {
              if (oldModRole && guildMember.roles.cache.has(oldModRole.id)) {
                return true;
              } else {
                return false;
              }
            }
          },
        },
        {
          level: 4,
          name: "Administrator",
          check: ({ guild, guildMember }) => {
            const adminRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.roles.adminRole.name.toLowerCase()
            );
            const oldAdminRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.adminRole.toLowerCase()
            );
            if (adminRole && guildMember.roles.cache.has(adminRole.id)) return true;
            else if (oldAdminRole && guildMember.roles.cache.has(oldAdminRole.id)) return true;
            else {
              return false;
            }
          },
        },
        {
          level: 5,
          name: "Server Owner",
          check: ({ author, channel, guild }) => {
            return channel.type === ChannelType.GuildText
              ? guild.ownerId === author.id
                ? true
                : false
              : false;
          },
        },
        {
          level: 8,
          name: "Bot Support",
          check: ({ author }) => {
            if (!config.support) {
              if (config.ownerID === author.id) {
                return true;
              } else {
                return false;
              }
            }

            return config.support.includes(author.id);
          },
        },
        {
          level: 9,
          name: "Bot Admin",
          check: ({ author }) => {
            if (!config.admins) {
              if (config.ownerID === author.id) {
                return true;
              } else {
                return false;
              }
            }

            return config.admins.includes(author.id);
          },
        },
        {
          level: 10,
          name: "Bot Owner",
          check: ({ author }) => {
            return config.ownerID === author.id;
          },
        },
      ],
    };

    module.exports = config;

    ```

=== "TS"

    ```typescript title="config.ts"
    import { CheckPermissions, Config } from "discord-features-handler";
    import { ChannelType } from "discord.js";

    const config: Config = {
      ownerID: process.env.OWNER_ID,
      admins: process.env.OWNER_ID,
      support: process.env.OWNER_ID,
      prefix: "!",
      token: process.env.DISCORD_TOKEN,
      clientId: process.env.CLIENT_ID,
      guildId: process.env.DEVELOPMENT_GUILD_ID,
      toDeleteSlashCommand: "",
      displayAdminCommandCallsByNonAdmin: false,
      roles: {
        modRole: {
          name: "mod"
        },
        adminRole: {
          name: "admin"
        },
      },
      modRole: "Mod",
      adminRole: "Admin",
      permissions: [
        {
          level: 0,
          name: "User",
          check: () => true,
        },
        {
          level: 3,
          name: "Moderator",
          check: ({ guild, guildMember }: CheckPermissions) => {
            const modRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.roles.modRole.name.toLowerCase()
            );
            const oldModRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.modRole.toLowerCase()
            );
            if (modRole && guildMember.roles.cache.has(modRole.id)) {
              if (oldModRole && guildMember.roles.cache.has(oldModRole.id)) {
                return true;
              } else {
                return false;
              }
            }
          },
        },
        {
          level: 4,
          name: "Administrator",
          check: ({ guild, guildMember }: CheckPermissions) => {
            const adminRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.roles.adminRole.name.toLowerCase()
            );
            const oldAdminRole = guild.roles.cache.find(
              (r) => r.name.toLowerCase() === config.adminRole.toLowerCase()
            );
            if (adminRole && guildMember.roles.cache.has(adminRole.id)) return true;
            else if (oldAdminRole && guildMember.roles.cache.has(oldAdminRole.id)) return true;
            else {
              return false;
            }
          },
        },
        {
          level: 5,
          name: "Server Owner",
          check: ({ author, channel, guild }: CheckPermissions) => {
            return channel.type === ChannelType.GuildText
              ? guild.ownerId === author.id
                ? true
                : false
              : false;
          },
        },
        {
          level: 8,
          name: "Bot Support",
          check: ({ author }: CheckPermissions) => {
            if (!config.support) {
              if (config.ownerID === author.id) {
                return true;
              } else {
                return false;
              }
            }

            return config.support.includes(author.id);
          },
        },
        {
          level: 9,
          name: "Bot Admin",
          check: ({ author }: CheckPermissions) => {
            if (!config.admins) {
              if (config.ownerID === author.id) {
                return true;
              } else {
                return false;
              }
            }

            return config.admins.includes(author.id);
          },
        },
        {
          level: 10,
          name: "Bot Owner",
          check: ({ author }: CheckPermissions) => {
            return config.ownerID === author.id;
          },
        },
      ],
    };

    module.exports = config;
    ```

## Properties

<p>
  <strong>ownerID</strong> <span class="varType">string</span><br/>
  Your discord user Id, you should define this in your <code>.env</code> file. Expected: process.env.OWNER_ID
</p>

<p>
  <strong>admins</strong> <span class="varType">string | Array&lt;string&gt;</span><br/>
  The bot admin discord Ids, you should define this in your <code>.env</code> file. 
</p>

<p>
  <strong>support</strong> <span class="varType">string | Array&lt;string&gt;</span><br/>
  The bot support discord Ids, you should define this in your <code>.env</code> file. 
</p>
<p>
  <strong>prefix</strong> <span class="varType">string | Array&lt;string&gt;</span><br/>
  Define the call prefix for command calls that are not slash command calls. You can define this as an array or as a string
</p>

<p>
  <strong>token</strong> <span class="varType">string </span><br/>
  Your Discord Bot Token, this token can be found in <a href="https://discordapp.com/developers/applications/">Discord Developer Portal</a>. You should define this in your <code>.env</code> file.   Expected: process.env.DISCORD_TOKEN
</p>

<p>
  <strong>clientId</strong> <span class="varType">string</span><br/>
  Your bot client id, this id can be found in <a href="https://discordapp.com/developers/applications/">Discord Developer Portal</a> > "General Information" > application id, you should define this in your <code>.env</code> file. Expected: process.env.CLIENT_ID
</p>

<p>
  <strong>toDeleteSlashCommand</strong> <span class="varType">string | true</span>
<span class="optional-label"></span><br/>
  If you want to delete a slash command by slash command Id, you can enter the slash command Id, or if you want to delete all the slash commands then enter the boolean: <code>true</code>
</p>

<p>
  <strong>displayAdminCommandCallsByNonAdmin</strong> <span class="varType">boolean</span>
  <span class="optional-label"></span><br/>
  If you want to display an error message when a user who permissions level is less than 7 and uses an bot support or higher permission level command. Default is false.
</p>

<p>
  <strong>roles</strong> <span class="varType">Object</span><br/>
  The role names of your permissions of all guild server this bot is in.
</p>



<table>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>modRole</td>
    <td><span class="type">Roles</span></td>
    <td>
      The role name and role id(optional) of your moderator role of all guild server this bot is in; Default Permission level of 3.
    </td>
  </tr>
  <tr>
    <td>adminRole</td>
    <td><span class="type">Roles</span></td>
    <td>
      The role name of your administrator role of all guild server this bot is in; Default Permission level of 4. 
    </td>
  </tr>
  <tr>
    <td><code>k:string</code></td>
    <td><span class="type">Roles</span></td>
    <td>
      You can define as many properties as needed and use them for any roles when customizing the permissions array.
    </td>
  </tr>
  </tbody>
</table>



<details>
<summary>Roles Type</summary>
This type is a object that contains the following property.
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
      <td>id <span class="optional-label"></span><br/></td>
      <td><span class="type">string</span></td>
      <td>The id of the role</td>
    </tr>
    <tr>
      <td>name</td>
      <td><span class="type">string</span></td>
      <td>The name of the role.</td>
    </tr>
  </tbody>
</table>


</details>

<p>
  <strong>modRole</strong> <span class="varType">string</span>
<span class="deprecated-label"></span><br/>
  The role name of your moderator role of all guild server this bot is in; Default Permission level of 3. This wil be deprecated in the next build.
</p>

<p>
  <strong>adminRole</strong> <span class="varType">string</span>
<span class="deprecated-label"></span><br/>
  The role name of your administrator role of all guild server this bot is in; Default Permission level of 4.This wil be deprecated in the next build.
</p>

<p>
  <strong>permissions</strong> <span class="varType">Array&lt;Object&gt;</span><br/>
  The Permissions level definitions
</p>


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
      <td>level</td>
      <td><span class="type">number</span></td>
      <td>
        The level property represents a numeric value.
      </td>
    </tr>
    <tr>
      <td>name</td>
      <td><span class="type">string</span></td>
      <td>
        The name property represents a string value.
      </td>
    </tr>
    <tr>
      <td>check</td>
      <td><span class="type">method</span></td>
      <td>
        The <code>check</code> method is a function that takes a parameter <code>data</code> of type <code>CheckPermissions</code>, which contains information about the author, guild, guildMember, channelType, and channel. It returns a <span class="type">boolean</span> indicating whether the user has the required permission level.
      </td>
    </tr>
  </tbody>
</table>

<details>
<summary>CheckPermissions Type</summary>


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
        <td>author</td>
        <td><span class="type">User</span></td>
        <td>
          The author property represents the user who initiated the command.
        </td>
      </tr>
      <tr>
        <td>guild</td>
        <td><span class="type">Guild</span></td>
        <td>
          The guild property represents the server where the command was called.
        </td>
      </tr>
      <tr>
        <td>guildMember</td>
        <td><span class="type">GuildMember</span></td>
        <td>
          The guildMember property represents the member who called the command within the guild.
        </td>
      </tr>
      <tr>
        <td>channel</td>
        <td><span class="type">TextChannel | DMChannel</span></td>
        <td>
          The channel property represents the TextChannel or DMChannel where the command was called.
        </td>
      </tr>
      <tr>
        <td>channelType</td>
        <td><span class="type">ChannelType</span></td>
        <td>
          The channel type of the channel where the command was called.
        </td>
      </tr>
    </tbody>
  </table>
</details>

