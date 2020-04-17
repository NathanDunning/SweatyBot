const { Utils } = require("erela.js")

module.exports = {
    name: 'uptime',
    description: 'Uptime of the bot',
    execute(client, message, args) {
        return message.channel.send(`I have been running for ${Utils.formatTime(client.uptime)}`)
    }
};
