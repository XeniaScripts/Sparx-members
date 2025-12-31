const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.on("ready", () => {
  console.log(`🤖 Bot online as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
