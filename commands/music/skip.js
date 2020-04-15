module.exports = {
    name: 'skip',
    description: 'Skips the current track',
    aliases: ['next'],
    guildOnly: true,
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        // Skip
        player.stop()
    }
}