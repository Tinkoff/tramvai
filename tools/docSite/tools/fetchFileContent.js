const https = require('https');

function fetchFileContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let fileContent = '';

      response.setEncoding('utf8');

      response.on('data', (chunk) => {
        fileContent += chunk;
      });
      response.on('end', () => {
        resolve(fileContent);
      });
      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

module.exports = fetchFileContent;
