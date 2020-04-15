const fs = require('fs')

module.exports = {
    name: 'snip',
    description: 'Plays a sound snippet',
    guildOnly: true,
    async execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send("You are not in a voice channel")

        const voiceChannel = message.member.voice.channel
        voiceChannel.join().then(connection => {
            const dispatcher = connection.play('../../sound_slices/capitalism.mp3')

            dispatcher.on('finish', () => {
                voiceChannel.leave();
            })
        }).catch(e => console.error(e));

    }
}