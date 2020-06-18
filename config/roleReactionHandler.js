const textChannels = require('./channels.js');
const { ReactionCollector } = require('discord.js');

async function reactionAdd(client, messageReaction, user) {
  if (user.bot) return;
  if (messageReaction.message.channel.id !== '722970514070700032') return;

  // Extract vars/cast
  const guild = await client.guilds.cache.get('244095507033489408');
  const guildMember = guild.member(user);

  if (messageReaction.message.id === '722972576384679976') {
    switch (messageReaction.emoji.name) {
      case 'Dota2':
        await guildMember.roles.add('723007379028967483');
        console.log(`Assigning Dota 2 to ${user.id}`);
    }
  }
}

async function reactionRemove(client, messageReaction, user) {
  if (user.bot) return;
  if (messageReaction.message.channel.id !== '722970514070700032') return;

  // Extract vars/cast
  const guild = await client.guilds.cache.get('244095507033489408');
  const guildMember = guild.member(user);

  if (messageReaction.message.id === '722972576384679976') {
    switch (messageReaction.emoji.name) {
      case 'Dota2':
        await guildMember.roles.remove('723007379028967483');
        console.log(`Removing Dota 2 from ${user.id}`);
    }
  }
}

module.exports = {
  reactionAdd: reactionAdd,
  reactionRemove: reactionRemove,
};
