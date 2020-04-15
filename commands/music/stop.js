module.exports = {
    name: 'stop',
    description: 'Stops the bot and clears the queue',
    guildOnly: true,
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        // Stop
        player.queue.clear()
        player.stop()
        message.channel.send("Bot successfully stopped.")
    }
}