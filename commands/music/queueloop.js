module.exports = {
    name: 'queueloop',
    aliases: ['qloop'],
    description: 'Loops a track',
    guildOnly: true,
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        // Repeat
        if (player.queueRepeat) {
            player.setQueueRepeat(false);
            message.channel.send("Queue Loop Disabled")
        } else {
            player.setQueueRepeat(true)
            message.channel.send("Queue Loop Enabled :repeat:")
        }
    }
}