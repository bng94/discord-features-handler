# Environment Variables

!!! danger "Add `.env` to your .gitignore file "
     **Make sure to prevent your credentials and api keys being uploaded to github**


Create your `.env` file with the following information:

```
DISCORD_TOKEN="YOUR_DISCORD_BOT_TOKEN"
OWNER_ID="YOUR_DISCORD_USER_ID"
CLIENT_ID="YOUR_BOT_CLIENT_ID"
DEVELOPMENT_GUILD_ID="YOUR_SERVER_ID"
```

**You can find your bot Client Id:** ([Discord Developer Portal](https://discord.com/developers/applications) > "General Information" > application id)

**In hosting server, such as heroku, there is a section to place your variables and do not need the `.env` unless you are hosting the bot on your local computer**


**To access the** DISCORD\_TOKEN **or other environment variables you can just type `process.env.DISCORD_TOKEN`**
