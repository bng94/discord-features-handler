import {
  CategoryChildChannel,
  ChannelType,
  Client,
  Events,
  Collection,
  Guild,
  GuildMember,
  Interaction,
  Message,
  SlashCommandBuilder,
  User,
} from "discord.js";

/**
 * @typedef {Object} Directories
 */
type Directories = {
  /**
   * The path to your bot start script file.
   *
   * Expected value: **__dirname**
   */
  main: string;
  /**
   * Folder name of your commands folder containing all your bot script files (Default value: command)
   */
  commands?: string;
  /**
   * Folder name of your event folder containing all your bot script files (Default value: events)
   */
  events?: string;
  /**
   * Folder name of your modules folder containing all your bot script files (Default value: modules)
   * Default Folder Name: **modules**
   */
  modules?: string;
};

declare global {
  /**
   * changes the first letter of every word in the string to uppercase letter
   * Example: "a quick brown fox jumps the lazy dog".toProperCase()
   * @method toProperCase
   * @returns {string} "A Quick Brown Fox Jumps The Lazy Dog"
   */
  interface String {
    /**
     * Changes the first letter of every word in the string to uppercase letter
     */
    toProperCase(): string;
  }

  /**
   * @method random
   * @returns [a, b, c, d, e].random() can return a, b, c, d or e.
   */
  interface Array<T> {
    /**
     * <Array>.random() returns a single random element from the array
     */
    random(): T;
  }
}

type BuiltinFiles = {
  /**
   * Disable all built-in commands and discord events provided
   */
  disable_all?: boolean;
  /**
   * Object to contain defined built-in command name to disable
   */
  commands?: CommandOptions;
  /**
   * Object to contain defined built-in discord event name to disable
   */
  events?: EventOptions;
};

type CommandOptions = {
  /**
   * Disable the built-in help command. Default is false.
   */
  help?: boolean;
  /**
   * Disable the built-in reload command. Default is false.
   */
  reload?: boolean;
};

type EventOptions = {
  /**
   * Disable built-in discord messageCreate event to handle your bot commands execution.
   */
  messageCreate?: boolean;
  /**
   * Disable built-in discord interactionCreate event to handle your bot slash commands execution.
   */
  interactionCreate?: boolean;
};

type FileLoadedLogger = {
  /**
   *  Enable console log of commands files being loaded. Default is false.
   */
  commands?: boolean;
  /**
   *  Enable console log of event files being loaded. Default is false.
   */
  events?: boolean;
  /**
   * Enable console log of modules files being loaded. Default is false.
   */
  modules?: boolean;
};

/**
 * @typedef {Object} FilesToExcludeInHandlers
 **/
type FilesToExcludeInHandlers = {
  /**
   * Array of strings of command files to not load when this handler runs
   */
  commands?: string[];
  /**
   * Array of strings of events files to not load when this handler runs
   */
  events?: string[];
  /**
   * Array of strings of modules files to not load when this handler runs
   */
  modules?: string[];
};

/**
 * DiscordFeaturesHandler configuration object
 * @typedef {Object} DiscordFeaturesHandlerOptions
 *
 **/
interface DiscordFeaturesHandlerOptions {
  /**
   * @property {string} config Path to your configuration file, where you can define your bot commands permission levels, bot supports, admins, and bot owner IDs
   */
  config?: string;
  /**
   * @property {directories} directories - Object containing all your directories name and location
   */
  directories: Directories;
  /**
   * @property {builtin_files} builtin_files  - Object to define what built-in commands and events to disable
   */
  builtin_files?: BuiltinFiles;
  /**
   * @property {onLoad_list_files} file_Load_Logger - Object to define directory files to log upon loading the files
   */
  onLoad_list_files?: FileLoadedLogger;
  /**
   * @property {boolean} [disableUnhandledRejectionHandler=false] - Disable discord-features-handler unhandledRejection handler
   */
  disableUnhandledRejectionHandler?: boolean;
  /**
   * @property {number} [modulesPreloadTime=5000] - The time to wait before loading modules files in milliseconds (Default: 5000)
   */
  modulesPreloadTime?: number;
  /**
   * @property {filesToExcludeInHandlers} filesToExcludeInHandlers - Object to contain filename and file extension name of files to not load with handler
   */
  filesToExcludeInHandlers?: FilesToExcludeInHandlers;
}

interface CheckPermissions {
  /**
   * User who we are checking permission of
   */
  author: User;
  /**
   * Guild that the message was sent from
   */
  guild: Guild;
  /**
   * If the the message was from a guild, we get guildMember to check roles
   */
  guildMember: GuildMember;
  /**
   * The channel the message was sent from.
   */
  channel: CategoryChildChannel;
  /**
   * The channel type the message was sent from.
   */
  channelType: ChannelType;
}

interface Permissions {
  /**
   * Permission Level
   *
   * Default: 0 is generic user, 5 is guild owner and 10 is the bot owner
   */
  level: number;
  /**
   * Name of permission
   *
   * Examples: User,Moderator,Admin, Bot Support, Bot Admins, Bot Owner
   */
  name: string;
  /**
   * Checks if the user have the permission level
   * @param data object containing information of where the message was sent from and the user who sent the message, author, guild, guildMember, channel and channelType
   */
  check(data?: CheckPermissions): boolean;
}

