const http = require('http');
const fs = require('fs');
const path = require('path');

const htmlString = fs.readFileSync(path.join('.', 'index.html'), 'utf-8');
const template = htmlString.replace(/\{(.*?)\}/, "Hey, this is new title");

http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  // Choose one option 1e or 1g

  //This is 1e task
  response.write(template);
  response.end();

  // This is 1g task, uncomment
  // fs.createReadStream(path.join('.', 'index.html'))
  //   .pipe(response);
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/ or http://localhost:8081/');