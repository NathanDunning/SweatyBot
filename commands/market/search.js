const { get } = require('../../utils/market-requests');

module.exports = {
  name: 'search',
  description:
    'Search for specific assets using the ticker name or the name of the asset.',
  guildOnly: true,
  usage: 'search <asset name>',
  async execute(client, message, args) {
    url = `https://api.tiingo.com/tiingo/utilities/search/${args[0]}`;
    get(url)
      .then((res) => {
        const obj = JSON.parse(res);
        if (obj.length > 25) {
          return message.channel.send(
            'Too many results returned, please narrow your search.'
          );
        }
        const fields = obj.map((item) => {
          return {
            name: item.name,
            value: `Ticker: ${item.ticker}\nAsset Type: ${item.assetType}\nCountry Code: ${item.countryCode}`,
          };
        });

        const embedMessage = {
          color: 0x0099ff,
          title: `Results for: ${args[0]}`,
          fields: fields,
        };
        message.channel.send({ embed: embedMessage });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
