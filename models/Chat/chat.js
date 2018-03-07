var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var User = require('../User');
var Message = require('./message.js');

var chatSchema = mongoose.Schema({
	participant1: {                
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
  	participant2: {                
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Message'
    }],
	created: {
		type: Date,
		default: Date.now
	}
});

var Chat = module.exports = mongoose.model('Chat', chatSchema);

module.exports.createChat = function(chat){
	return new Promise(function(resolve, reject){
		Chat.create(chat, function(err, chat){
			if (err){
				reject(err);
			} else {
				resolve(chat);
			}
		});		
	});
};

module.exports.readChat = function(query, fields, populate){
	var query = query;
	var fields = fields || {};
	var populate = populate || null;
	return new Promise(function(resolve, reject){
		Chat.findOne(query, fields).populate(populate).exec(function(err, chat){
			if (err){
				reject(err);
			} else {
				resolve(chat);
			}
		});	
	});
};

module.exports.addMessage = function(query, message){
	var query = query;
	var message = message || {};
	return new Promise(function(resolve, reject){
		Chat.findOneAndUpdate(query, {
			$push: {
				messages: message
			}
		}, { new: true }, function(err, chat){
			if (err){
				reject(err);
			} else {
				resolve(chat);
			}
		});	
	});
};