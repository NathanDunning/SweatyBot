var dateFormat = require('dateformat');
const { get } = require('../../utils/market-requests');

module.exports = {
  name: 'price',
  description:
    "Search for last stock price from Forex or Cypto. If searching for Crypto, specify 'crypto' as the first price argument",
  guildOnly: true,
  args: true,
  usage: 'search <ticker>; for crypto -> search crypto <ticker>',
  /**
   *
   * @param {*} client
   * @param {*} message
   * @param {Array} args
   */
  async execute(client, message, args) {
    if (args[0].toUpperCase() === 'crypto'.toUpperCase()) {
      if (args.length < 2) {
        return message.channel.send(
          "Please provide arguments for this command, use the 'help price' command for more information on usage"
        );
      }

      let url = `https://api.tiingo.com/tiingo/crypto/top?tickers=${args[1]}`;
      let tickerArgs = args[1];

      if (args.length > 2) {
        for (let i = 2; i < args.length; i++) {
          url += `,${args[i]}`;
        }
      }

      get(url)
        .then((res) => {
          const obj = JSON.parse(res);

          const fields = obj.map((item) => {
            return {
              name: item.ticker.toUpperCase(),
              value: `Last Price: $${item.topOfBookData[0].lastPrice.toLocaleString()}\nLast Transaction: ${dateFormat(
                new Date(item.topOfBookData[0].lastSaleTimestamp),
                'UTC:HH:MM:ss dd mmm yyyy Z'
              )}`,
            };
          });

          const embedMessage = {
            color: 0x0099ff,
            title: `Prices for: ${tickerArgs.toUpperCase()}`,
            fields: fields,
          };

          message.channel.send({ embed: embedMessage });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let url = `https://api.tiingo.com/tiingo/daily/${args[0]}/prices`;

      get(url)
        .then((res) => {
          const obj = JSON.parse(res);

          const embedMessage = {
            color: 0x0099ff,
            title: `Prices for: ${args[0].toUpperCase()}`,
            description: `Open: ${obj[0].open}\nLow: ${obj[0].low}\nHigh: ${
              obj[0].high
            }\n**Close: ${obj[0].close}**\n Gain: ${(
              obj[0].close - obj[0].open
            ).toFixed(2)}`,
            footer: {
              text: dateFormat(obj[0].date, 'UTC:HH:MM:ss dd mmm yyyy Z'),
            },
          };

          message.channel.send({ embed: embedMessage });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
