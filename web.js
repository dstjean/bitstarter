var express = require('express');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  var buffer = require('fs').readFileSync('./index.html');
  response.send(buffer.toString());
});

app.get('/img/AddRecipe.jpg', function(request, response) {
  var fs = require('fs');
  fs.stat('./img/AddRecipe.jpg', function (err, stat) {
    if (err) throw err;
    var buffer = fs.readFileSync('./img/AddRecipe.jpg');
    response.setHeader('Content-Type', 'image/jpeg');
    response.setHeader('Content-Length', stat.size);
    response.end(buffer);
  });
});

app.get('/original.html', function(request, response) {
  var buffer = require('fs').readFileSync('./index.html.bak');
  response.send(buffer.toString());
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
