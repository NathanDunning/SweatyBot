module.exports = {
    name: 'clear',
    description: 'Clears the queue',
    guildOnly: true,
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player || player.queue.empty) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        // Clear
        try {
            const queueLen = player.queue.size;
            player.queue.clear()
            message.channel.send(`Successfully cleared ${queueLen} songs from the queue.`)
        } catch (err) {
            console.error(err)
            message.channel.send("There was an error clearing the queue.")
        }
    }
}