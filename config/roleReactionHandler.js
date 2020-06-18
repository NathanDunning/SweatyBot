const { ErelaClient, Utils } = require('erela.js');
const { pgconfig } = require('../config.json');
const { Client } = require('pg');
const textChannels = require('./channels.js');

async function roleReactionHandler(client, messageReaction, user) {
    const guild = await client.guilds.cache.get('244095507033489408')

    // Check if user is in system
    // if (messageReaction.emoji.name === ':dota2:') {
    //     console.log('yeet')
    //     // if (user.bot) return;

    //     // const query = `SELECT user_id FROM users WHERE user_id = $1`;
    //     // db.query(query, [user.id])
    //     //     .then((res) => {
    //     //         if (res.rows.length) {
    //     //             // User in system, do something else assign role
    //     //             console.log('User in system, do something');
    //     //         } else {
    //     //             // Do new user set up
    //     //             newUserSetup()
    //     //                 .then(StoreUserData)
    //     //                 .then(AssignVerified)
    //     //                 .catch(err => console.error(err));
    //     //         }
    //     //     })
    //     //     .catch((err) => {
    //     //         console.error(err.stack);
    //     //     });
    // }
}

module.exports = {
    roleReactionHandler: roleReactionHandler
}