interface CommandFile {
  /**
   * Name of the command
   */
  name: string;
  /**
   * Description of the command
   */
  description: string;
  /**
   * Array of strings for command aliases
   */
  aliases: string[];
  /**
   * Is this command for guild only to use. DM command is not allowed
   */
  guildOnly?: boolean;
  /**
   * Permission level to use the command
   */
  permissions: number;
  /**
   * Minimum Arguments allowed for the command
   */
  minArgs: number;
  /**
   * Maximum Arguments allowed for the command
   *
   * Default: -1
   */
  maxArgs?: number;
  /**
   * Describe how to call this command and its argument
   */
  usage?: string;
  /**
   * SlashCommandBuilder object for creating this command into a slash command
   */
  data?: SlashCommandBuilder;
  /**
   * Executing a prefix command call for this command
   * @param message Message Object
   * @param args arguments provided with command call
   * @param client Client Object
   * @param level permission level of user
   */
  execute(
    message: Message,
    args?: string[],
    client?: Client,
    level?: number
  ): Promise<Message>;
  /**
   * Executing a slash command call for this command
   * @param interaction Interaction object
   * @param client Client Object
   * @param level permission level of user
   */
  interactionReply?(
    interaction: Interaction,
    client?: Client,
    level?: number
  ): Promise<Interaction>;
}

interface EventFile {
  name: string;
  once?: boolean;
  execute(...args: any[], client: client): Promise<any>;
}

declare module "discord.js" {
  interface Client {
    /**
     * Your Configuration file
     */
    config: Config;
    /**
     * Map of your command files
     */
    commands: Collection<string, CommandFile>;
    /**
     * Map of your command aliases
     */
    aliases: Collection<string, string>;

    /**
     * Promisified version of setTimeout using util.promisify
     * @function wait
     * @param {number} ms - The number of milliseconds to wait
     * @returns {Promise<void>} A promise that resolves after the specified time
     */
    wait(ms: number): Promise<void>;

    /**
     * Returns the users permissions level
     * @function getPermissionsLevel
     * @param {object} data containing information of where the message was sent and the user who sent the message
     * @returns {number} returns the permission level of the user
     */
    getPermissionsLevel(data: {
      /**
       * User of the person who sent the message
       */
      author: User;
      /**
       * Channel which the message was sent
       */
      channel: TextChannel;
      /**
       * Guild which the message was sent
       */
      guild: Guild;
      /**
       * Guild member, the person who sent the message
       */
      guildMember: GuildMember;
    }): number;

    /**
     * @function loadCommand
     * @param {object} data Data object containing information about command be loaded, file, folder names and to display message.command
     * @returns false is commands are loaded, otherwise log error msg
     */
    loadCommand(data: {
      /**
       * Name of command file: ping. Do not include the file extension!
       */
      file: string;
      /**
       * category Folder name of where the file is located
       */
      folder: string;
      /**
       * Enable an console log message if file was loaded
       */
      loadingMsg?: boolean;
    }): void | false;

    /**
     *
     * @param {string} commandName name of the command to unload
     * @param {string} folderName folder name where the command is located in
     * @returns {string | null} result of what happen when attempt to unload the command
     */
    unLoadCommand(commandName: string, folderName: string): void | string;
  }
}

interface Config {
  /**
   * The developer discord user Id,
   * **Default**: process.env.OWNER_iD
   */
  ownerID: string;
  /**
   * The bot admin user(s) of the bot
   * can be an variable from your .env file
   * **Default**: process.env.OWNER_iD
   */
  admins: string | string[];
  /**
   * The bot support user(s) of the bot
   * can be an variable from your .env file
   * **Default**: process.env.OWNER_iD
   */
  support: string | string[];
  /**
   * prefix is what the keyword to execute your bot commands, you can make this into a string array and allow users to have multiple prefix options
   * **Default**: "!"
   */
  prefix: string | string[];
  /**
   * Your Discord Bot token found in [Discord Developer Portal](https://discordapp.com/developers/applications/)
   * **Default**: process.env.DISCORD_TOKEN
   */
  token: string;
  /**
   * Your application's client id ([Discord Developer Portal](https://discordapp.com/developers/applications/) > "General Information" > application id)
   * **Default**: process.env.CLIENT_ID
   */
  clientId: string;
  /**
   * Your development server Id, (if you want guild based commands only)
   * **Default**: process.env.CLIENT_ID
   */
  guildId?: string;
  /**
   * If you want to delete a specific slash command,
   * If you type boolean, true, then all the slash commands will be deleted
   */
  toDeleteSlashCommand: string | true;
  /**
   * Enable a command denied message to users who do not have permission level of 7 or higher. Default is false
   */
  displayAdminCommandCallsByNonAdmin: boolean;
  /**
   * The role name of your moderator of all guild server this bot is in; Default Permission level of 4.
   */
  modRole: string;
  /**
   * The role name of your administrator of all guild server this bot is in; Default Permission level of 4.
   */
  adminRole: string;
  /**
   * Defines the permissions levels of who have access to what commands
   */
  permissions: Permissions[];
}

/**
 * DiscordFeaturesHandler that handles loading bot commands, discord events and modules files
 * @function DiscordFeaturesHandler
 * @param {Client} client - [Discord Client Object](https://discord.js.org/#/docs/discord.js/stable/class/Client)
 * @param {Object} options - DiscordFeaturesHandler configuration object
 */
declare function DiscordFeaturesHandler(
  client: Client,
  options: DiscordFeaturesHandlerOptions
): void;

export default DiscordFeaturesHandler;
export { Config, CommandFile, EventFile, Permissions, CheckPermissions };
