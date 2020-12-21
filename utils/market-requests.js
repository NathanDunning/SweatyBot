var request = require('request');
require('dotenv').config();

function get(url) {
  var requestOptions = {
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.TIINGO_API_KEY,
    },
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, function (error, response, body) {
      //TODO: Error Handling
      if (error) {
        console.error(error);
        reject(body);
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = {
  get: get,
};
