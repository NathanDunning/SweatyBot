
module.exports = {
    name: 'seek',
    description: 'Set track to given time',
    guildOnly: true,
    args: true,
    usage: '[command name] [mm:ss]',
    async execute(client, message, args) {
        // Checks
        const player = client.music.players.get(message.guild.id)
        if (!player) return message.channel.send("No songs currently playing")

        const { voice } = message.member;
        if (!voice || voice.channelID !== player.voiceChannel.id) return message.channel.send("You're not in the same voice channel as the bot")

        const isValid = (time) => {
            console.log(time)
            if (time[0] < 0 || time[0] > 59) return false
            if (time[1] < 0 || time[1] > 59) return false
            if (time[2] < 0) return false
            return true
        }

        if (!isValid(args[0].split(':').reverse())) {
            return message.channel.send("The timestamp you've given me is invalid")
        };

        // Seek
        let timeArr = args[0].split(':');
        let time = 0;
        if (timeArr.length === 1) time = timeArr[0] * 1000;
        if (timeArr.length === 2) {
            time += timeArr[1] * 1000 // sec
            time += timeArr[0] * 60000 // min; 60 * 1000
        }
        if (timeArr.length === 3) {
            time += timeArr[2] * 1000 // sec
            time += timeArr[1] * 60000 // min; 60 * 1000
            time += timeArr[0] * 3600 * 1000 // hour
        }

        try {
            player.seek(time)
        } catch (err) {
            console.error(err.message, time)
            message.channel.send("I could not process that, perhaps you gave me a number out of the song's range")
        }
    }
} 