var express = require('express');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  var buffer = require('fs').readFileSync('./index.html');
  response.send(buffer.toString());
});

app.get('/img/AddRecipe.jpg', function(request, response) {
	sendStaticFile(request, response, './img/AddRecipe.jpg');
});


app.get('/img/empty.jpg', function(request, response) {
	sendStaticFile(request, response, './img/empty.jpg');
});


app.get('/img/idea.jpg', function(request, response) {
	sendStaticFile(request, response, './img/idea.jpg');
});


function sendStaticFile(request, response, filename) {
  var fs = require('fs');
  fs.stat(filename, function (err, stat) {
    if (err) throw err;
    var buffer = fs.readFileSync(filename);
    response.setHeader('Content-Type', 'image/jpeg');
    response.setHeader('Content-Length', stat.size);
    response.end(buffer);
  });
};


var port = process.env.PORT || 8124;
app.listen(port, function() {
  console.log("Listening on " + port);
});
