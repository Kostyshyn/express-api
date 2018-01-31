var mongoose = require('mongoose');
var config = require('../../config');

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
	role: {
		type: Number,
		default: config.private.access.user
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	// email: {
	// 	type: String,
	// 	required: true,
	// 	unique: true
	// },
	password: {
		type: String,
		required: true
	},
	info: {
		type: String,
		default: ''
	},
	profile_img: {
		type: String,
		default: ''
	},
	online: {
		type: Boolean,
		default: false
	},
	href: {
		type: String,
		unique: true,
		trim: true,
	},
	// posts: [{
	// 	type: Schema.ObjectId,
	// 	ref: 'Post'
	// }],
	// likes: [{
	// 	type: Schema.ObjectId,
	// 	ref: 'Like'
	// }],
	// comments: [{
	// 	type: Schema.ObjectId,
	// 	ref: 'Comment'
	// }],
	created: {
		type: Date,
		default: Date.now
	}
});

userSchema.pre('save', function(next){
	this.href = this.username.toLowerCase();
	next();
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(user){
	return new Promise(function(resolve, reject){
		User.create(user, function(err, user){
			if (err){
				reject(err);
			} else {
				resolve(user);
			}
		});		
	});
};

module.exports.readUser = function(query, fields){
	var query = query;
	var fields = fields || {};
	return new Promise(function(resolve, reject){
		User.findOne(query, fields , function(err, user){
			if (err){
				reject(err);
			} else {
				resolve(user);
			}
		});	
	});
};

module.exports.allUsers = function(query, fields, options){
	var query = query || null;
	var fields = fields || {};
	var options = options || {};
	return new Promise(function(resolve, reject){
		User.find(query, fields, options, function(err, users){
			if (err){
				reject(err);
			} else {
				resolve(users);
			}
		});	
	});
};