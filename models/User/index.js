var mongoose = require('mongoose');
var config = require('../../config');
var bcrypt = require('bcrypt-nodejs');

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
	email: {
		type: String,
		required: true,
		unique: true
	},
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
		default: 'public_images/128_profile_placeholder.png'
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
	followers: [{
		id: Schema.ObjectId
	}],
	follows: [{
		id: Schema.ObjectId
	}],
	last_seen: {
		type: Date,
		default: Date.now		
	},
	created: {
		type: Date,
		default: Date.now
	}
});

userSchema.pre('save', function(next){
	this.href = this.username.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}|=\-_`~()]/g,"");
	var user = this;
	if (user.isModified('password')){

		var hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
		user.password = hash;
		next(null, user);
		
	} 
	return next();
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

module.exports.readUser = function(query, fields, populate){
	var query = query;
	var fields = fields || {};
	var populate = populate || null;
	return new Promise(function(resolve, reject){
		User.findOne(query, fields, function(err, user){
			if (err){
				reject(err);
			} else {
				resolve(user);
			}
		});	
	});
};

module.exports.updateUser = function(query, fields, options){
	var query = query;
	var fields = fields || {};
	var options = options || { 'fields': '-password',  new: true };
	return new Promise(function(resolve, reject){
		User.findOneAndUpdate(query, fields, options,function(err, user){
			if (err){
				reject(err);
			} else {
				resolve(user);
			}
		});	
	});
};

module.exports.allUsers = function(query, fields, options, sort, limit, skip){
	var query = query || null;
	var fields = fields || {};
	var options = options || {};
	var sort = sort || null;
	var limit = limit || null;
	var skip = skip || null;
	return new Promise(function(resolve, reject){
		User.find(query, fields, options).limit(limit).skip(skip).sort(sort).exec(function(err, users){
			if (err){
				reject(err);
			} else {
				resolve(users);
			}
		});	
	});
};

