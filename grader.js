#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var isValidUrl = function(url) {
  var regEx = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return regEx.test(url);
}

var assertValidUrl = function(infile) {
  var instr = infile.toString();
  if (isValidUrl(instr)) {
    return instr;
  } else {
    console.log("%s is not a valid URL. Exiting.", instr);
    process.exit(1);
  }
}

var cheerioHtmlData = function(htmldata) {
    return cheerio.load(htmldata);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var loadHtmlData = function (htmlfile, callback) {
    if (isValidUrl(htmlfile.toString())) {
      restler.get(htmlfile.toString()).on('complete', function (data, response) {
        if (response == null || response.statusCode != 200) {
          console.log('An error occured while retrieving the file. Exiting.');
          process.exit(1);
        } else {
          var cheerioData = cheerioHtmlData(data);
          callback(cheerioData);
        }
      });
    } else {
      var data = cheerioHtmlData(fs.readFileSync(htmlfile.toString()));
      callback(data);
    }
}

var checkHtmlFile = function(htmlfile, checksfile, callback) {
      loadHtmlData(htmlfile, function (data) {
      var checks = loadChecks(checksfile).sort();
      var out = {};
      for(var ii in checks) {
          var present = data(checks[ii]).length > 0;
          out[checks[ii]] = present;
      }
      callback(out);
    });
};

if(require.main == module) {
    program
        .option('-c, --checks <path> ', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
        .option('-f, --file <path>', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'Url to index.html', assertValidUrl)
        .parse(process.argv);
      var checkJson = checkHtmlFile(program.url || program.file, program.checks, function (checkJson) {
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);
    });
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
