const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const fs = require('fs');

// Command handling
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));
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

client.login(token);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

// Message listener
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // Split args and command
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  console.log(commandName, args);

  // Check valid command
  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  // Check guide only command
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply(
      "You sneaky pan, I can't execute that command inside DMs!"
    );
  }

  // Check command args
  if (command.args && !args.length) {
    let reply = `${message.author} you sala pan, I can't execute that with no arguments \n`;
    if (command.usage) {
      reply += `The proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  // Execute
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(`There was an error executing: ${command}`);
  }
});
