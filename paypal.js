var ipn = require('paypal-ipn');

var verify = function(req, res) {
  ipn.verify(req.body, function callback(err, msg) {
    if (err) {
      console.error(msg);
    } else {
      //Do stuff with original params here
  
      if (req.body.payment_status == 'Completed') {
			db.Invite.findOrCreate({email: req.body.receiver_email || req.body.payer_email }, { request_date: new Date(), request_type: 'premium', payment_type: 'paypal' })
			.success(function(invite, created) {
				if (created) {
					res.statusCode = 200;
					res.send(JSON.stringify({'message': 'Thank you'}));
				} else {
					invite.request_type = 'premium';
					invite.payment_method = 'paypal';
					invite.save().success(function() {
						res.statusCode = 200;
						res.send(JSON.stringify({'message' : 'Thank you'}));
					}).error(function(error) {
						console.log(error);
					res.statusCode = 400;
					res.send(JSON.stringify({'message': error}));
					});

				}
			}).error(function (err) {
				if (err.email) {
					res.statusCode = 400;
					res.send(JSON.stringify({'message': err}));
				} else {
					res.statusCode = 400;
					res.send(JSON.stringify({"message" : err}));
				}
			});
      }
    }
  });	
}

module.exports.verify = verify;