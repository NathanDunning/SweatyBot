const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');
const fs = require('fs');
require('dotenv').config();

// Command handling
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));
console.log(commandFiles);

// Dynamic require + Setting commands
for (let file of commandFiles) {
  let command = require(`./commands/${file}`);
  console.log(command);
  client.commands.set(command.name, command);
}

// Initiate client
client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.DISCORD_CLIENT_TOKEN);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

// Message listener
client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // Split args and command
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  console.log(commandName, args);

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(`There was an error executing: ${command}`);
  }
});
