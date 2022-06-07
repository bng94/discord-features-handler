module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
      console.log(`Serving ${client.guilds.cache.reduce((acc, curr) => (acc += curr.memberCount), 0 )} users`,"Ready!");
      console.log(`Servers: ${client.guilds.cache.size}`,"Ready!");
      console.log(`${client.user.tag}`,"Ready!");
    },
  };
  