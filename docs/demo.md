---
hide:
  - navigation
  - toc
---

# Demo Discord Bot

A Discord.js demo bot for this package, will be called [heroku-bot](https://github.com/bng94/heroku-bot) on github.

## Clone the repository

=== "JS"
	```
	# Clone your forked repository
	git clone https://github.com/YOUR_GITHUB_USERNAME/heroku-bot.git

	# Navigate into the repository
	cd heroku-bot

	# Add the original repository as a remote named 'upstream'
	git remote add upstream https://github.com/bng94/heroku-bot.git

	# Verify the remote configuration
	git remote -v
	```

=== "TS"
	```
	# Clone your forked repository and checkout the 'Typescript' branch
	git clone --branch Typescript https://github.com/YOUR_GITHUB_USERNAME/heroku-bot.git

	# Navigate into the repository
	cd heroku-bot

	# Add the original repository as a remote named 'upstream'
	git remote add upstream https://github.com/bng94/heroku-bot.git

	# Verify the remote configuration
	git remote -v

	```

Afterwards make sure to install all the dependencies required by using: 

```
npm install
```

## Create your Environment variables file

This file is called `.env` and should be in the same parent folder as your `index.js` file. You can learn more about the environment variables [here](getting-started/environment-variables.md).

Define the following variables: `DISCORD_TOKEN`, `OWNER_ID`, `CLIENT_ID`, `DEVELOPMENT_GUILD_ID`.

## Starting the bot

=== "JS"
	```
	node index.js
	```
	or 
	```
	pm2 start index.js
	```

=== "TS"
	First compile the code: 
	```
	npm run build
	```
	now you can start up the bot using the following:
	```
	npm run dev
	```
	or
	```
	npm run prod
	```

Now your bot should be up and running. You can check these out to set up your bot.

<div class="grid cards" markdown>

-   [:material-pencil: Setting up Config File](setup/config-file.md)
-   [:material-exclamation: Setting up event files](setup/events-file.md)
-   [:material-apple-keyboard-command: Setting up command files](setup/commands-file.md)
-   [:material-slash-forward: Setting up slash command files](setup/slash-commands-file.md)
-   [:octicons-multi-select-24: Setting up other interactions](setup/other-interaction.md)
-   [:material-apple-keyboard-command: Configure DiscordFeaturesHandlerOptions](setup/DiscordFeaturesHandlerOptions.md)


</div>