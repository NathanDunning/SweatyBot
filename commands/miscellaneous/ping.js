module.exports = {
  name: 'ping',
  description: 'Prints the delay of messages and the client',
  async execute(client, message, args) {
    const msg = await message.channel.send("Pinging...");
    msg.edit(`Pong!\nMessage is **${Math.floor(msg.createdAt - message.createdAt)} ms**\nClient Latency is **${Math.round(client.ws.ping)} ms**`);
  }
};
