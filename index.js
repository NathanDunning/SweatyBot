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

// Dynamic require + Setting/loading commands
for (let file of commandFiles) {
  let command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Initiate client
client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.DISCORD_CLIENT_TOKEN);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
  // const channel = client.channels.cache.get(testcommands);
  // if (channel) channel.send('ready');
  // else console.error('Unable to find channel with id:', testingtext);
});

// Message listener
client.on('message', (message) => {
  // Check for prefixed message or bot message
  if (
    message.content.startsWith(prefix) ||
    message.content.startsWith('!') ||
    message.author.bot
  ) {
    // Check message in correct channgel
    if (message.channel.id === testgeneral) {
      message
        .delete()
        .then(
          console.log(
            `Deleted message from ${message.author.username}(${message.author.id})`
          )
        )
        .catch((err) => {
          console.error(er);
        });
      message.author.send(
        'Please use the command channel for anything bot related'
      );
    }
    // Execute command block
    else {
      // Split args and command
      const args = message.content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Check valid command
      if (!client.commands.has(commandName)) return;
      const command = client.commands.get(commandName);

      // Check guild only command
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
    }
  }
});
