const path = require('path');
const fs = require('fs');
const yargs = require('yargs');
const request = require('request');
const csv2 = require('csv2');
const through2 = require('through2');
const CombinedStream = require('combined-stream');

// Task 4 Pipe the given file to process.stdout
function inputOutput(filePath) {
  console.log('============ inputOutput ============');

  fs.createReadStream(filePath)
    .pipe(process.stdout);
}

// Task 5 convert data from process.stdin to uppercase
// data on process.stdout using the through2 module
function transform() {
  console.log('============ transform ============');

  process.stdin
    .pipe(through2(function (buffer, encoding, next) {
      this.push(buffer.toString().toUpperCase());
      next();
    }, function (done) {
      done();
    }))
    .pipe(process.stdout);
}

// Task 6 convert file from csv to json and output data
// to process.stdout using the through2 module
function transformFile(filePath) {
  console.log('============ transformFile ============');

  fs.createReadStream(filePath)
    .pipe(csv2())
    .pipe(through2({ objectMode: true }, function (chunk, enc, next) {
      const [ id, name, brand, company, price, isbn ] = chunk;

      this.push(JSON.stringify({ id, name, brand, company, price, isbn }) + ', \n');
      next();
    }))
    .pipe(process.stdout);
}

// Task 7 to convert file from csv to json and output data
// to a result file with the same name but .json extension, using the through2 module
// and fs.createWriteStream
// There is no such function in the task, so I created one
const child_process = require("child_process");
function transformFileToJSON(filePath) {
  console.log('============ transformFileToJSON ============');
  let data = [];
  const writeStream = fs.createWriteStream(path.join('backend', 'data', 'MOCK_DATA.json'));

  fs.createReadStream(filePath)
    .pipe(csv2())
    .pipe(through2({ objectMode: true }, function (chunk, enc, next) {
      const [id, name, brand, company, price, isbn] = chunk;

      this.push({ id, name, brand, company, price, isbn });
      next();
    }))
    .on('data', function(chunk) {
      data.push(chunk);
    })
    .on('end', function () {
      writeStream.write(JSON.stringify(data));
      writeStream.end();
      data = [];
    });
}


// Have no idea why do I need httpClient and httpServer,
// there is nothing actually about these funcs in the hw
function httpClient() {
  console.log('============ httpClient ============');
  /* ... */
}

// Have no idea why do I need httpClient and httpServer,
// there is nothing actually about these funcs in the hw
function httpServer() {
  console.log('============ httpServer ============');
  /* ... */
}


// Task 8 Implement cssBundler function. It should do the following:
// Grab all css files in given path
// Contact them into one big css file
// Add contents of https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css
// at the bottom of this big css
// Output should be saved in the same path and called bundle.css
function bundleCss() {
  const combinedStream = CombinedStream.create();

  fs.readdir(path.join('frontend', 'assets', 'css'), (err, files) => {
    files.forEach(file => {
      console.log(file);
      combinedStream.append(fs.createReadStream(path.join('frontend', 'assets', 'css', file)))
    });

    combinedStream
      .append(request('https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css'))
      .pipe(fs.createWriteStream(path.join('frontend', 'assets', 'css', 'bundle.css')));
  })
}

function printHelpMessage() {
  console.log('printHelpMessage');
  /* ... */
}

let argv = yargs
  .alias('a', 'action')
  .alias('h', 'help')
  .option('help', {
    alias: 's',
    describe: 'choose a size',
    choices: ['xs', 's', 'm', 'l', 'xl']
  })
  .help('help')
  .argv

/** Entry Point */
function main() {
  let { action, file, path, help } = argv;
  console.log('action: ', action, 'file: ', file, 'help', help);

  if(!!help) {
    return;
  }

  if (!action) {
    console.log('Please put correct params');
    return;
  }

  switch (action) {
    case 'io':
      inputOutput(file);
      return;
    case 'transform':
      transform();
      return;
    case 'transform-file':
      transformFile(file);
      return;
    case 'transform-file-to-json':
      transformFileToJSON(file);
      return;
    case 'bundle-css':
      bundleCss();
      return;
    default:
      return;
  }
}

main();