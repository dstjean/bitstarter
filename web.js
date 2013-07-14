var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var buffer = require('fs').readFileSync('./index.html');
  response.send(buffer.toString());
});

app.get('/original.html', function(request, response) {
  var buffer = require('fs').readFileSync('./index.html.bak');
  response.send(buffer.toString());
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
