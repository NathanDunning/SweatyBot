const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');
const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
const textChannels = require('./config/channels.js');
const configHandler = require('./config/configHandler.js');
const roleHandler = require('./config/roleReactionHandler.js');
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

// Initiate client
client.login(process.env.DISCORD_CLIENT_TOKEN);
client.once('ready', async () => {
  // Connect to DB
  // await configHandler
  //   .startDBConnection()
  //   .then((res) => console.log('Successfuly connected to DB'))
  //   .catch((err) => console.log(err));

  configHandler.welcome(client);
  console.info(`Logged in as ${client.user.tag}!`);
  console.log('Ready!');
});

// Message listener
client.on('message', (message) => {
  if (message.partial) return;
  // Check for prefixed message or bot message
  if (message.content.startsWith(prefix) || message.channel.type === 'dm') {
    // Check message in correct channel
    const sentChannel = Object.values(textChannels)
      .filter((channel) => message.channel.id === channel.id)
      .map((x) => x.botAllow);
    if (sentChannel[0] || message.channel.type === 'dm') {
      // Split args and command
      const args = message.content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Check valid command
      if (!client.commands.has(commandName)) return;
      const command = client.commands.get(commandName);

      // Check permissions
      if (command.permissions) {
        let hasPermissions = false;
        command.permissions.forEach((perm) => {
          if (message.member.roles.cache.has(perm)) hasPermissions = true;
        });
        if (!hasPermissions)
          return message.channel.send(
            'You do not have the permissions for this command'
          );
      }

      // Check guild only command
      if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply(
          "Sneaky.... But I can't execute that command inside DMs!"
        );
      }

      // Check command args
      if (command.args && !args.length) {
        let reply = `${message.author}, I can't execute that with no arguments \n`;
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
    } else {
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
  }
  if (message.content.startsWith('!') || message.author.bot) {
    const allowedChannelID = Object.values(textChannels)
      .filter((channel) => channel.botAllow)
      .map((x) => x.id);
    if (!allowedChannelID.includes(message.channel.id)) {
      const messageContent = message.content;
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
  }
});

// TODO: Can make this more convenient when more listeners added
// Message reaction listener
client.on('messageReactionAdd', async (messageReaction, user) => {
  if (messageReaction.message.partial) await messageReaction.message.fetch();
  configHandler.messageReactionAdd(client, messageReaction, user);
  roleHandler.reactionAdd(client, messageReaction, user);
});

client.on('messageReactionRemove', (messageReaction, user) => {
  configHandler.messageReactionRemove(client, messageReaction, user);
  roleHandler.reactionRemove(client, messageReaction, user);
});
