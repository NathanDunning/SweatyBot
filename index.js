const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');
const textChannels = require('./config/channels.js');
const { welcome } = require('./config/config.js');
const { ErelaClient, Utils } = require('erela.js');
const fs = require('fs');
require('dotenv').config();

// Command handling
client.commands = new Discord.Collection();

// Dynamic loading
const load = (dirs) => {
  const commands = fs
    .readdirSync(`./commands/${dirs}`)
    .filter((file) => file.endsWith('.js'));
  for (let file of commands) {
    let command = require(`./commands/${dirs}/${file}`);
    client.commands.set(command.name, command);
    if (command.aliases)
      command.aliases.forEach((alias) => client.commands.set(alias, command));
  }
};
['miscellaneous', 'moderation', 'music'].forEach((f) => load(f));

// Nodes for Erela.js
const nodes = [{ host: 'localhost', port: 2333, password: 'youshallnotpass' }];

// Initiate client
client.once('ready', () => {
  console.log('Ready!');

  // // Initialise Erela client
  // client.music = new ErelaClient(client, nodes);
  // // Event Listener
  // client.music.on('nodeConnect', () => console.log('New node connected'));
  // client.music.on('nodeError', (error) =>
  //   console.log(`Node error: ${error.message}`)
  // );
  // client.music.on('trackStart', ({ textChannel }, { title, duration }) =>
  //   textChannel.send(
  //     `Now playing: **${title}** \`${Utils.formatTime(duration, true)}\``
  //   )
  // );

  client.levels = new Map()
    .set('none', 0.0)
    .set('low', 0.1)
    .set('medium', 0.15)
    .set('high', 0.25);
});

client.login(process.env.DISCORD_CLIENT_TOKEN);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
  welcome(client);
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
    if (message.channel.id === textChannels.testgeneral) {
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

      if (!message.author.bot) {
        message.author.send(
          'Please use the command channel for anything bot related'
        );
      }
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
        command.execute(client, message, args);
      } catch (error) {
        console.error(error);
        message.reply(`There was an error executing: ${command}`);
      }
    }
  }
});
