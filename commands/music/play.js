const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  description: 'Play a track from Youtube.',
  aliases: ['commands'],
  guildOnly: true,
  usage: '[command name] [youtube URL]',
  async execute(message, args) {
    // Args Check
    if (!args.length) {
      return message.reply('What am I supposed to play?');
    }

    // Check user is in voice channel
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('Please join a voice channel first!');
    }

    const URL = args[0].toLowerCase();
    const connection = await voiceChannel.join();
    const stream = ytdl(`'${URL}'`, {
      filter: 'audioonly',
    });

    const dispatcher = connection.play(stream);
    dispatcher.on('end', () => voiceChannel.leave());
  },
};
