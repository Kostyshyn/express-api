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

router.get('/get/:username', function(req, res, next) {

	var username = req.params.username;

	console.log(username)

	User.readUser({ username: username }).then(function(user){
		console.log(2, user);
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
