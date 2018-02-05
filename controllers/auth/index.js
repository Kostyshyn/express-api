var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var User = require('../../models/User');
var config = require('../../config');

module.exports.register = function(req, res, next){
	var newUser = {
		username: req.body.credentials.username,
		password: req.body.credentials.password,
		email: req.body.credentials.email
	};

	User.findOne({
		'username': newUser.username
	}, function(err, user){
		if (err){
			next(err);
		} else if (user){
			res.status(403);
			res.json({
				error: {
					status: 403,
					message: `User ${ newUser.username } is already exists`
				}
			});
		} else {

			User.createUser(newUser).then(function(user){

				var token = jwt.sign({ id: user._id }, config.private.secretAuthKey, {
					expiresIn: 86400 // 24 hours
				});

				res.status(200);
				res.json({
					status: 200, 
					user: user,
					token: token
				});
			}).catch(function(err){
				next(err);			
			});

		}
	});
};

module.exports.login = function(req, res, next){};

module.exports.logout = function(){};

function isValidPassword(user, password){
	return bcrypt.compareSync(password, user.password);
};
