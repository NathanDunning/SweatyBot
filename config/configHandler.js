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

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function newUserSetup() {
    async function ProcessAffiliate(message) {
      const response = message.last().content;
      let matched = false;

      // Fetch all guild members
      const guildMembers = await client.guilds.cache
        .get('244095507033489408')
        .members.fetch();

      // Check if affiliate is found in guild
      const affiliate = guildMembers.array().filter((member) => {
        return member.user.tag === response;
      });

      // Process
      if (affiliate) {
        data.set('Affiliate', affiliate);
      } else {
        throw new Error(`Unable to find user: ${response}`);
      }
    }
    function ProcessName(message) {
      data.set('Name', message.last().content);
    }
    function ProcessSurname(message) {
      data.set('Surname', message.last().content);
    }
    function ProcessNistie(message) {
      message.last().content.toLowerCase() === 'yes'
        ? data.set('Nistie', true)
        : data.set('Nistie', false);
    }
    function ProcessGradYear(message) {
      data.set('Gradyear', message.last().content);
    }
    function ProcessError(err) {
      console.log(err);
    }

    const data = new Map();
    const dmChannel = await user.createDM();
    await dmChannel.send(`
      Thanks for accepting the rules for **The Server**.\nI just need to ask you a few simple questions as I need update our map of members and affiliates.
    `);
    // await sleep(4000)

    await dmChannel.send(
      `1. Enter the discord id of the person who invited you. (eg. Sweaty Bot#9890)`
    );
    await dmChannel
      .awaitMessages(
        (m) => {
          return !m.author.bot;
        },
        { max: 1, time: 60000, errors: ['time'] }
      )
      .then(ProcessAffiliate)
      .catch(ProcessError);

    await dmChannel.send(`2. What is your first name?`);
    await dmChannel
      .awaitMessages(
        (m) => {
          return !m.author.bot;
        },
        { max: 1, time: 60000, errors: ['time'] }
      )
      .then(ProcessName)
      .catch(ProcessError);

    await dmChannel.send(`3. What is your last name?`);
    await dmChannel
      .awaitMessages(
        (m) => {
          return !m.author.bot;
        },
        { max: 1, time: 60000, errors: ['time'] }
      )
      .then(ProcessSurname)
      .catch(ProcessError);

    await dmChannel.send(`4. Are you a Nistie? [yes/no]`);
    await dmChannel
      .awaitMessages(
        (m) => {
          return !m.author.bot;
        },
        { max: 1, time: 60000, errors: ['time'] }
      )
      .then(ProcessNistie)
      .catch(ProcessError);

    if (data.get('Nistie')) {
      await dmChannel.send(`5. What was your graduation year?`);
      await dmChannel
        .awaitMessages(
          (m) => {
            return !m.author.bot;
          },
          { max: 1, time: 60000, errors: ['time'] }
        )
        .then(ProcessGradYear)
        .catch(ProcessError);
    }

    console.log(data.values());
  }

  //TODO: Can add some cache before accessing db

  // Check if user is in system
  const query = `SELECT user_id FROM users WHERE user_id = $1`;
  db.query(query, [user.id])
    .then((res) => {
      if (res.rows.length) {
        // User in system, do something else
        console.log('data returned');
      } else {
        // Do new user set up
        newUserSetup();
        // TODO: Process Bool before db insert
      }
    })
    .catch((err) => {
      console.error(err.stack);
    });
}

async function messageReactionRemove(client, messageReaction, user) {}

module.exports = {
  startDBConnection: startDBConnection,
  initialiseErela: initialiseErela,
  welcome: welcome,
  messageReactionAdd: messageReactionAdd,
  messageReactionRemove: messageReactionRemove,
};
