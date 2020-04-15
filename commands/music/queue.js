const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'queue',
    description: 'Check the current songs queue',
    guildOnly: true,
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player || player.queue.empty) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        // Execute
        let index = 1
        let string = "";

        if (player.queue[0]) string += `__**Currently Playing**__\n ${player.queue[0].title} - Requested by **${player.queue[0].requester.username}**. \n`;
        if (player.queue[1]) string += `__**Queue:**__\n ${player.queue.slice(1, 10).map(song => `**${index++}**: ${song.title} - Requested by **${song.requester.username}**.`).join("\n")}`;

        const embed = new MessageEmbed()
            .setAuthor(`Current Queue`)
            .setThumbnail(player.queue[0].thumbnail)
            .setDescription(string);

        return message.channel.send(embed)
    }
}