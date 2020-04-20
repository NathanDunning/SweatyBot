const { dbQuery } = require('../../config/configHandler.js')
const textChannels = require('../../config/channels.js')
const permissions = require('../../config/permissions.js')

module.exports = {
    name: 'checkregister',
    description: 'Checks which nisties have not yet registered',
    guildOnly: true,
    permissions: [permissions.Admin, [permissions.Mods]],
    async execute(client, message) {
        const guild = client.guilds.cache.get('244095507033489408');
        // Find members
        const nisties = await guild.roles.fetch('547992648850341903').then(role => role.members.keyArray())
        const registered = await dbQuery('SELECT user_id FROM users').then(res => res.rows.map(x => Object.values(x)[0])).catch(console.error)
        const unregistered = nisties.filter(x => !registered.includes(x))
            .concat(registered.filter(x => !nisties.includes(x))).map(x => guild.member(x));

        let reply = `:bangbang: The follow users with the 'Nisties' role has not yet registered :bangbang: \n`
        unregistered.forEach(user => { reply += `${user}, ` })
        reply += `\n**Note:** Not registering may result in not being able to see future channels`

        client.channels.fetch(textChannels.general.id).then(channel => {
            channel.send(reply)
        })
    },
};
