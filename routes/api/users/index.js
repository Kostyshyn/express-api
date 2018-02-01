var express = require('express');
var router = express.Router();

var User =  require('../../../models/User');

router.post('/register', function(req, res, next) {

	var user = {
		username: req.body.credentials.username,
		password: req.body.credentials.password
	};

	User.createUser(user).then(function(user){
		res.status(200);
		res.json({ user: user });
	}).catch(function(err){
		if (err.name == 'ValidationError' ){
			res.status(400);
			res.json({ error: {
					name: 'ValidationError',
					message: 'User validation failed',
					error: err.errors
				} 
			});		
		} else {
			next(err);			
		}
	});
});

router.get('/', function(req, res, next) {

	User.allUsers().then(function(users){
		if (users){
			res.status(200);
			res.json({ users: users });
		} else {
			res.status(404);
			res.json({
				user: null,
				message: 'Users not found'
			});
		}
	}).catch(function(err){
		next(err);
	});

});

router.get('/:href', function(req, res, next) {

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
