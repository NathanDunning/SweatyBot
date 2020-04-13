const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const { testgeneral, testcommands } = require('./channels.js');
const fs = require('fs');

// Command handling
client.commands = new Discord.Collection();

const load = dirs => {
  const commands = fs.readdirSync(`./commands/${dirs}`).filter(file => file.endsWith('.js'))
  for (let file of commands) {
    let command = require(`./commands/${dirs}/${file}`)
    client.commands.set(command.name, command)
    if (command.alias) command.alias.forEach(alias => client.aliases.set(alias, command.name))
  }
}
["miscellaneous", "moderation", "music"].forEach(f => load(f))

// Initiate client
client.once('ready', () => {
  console.log('Ready!');
});

client.login(token);

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
