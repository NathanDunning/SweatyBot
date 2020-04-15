module.exports = {
    name: 'summon',
    description: 'Summon bot to voice command',
    aliases: ['join'],
    guildOnly: true,
    async execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send("You are not in a voice channel")

        const connection = await message.member.voice.channel.join()

    }
}