module.exports = {
  name: 'memberCount',
  description: 'Returns a count of the number of members in the server',
  execute(message, args) {
    message.channel.send(
      `Total Members in server: ${message.guild.memberCount}`
    );
  }
};
