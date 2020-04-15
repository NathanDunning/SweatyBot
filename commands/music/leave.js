module.exports = {
    name: 'leave',
    description: 'Makes bot leave the voice channel',
    aliases: ['bye', 'disconnect'],
    guildOnly: true,
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        // Leave
        client.music.players.destroy(message.guild.id)
        return message.channel.send('Bye!')
    }
}