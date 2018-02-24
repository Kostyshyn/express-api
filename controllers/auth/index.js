var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var User = require('../../models/User');
var config = require('../../config');

module.exports.register = function(req, res, next){
	var newUser = {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	};
	User.findOne({
		$or: [{ 'username': newUser.username }, { 'email': newUser.email }]
	}, function(err, user){
		if (err){
			next(err);
		} else if (user){
			var errors = [];
			var message = user.username == newUser.username ? `User with username ${ newUser.username } is already exists` : `User with email ${ newUser.email } is already exists`;
			errors.push({
				status: 403,
				message: message
			});
			res.status(403);
			res.json({
				error: errors
			});
		} else {
			User.createUser(newUser).then(function(user){

				var token = jwt.sign({ id: user._id }, config.private.secretAuthKey, {
					expiresIn: 86400 // 24 hours
				});

				var responseUser = {
					username: user.username,
					href: user.href,
					online: user.online,
					info: user.info,
					profile_img: user.profile_img,
					role: user.role,
					id: user._id,
					follows: user.follows,
					followers: user.followers
				};

				res.status(200);
				res.json({
					status: 200, 
					user: responseUser,
					token: token
				});
			}).catch(function(err){
				next(err);			
			});
		}
	});
};

module.exports.login = function(req, res, next){
	var loginInput = {
		userInput: req.body.userInput,
		password: req.body.password
	};
	User.findOne({
		$or: [{ 'username': loginInput.userInput }, { 'email': loginInput.userInput }]
	}, function(err, user){
		if (err){
			next(err);
		} else if (!user){
			var errors = [];
			errors.push({
				status: 403,
				message: config.errorMessages.authentication.login.userNotFound
			});
			res.status(403);
			res.json({
				error: errors
			});
		} else if (!isValidPassword(user, loginInput.password)){
			var errors = [];
			errors.push({
				status: 401,
				message: config.errorMessages.authentication.login.invalidPassword
			});
			res.status(401);
			res.json({
				error: errors
			});
		} else {
			var token = jwt.sign({ id: user._id }, config.private.secretAuthKey, {
				expiresIn: 86400 // 24 hours
			});

			var responseUser = {
				username: user.username,
				href: user.href,
				online: user.online,
				info: user.info,
				profile_img: user.profile_img,
				role: user.role,
				id: user._id,
				follows: user.follows,
				followers: user.followers
			};

			res.status(200);
			res.json({
				status: 200, 
				user: responseUser,
				token: token
			});			
		}
	});
};

module.exports.protected = function(req, res, next) {
 	var token = req.body.token || req.query.token || req.headers['x-access-token'];
  	if (token) {

    	jwt.verify(token, config.private.secretAuthKey, function(err, decoded){      
      		if (err) {
	        	res.status(401).json({ success: false, message: config.errorMessages.authentication.protected.tokenVerificationFailed });    
	      	} else {
	       		// if everything is good, save to request for use in other routes
	        	req.decoded = decoded;    
	        	next();
	      	}
    	});

  	} else {
    	res.status(403).json({
    		status: 403,
        	success: false, 
        	message: config.errorMessages.authentication.protected.noToken 
    	});
  	}
};

module.exports.logout = function(){};

function isValidPassword(user, password){
	return bcrypt.compareSync(password, user.password);
};
