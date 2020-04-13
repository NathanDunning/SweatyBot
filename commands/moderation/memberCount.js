module.exports = {
  name: 'membercount',
  description: 'Returns a count of the number of members in the server',
  guildOnly: true,
  execute(message) {
    message.channel.send(
      `Total Members in server: ${message.guild.memberCount}`
    );
  },
};
