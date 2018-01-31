var express = require('express');
var router = express.Router();

var User =  require('../../models/User');

router.post('/register', function(req, res, next) {

	var user = {
		username: req.body.username,
		password: req.body.password
	};

	console.log('user', user, req.body);

	User.createUser(user).then(function(user){
		res.status(200);
		res.json({ user: user });
	}).catch(function(err){
		next(err);
	});
});

router.get('/get/:href', function(req, res, next) {

	var query = { href: req.params.href };

	User.readUser(query).then(function(user){
		if (user){
			res.status(200);
			res.json({ user: user });
		} else {
			res.status(404);
			res.json({
				user: null,
				message: 'User not found'
			});
		}
	}).catch(function(err){
		next(err);
	});

});

module.exports = router;
