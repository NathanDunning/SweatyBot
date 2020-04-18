const { ErelaClient, Utils } = require('erela.js');
const { pgconfig } = require('../config.json');
const { Client } = require('pg');
const textChannels = require('./channels.js');

// DB Client
var db;

async function startDBConnection() {
  db = new Client(pgconfig);
  return db.connect();
}

async function initialiseErela(client) {
  // Nodes for Erela.js
  const nodes = [
    { host: 'localhost', port: 2333, password: 'youshallnotpass' },
  ];

  return new Promise((resolve, reject) => {
    // Initialise Erela client
    client.music = new ErelaClient(client, nodes);

    // Add Event Listener
    client.music.on('nodeConnect', () => resolve('New node connected'));
    client.music.on('nodeError', (error) =>
      reject(`Node error: ${error.message}`)
    );
    client.music.on('trackStart', ({ textChannel }, { title, duration }) =>
      textChannel.send(
        `Now playing: **${title}** \`${Utils.formatTime(duration, true)}\``
      )
    );
  });
}

async function welcome(client) {
  const channel = client.channels.cache.get(`${textChannels.rules}`);

  // Adding message to cache
  const message = await channel.messages.fetch('700857567705956444');

  // Check reaction
  const reactionCache = message.reactions.cache;
  if (!reactionCache.get('👍')) {
    await message.react('👍');
  }
  if (!reactionCache.get('👍').me) {
    await message.react('👍');
  }
}

async function messageReactionAdd(client, messageReaction, user) {
  console.log(messageReaction.emoji.name);
  console.log(user.id);
}

async function messageReactionRemove(client, messageReaction, user) {
  console.log(messageReaction.emoji.name);
  console.log(user.id);
}

module.exports = {
  startDBConnection: startDBConnection,
  initialiseErela: initialiseErela,
  welcome: welcome,
  messageReactionAdd: messageReactionAdd,
  messageReactionRemove: messageReactionRemove,
};
