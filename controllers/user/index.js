var User = require('../../models/User');
var config = require('../../config');
var Events = require('../../events');

module.exports.getAllUsers = function(req, res, next){
	User.allUsers(null, '-password').then(function(users){
		if (users.length == 0){
			res.status(204).json({
				status: 204,
				message: 'No data',
				users: users
			});	
		} else {
			res.status(200).json({
				status: 200,
				users: users
			});
		}
	}).catch(function(err){
		next(err);
	})
};

module.exports.getUser = function(req, res, next){
	var query = { href: req.params.href };
	User.readUser(query, '-password', 'followers').then(function(user){
		if (!user){
			var errors = [];
			errors.push({
				status: 404,
				message: 'User not found'
			});
			res.status(404).json({
				errors: errors
			});	
		} else {
			res.status(200).json({
				status: 200,
				user: user
			});
		}
	}).catch(function(err){
		next(err);
	})
};

module.exports.followUser = function(req, res, next){
	var follower = req.body.follower;
	var follows = req.params.href;
	var followerQuery = { _id: follower };
	User.readUser(followerQuery, '-password', 'follows').then(function(follower){
		if (!follower){
			var errors = [];
			errors.push({
				status: 404,
				message: 'User not found'
			});
			res.status(404).json({
				errors: errors
			});	
		} else {
			var followsQuery = { href: follows };
			User.readUser(followsQuery, '-password', 'followers').then(function(follows){
				if (!follows){
					var errors = [];
					errors.push({
						status: 404,
						message: 'User not found'
					});
					res.status(404).json({
						errors: errors
					});	
				} else {
					console.log(follower.username, follows.username);
					if (isFollow(follower.follows, follows)){
						User.findOneAndUpdate(followerQuery, {
							$pull: { follows: {
								_id: follows.id
							} }
						}, {
							new: true
						}, function(err, follower){
							if (err){
								next(err);
							} else {
								User.findOneAndUpdate(followsQuery, {
									$pull: { followers: {
										_id: follower.id
									} }
								}, {
									new: true
								}, function(err, follows){
									if (err){
										next(err);
									} else {
										res.status(200).json({
											status: 200,
											user: follows
										});
									}
								});
							}							
						});
					} else {
						User.findOneAndUpdate(followerQuery, {
							$push: { follows: follows }
						}, {
							new: true
						}, function(err, follower){
							if (err){
								next(err);
							} else {
								User.findOneAndUpdate(followsQuery, {
									$push: { followers: follower }
								}, {
									new: true
								}, function(err, follows){
									if (err){
										next(err);
									} else {
										// Events.emit('notification', {
										// 	type: 'following',
										// 	from: follower.id,
										// 	to: follows.id,
										// 	payload: null
										// });
										res.status(200).json({
											status: 200,
											user: follows
										});
									}
								});
							}							
						});
					}
				}
			});
		}
	}).catch(function(err){
		next(err);
	})
};

// module.exports.logout = function(req, res, next){};

function isFollow(followers, follows){ // array of followers and follows object
	var found = false;
	for (var i = 0; i < followers.length; i++){
		if (followers[i].id == follows.id){
			found = true;
			break;
		}
	}
	return found;
};