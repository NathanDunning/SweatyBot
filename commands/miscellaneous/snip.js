const fs = require('fs')

module.exports = {
    name: 'snip',
    description: 'Plays a sound snippet',
    guildOnly: true,
    async execute(client, message, args) {
        return message.channel.send("I don\'t have this implemented yet")
        // if (!message.member.voice.channel) return message.channel.send("You are not in a voice channel")

        // const voiceChannel = message.member.voice.channel
        // voiceChannel.join().then(connection => {
        //     connection.on('debug', console.log);

        //     console.log("Audio starting...")
        //     const dispatcher = connection.play(fs.createReadStream('../../sound_slices/capitalism.ogg', { type: 'ogg/opus' }))

        //     dispatcher.on('finish', () => {
        //         console.log('Finished playing')
        //         voiceChannel.leave();
        //     })
        // }).catch(e => console.error(e));

    }
}