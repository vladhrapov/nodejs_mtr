const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

http.createServer(function (request, response) {
  const urlParsed = url.parse(request.url, true);

  response.writeHead(200, { 'Content-Type': 'text/plain' });

  if (urlParsed.query.message) {
    response.write(urlParsed.query.message);
  } else {
    response.write('not found message query param, please put host?message=[your message]');
  }

  request.pipe(response);
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/ or http://localhost:8081/');