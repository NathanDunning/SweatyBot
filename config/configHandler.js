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
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function newUserSetup() {
    async function ProcessAffiliate(message) {
      const response = message.last().content;

      // Fetch all guild members
      const guildMembers = await client.guilds.cache
        .get('244095507033489408')
        .members.fetch();

      // Check if affiliate is found in guild
      return guildMembers.array().filter((member) => {
        return member.user.tag === response;
      });
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

    // Affiliate
    await dmChannel.send(`
      Thanks for accepting the rules for **The Server**.\nI just need to ask you a few simple questions as I need update our map of members and affiliates.
    `);
    await sleep(4000)

    let affiliate;
    while (!affiliate || affiliate.length === 0) {
      await dmChannel.send(
        `1. Enter the discord id of the person who invited you. Left click on their profile to find the id (eg. Sweaty Bot#9890)`
      );
      affiliate = await dmChannel.awaitMessages((m) => {
        return !m.author.bot;
      }, { max: 1, time: 60000, errors: ['time'] }
      ).then(ProcessAffiliate)

      // Process
      if (affiliate.length) {
        data.set('Affiliate', affiliate);
      } else {
        await dmChannel.send(`Unable to find user`);
      }
    }

    // First Name
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

    // Last Name
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

    // Nistie
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

    // Process response
    const gradYearResponse = data.get("Gradyear");
    var reply = `Your response was:\nAffiliate: **${data.get("Affiliate")}**\nName: **${data.get("Name")}**\nSurname: **${data.get("Surname")}**\nNistie: **${data.get("Nistie")}**\n`

    if (gradYearResponse) {
      reply += `Graduation Year: **${gradYearResponse}**`
      insertUsers = {
        text: 'INSERT into users(user_id, discord_tag, name, surname, nistie, grad_year) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [user.id, user.tag, data.get("Name"), data.get("Surname"), data.get("Nistie"), gradYearResponse]
      }
    } else {
      insertUsers = {
        text: 'INSERT into users(user_id, discord_tag, name, surname, nistie) VALUES ($1, $2, $3, $4, $5)',
        values: [user.id, user.tag, data.get("Name"), data.get("Surname"), data.get("Nistie")]
      }
    }
    dmChannel.send(reply)
    dmChannel.send("Saving your response...")
    return data;
  }

  async function StoreUserData(data) {
    // Insert Users
    var insertUsers;
    const gradYearResponse = data.get("Gradyear");

    if (gradYearResponse) {
      insertUsers = {
        text: 'INSERT into users(user_id, discord_tag, name, surname, nistie, grad_year) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [user.id, user.tag, data.get("Name"), data.get("Surname"), data.get("Nistie"), gradYearResponse]
      }
    } else {
      insertUsers = {
        text: 'INSERT into users(user_id, discord_tag, name, surname, nistie) VALUES ($1, $2, $3, $4, $5)',
        values: [user.id, user.tag, data.get("Name"), data.get("Surname"), data.get("Nistie")]
      }

      await db.query(insertUsers).then(res => {
        console.log(res.rows[0])
        // Insert Affiliate
        const insertAffiliate = {
          text: 'INSERT into affiliate(user_id, affiliate_id) VALUES ($1, $2)',
          values: [user.id, data.get("Affiliate")]
        }
        return db.query(insertAffiliate)
      }).then(res => {
        console.log(res.rows[0])
      }).catch(err => { console.error(err) })

    }
  }

  async function AssignVerified() {
    console.log("Assign here")
  }

  //TODO: Can add some cache before accessing db

  // Check if user is in system
  if (messageReaction.emoji.name === '👍') {
    const query = `SELECT user_id FROM users WHERE user_id = $1`;
    db.query(query, [user.id])
      .then((res) => {
        if (res.rows.length) {
          // User in system, do something else assign role
          console.log('data returned');
        } else {
          // Do new user set up
          newUserSetup()
            .then(StoreUserData)
            .then(AssignVerified)
            .catch(err => console.error(err));
        }
      })
      .catch((err) => {
        console.error(err.stack);
      });
  }
}


async function messageReactionRemove(client, messageReaction, user) { }

module.exports = {
  startDBConnection: startDBConnection,
  initialiseErela: initialiseErela,
  welcome: welcome,
  messageReactionAdd: messageReactionAdd,
  messageReactionRemove: messageReactionRemove,
};
