const textChannels = require('./channels.js');

async function welcome(client) {
  //TODO: Fix welcome
  client.channels.cache
    .get(`${textChannels.welcome}`)
    .messages.fetch({ limit: 1 })
    .then((message) => {
      console.log(message.first().content);
    });
}

exports.welcome = welcome;
