const { Utils } = require('erela.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'play',
  description: 'Play a song/playlist or search for a song from Youtube.',
  aliases: ['p'],
  guildOnly: true,
  usage: '[command name] [youtube URL]',
  async execute(client, message, args) {
    // Args Check
    if (!args.length) {
      return message.reply('What am I supposed to play?');
    }

    // Check user is in voice channel
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('Please join a voice channel first!');
    }

    // Check permissions
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has('CONNECT'))
      return message.channel.send(
        'I do not have permissions to connect to voice channel'
      );
    if (!permissions.has('SPEAK'))
      return message.channel.send(
        'I do not have permissions to speak in voice channel'
      );

    const player = client.music.players.spawn({
      guild: message.guild,
      textChannel: message.channel,
      voiceChannel,
    });

    client.music
      .search(args.join(' '), message.author)
      .then(async (res) => {
        switch (res.loadType) {
          case 'TRACK_LOADED':
            player.queue.add(res.tracks[0]);
            message.channel.send(
              `Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(
                res.tracks[0].duration,
                true
              )}\``
            );
            if (!player.playing) player.play();
            break;

          case 'SEARCH_RESULT':
            let index = 1;
            const tracks = res.tracks.slice(0, 5);
            const embed = new MessageEmbed()
              .setAuthor('Song Selection.', message.author.displayAvatarURL)
              .setDescription(
                tracks.map((video) => `**${index++} -** ${video.title}`)
              )
              .setFooter(
                "Respond in 30 seconds. Type 'cancel' to cancel selection"
              );

            await message.channel.send(embed);
            const collector = message.channel.createMessageCollector(
              (m) => {
                return (
                  m.author.id === message.author.id &&
                  new RegExp(`^([1-5]|cancel)$`, 'i').test(m.content)
                );
              },
              { time: 30000, max: 1 }
            );

            collector.on('collect', (m) => {
              if (/cancel/i.test(m.content)) return collector.stop('cancelled');

              const track = tracks[Number(m.content) - 1];
              player.queue.add(track);
              message.channel.send(
                `Enqueuing \`${track.title}\` \`${Utils.formatTime(
                  track.duration,
                  true
                )}\``
              );

              if (!player.playing) player.play();
            });

            collector.on('end', (_, reason) => {
              if (['time', 'cancelled'].includes(reason))
                return message.channel.send('Cancelled selection.');
            });
            break;

          case 'PLAYLIST_LOADED':
            res.playlist.tracks.forEach((track) => player.queue.add(track));
            const duration = Utils.formatTime(
              res.playlist.tracks.reduce((acc, cur) => ({
                duration: acc.duration + cur.duration,
              })).duration,
              true
            );
            message.channel.send(
              `Enqueuing \`${res.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.info.name}\``
            );

            if (!player.playing) player.play();
            break;
        }
      })
      .catch((err) => message.channel.send(err.message));
  },
};