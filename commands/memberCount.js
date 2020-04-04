module.exports = {
  name: 'memberCount',
  description: 'Returns a count of the number of members in the server',
  guideOnly: true,
  execute(message) {
    message.channel.send(
      `Total Members in server: ${message.guild.memberCount}`
    );
  }
};
