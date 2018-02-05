var express = require('express');
var router = express.Router();
var expressJoi = require('express-joi-validator');
var validator = require('../../../controllers/validators');

// 
// var userController = require('../../../controllers/user');
// 

var User =  require('../../../models/User');

router.get('/', function(req, res, next) {

	// console.log(req.user);

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
