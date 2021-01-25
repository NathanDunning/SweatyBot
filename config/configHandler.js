const { Client } = require('pg');
const textChannels = require('./channels.js');
const emojis = require('./emojis.js');
require('dotenv').config();

// DB Client
var db;

async function startDBConnection() {
  db = new Client({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });
  return db.connect();
}

async function dbQuery(query) {
  return db.query(query);
}

async function welcome(client) {
  const roleReactChannel = client.channels.cache.get(
    `${textChannels.rolereact.id}`
  );

  const gameRoleMessage = await roleReactChannel.messages.fetch(
    textChannels.rolereact.messages.roles
  );

  // Check roles reaction
  const d2emoji = gameRoleMessage.guild.emojis.cache.get(`${emojis.dota2}`);
  const roleReactionCache = gameRoleMessage.reactions.cache;

  if (!roleReactionCache.get(`${emojis.dota2}`)) {
    await gameRoleMessage.react(d2emoji);
    return;
  }
  if (!roleReactionCache.get(`${emojis.dota2}`).me) {
    await gameRoleMessage.react(d2emoji);
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
      const guildMembers = await guild.members.fetch();

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
      data.set('Gradyear', Number(message.last().content));
    }
    function ProcessError(err) {
      console.log(err);
      return dmChannel.send(
        'Sorry but an error occured, please let a mod know'
      );
    }

    // FIXME: Fix timeout error
    // Affiliate
    await dmChannel.send(`
      Thanks for accepting the rules for **The Server**.\nI just need to ask you a few simple questions as I need update our map of members and affiliates.
    `);
    await sleep(4000);

    let affiliate;
    while (!affiliate || affiliate.length === 0) {
      await dmChannel.send(
        `1. Enter the discord id of the person who invited you. Left click on their profile to find the id (eg. Sweaty Bot#9890)`
      );
      affiliate = await dmChannel
        .awaitMessages(
          (m) => {
            return !m.author.bot;
          },
          { max: 1, time: 60000, errors: ['time'] }
        )
        .then(ProcessAffiliate);

      // Process
      if (affiliate.length) {
        data.set('Affiliate', affiliate[0]);
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
    await dmChannel.send(
      `4. Are you a Nistie? [yes/no] (If you don't know what this is please answer 'no')`
    );
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
    const gradYearResponse = data.get('Gradyear');
    var reply = `Your response was:\nAffiliate: **${data.get(
      'Affiliate'
    )}**\nName: **${data.get('Name')}**\nSurname: **${data.get(
      'Surname'
    )}**\nNistie: **${data.get('Nistie')}**\n`;

    if (gradYearResponse) {
      reply += `Graduation Year: **${gradYearResponse}**`;
      insertUsers = {
        text:
          'INSERT into users(user_id, discord_tag, name, surname, nistie, grad_year) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [
          user.id,
          user.tag,
          data.get('Name'),
          data.get('Surname'),
          data.get('Nistie'),
          gradYearResponse,
        ],
      };
    } else {
      insertUsers = {
        text:
          'INSERT into users(user_id, discord_tag, name, surname, nistie) VALUES ($1, $2, $3, $4, $5)',
        values: [
          user.id,
          user.tag,
          data.get('Name'),
          data.get('Surname'),
          data.get('Nistie'),
        ],
      };
    }
    dmChannel.send(reply);
    dmChannel.send('Saving your response...');
    return data;
  }

  async function StoreUserData(data) {
    // Insert Users
    var insertUsers;
    const gradYearResponse = data.get('Gradyear');

    if (gradYearResponse) {
      insertUsers = {
        text:
          'INSERT into users(user_id, discord_tag, name, surname, nistie, grad_year) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [
          user.id,
          user.tag,
          data.get('Name'),
          data.get('Surname'),
          data.get('Nistie'),
          gradYearResponse,
        ],
      };
    } else {
      insertUsers = {
        text:
          'INSERT into users(user_id, discord_tag, name, surname, nistie) VALUES ($1, $2, $3, $4, $5)',
        values: [
          user.id,
          user.tag,
          data.get('Name'),
          data.get('Surname'),
          data.get('Nistie'),
        ],
      };
    }

    // DB Insert
    await db
      .query(insertUsers)
      .then((res) => {
        console.log(`Inserted: ${insertUsers.values}`);
        // Insert Affiliate
        const insertAffiliate = {
          text: 'INSERT into affiliate(user_id, affiliate_id) VALUES ($1, $2)',
          values: [data.get('Affiliate').id, user.id],
        };
        console.log(`Inserting: ${insertAffiliate.values}`);
        return db.query(insertAffiliate);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function AssignVerified() {
    const guildMember = guild.member(user);
    if (guildMember) {
      await guildMember.roles.add('700609994772578365');
      console.log(`Adding role: 700609994772578365 to user: ${user.id}`);
      dmChannel.send('Thank you for registering, enjoy **The Server**. 👍');
      client.channels.fetch(textChannels.newmembers.id).then((channel) => {
        channel.send(
          `:wave: **New Verified:** :wave:\n**Nickname:** ${
            guildMember.nickname
          }\n**Discord Tag:** ${user.tag}\n**Name:** ${data.get(
            'Name'
          )} ${data.get('Surname')}\n**Is Nistie:** ${data.get(
            'Nistie'
          )}\n**Invited by:** ${data.get('Affiliate')}`
        );
      });
    }
  }

  //TODO: Can add some cache before accessing db
  if (messageReaction.message.channel.id !== '700850602023845971') return;
  const dmChannel = await user.createDM();
  const guild = await client.guilds.cache.get('244095507033489408');
  const data = new Map();

  // Check if user is in system
  if (messageReaction.emoji.name === '👍') {
    if (user.bot) return;

    const query = `SELECT user_id FROM users WHERE user_id = $1`;
    db.query(query, [user.id])
      .then((res) => {
        if (res.rows.length) {
          // User in system, do something else assign role
          console.log('User in system, do something');
        } else {
          // Do new user set up
          newUserSetup()
            .then(StoreUserData)
            .then(AssignVerified)
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => {
        console.error(err.stack);
      });
  }
}

async function messageReactionRemove(client, messageReaction, user) {}

module.exports = {
  startDBConnection: startDBConnection,
  dbQuery: dbQuery,
  welcome: welcome,
  messageReactionAdd: messageReactionAdd,
  messageReactionRemove: messageReactionRemove,
};
