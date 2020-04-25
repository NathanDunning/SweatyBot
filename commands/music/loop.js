module.exports = {
    name: 'loop',
    description: 'Loops a track',
    guildOnly: true,
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        // Repeat
        if (player.trackRepeat) {
            player.setTrackRepeat(false);
            message.channel.send("Loop Disabled")
        } else {
            player.setTrackRepeat(true)
            message.channel.send("Loop Enabled :repeat:")
        }
    }
}