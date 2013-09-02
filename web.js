var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.get('/', function(request, response) {
  var buffer = require('fs').readFileSync('./index.html');
  response.send(buffer.toString());
});

var db = require('./models');
var config = require('./.env');
var request = require('request');
app.post('/invite', function(req, res) {
	var data = {
		privatekey: config.CAPTCHA_PRIVATE,
		remoteip: req.remoteaddr, 
		challenge : req.body.challenge,
		response: req.body.response
	}
	
	request.post('http://www.google.com/recaptcha/api/verify', {form:data}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		console.log(body) // Print the google web page.
		var lines = body.replace(/\r\n?/g, "\n").split("\n");
		if (lines.length == 2 && lines[0] == 'true') {
			db.Invite.findOrCreate({email: req.body.email}, { request_date: new Date(), request_type: 'free' })
			.success(function(invite, created) {
				if (created) {
					res.statusCode = 200;
					res.send(JSON.stringify({'message': 'Invitation Request Received'}));
				} else {
					res.statusCode = 200;
					res.send(JSON.stringify({'message' : 'Invitation Request Already Received'}));
				}
			}).error(function (err) {
				if (err.email) {
					res.statusCode = 400;
					res.send(JSON.stringify({'message': err.email[0]}));
				} else {
					res.statusCode = 400;
					res.send(JSON.stringify({"message" : "General Error. Try again later."}));
				}
			});

		} else if (lines.length == 2 && lines[0] == 'false') {
			res.statusCode = 400;
			res.send(JSON.stringify({'message': 'Invalid Captcha Please Try again.'}));
		} else {
			res.statusCode = 400;
			res.send(JSON.stringify({'message': 'General Error. Try again later'}));
		}
	  } else {
		res.statusCode = 400;
		res.send(JSON.stringify({'message': 'General Error. Try again later'}));
	  }
	});
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
