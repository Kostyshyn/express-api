var User = require('../../models/User');
var config = require('../../config');
var Events = require('../../events');
var sharp = require('sharp');
var upload = require('../upload');
var uploadImage = upload.upload.single('profile-image');
var fs = require('fs');

module.exports.getAllUsers = function(req, res, next){
	User.allUsers(null, '-password -email').then(function(users){
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
	User.readUser(query, '-password', 'followers follows').then(function(user){
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

module.exports.getUserRelations = function(req, res, next){
	var query = { href: req.params.href };
	User.readUser(query, '-password', 'followers follows').then(function(user){
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
			User.allUsers({
				'_id': {
					$in: user.followers
				}
			}, '-password -email').then(function(followers){
				User.allUsers({
					'_id': {
						$in: user.follows
					}
				}, '-password -email').then(function(follows){
					res.status(200).json({
						status: 200,
						followers: followers,
						follows: follows
					});
				}).catch(function(err){
					next(err);
				})
			}).catch(function(err){
				next(err);
			})
		}
	}).catch(function(err){
		next(err);
	})
};

module.exports.updateUser = function(req, res, next){
	var query = { _id: req.decoded.id };
	uploadImage(req, res, function(err){
		if (err){
			var errors = [];
			errors.push({
				status: 422,
				message: err.message
			});
			res.status(422).json({
				errors: errors
			});	
		} else {
			var file = req.file || null;

			// console.log('file', file);
			if (file){
				sharp('./' + file.path)
					.resize(128, 128)
					.toFile(file.destination + '/thumb-' + file.filename)
					.then(function(){
						User.updateUser(query, {
							"$set": {
								profile_img: file.destination.substr(2) + '/thumb-' + file.filename
							}
						}).then(function(user){
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
						});
					});
			}
		}
	});
};

module.exports.followUser = function(req, res, next){
	var follower = req.decoded.id;
	var follows = req.params.href;
	var followerQuery = { _id: follower };
	User.readUser(followerQuery, '-password').then(function(follower){
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
			User.readUser(followsQuery, '-password').then(function(follows){
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
					if (follower.id == follows.id){

						var errors = [];
						errors.push({
							status: 404,
							message: 'You can\'t follow yourself'
						});
						res.status(404).json({
							errors: errors
						});
					} else {
						if (isFollow(follower.follows, follows)){
							User.findOneAndUpdate(followerQuery, {
								$pull: { follows: {
									_id: follows._id.toString()
								} }
							}, {
								new: true
							}, function(err, follower){
								if (err){
									next(err);
								} else {
									User.findOneAndUpdate(followsQuery, {
										$pull: { followers: {
											_id: follower._id.toString()
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
							follower.follows.push(follows.id);
							follower.save(function(err, follower){
								if (err){
									next(err);
								} else {
									follows.followers.push(follower.id);
									follows.save(function(err, follows){
										if (err){
											next(err);
										} else {
											Events.emit('notification', {
												type: 'following',
												from: follower.id,
												to: follows.id,
												payload: null
											});
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
		if (followers[i]._id.toString() == follows._id.toString()){
			found = true;
			break;
		}
	}
	return found;
};