var mongoose = require('mongoose');
var config = require('../../config');

var Schema = mongoose.Schema;
var User = require('../User');
var Chat = require('./chat.js');

var messageSchema = mongoose.Schema({
	chat: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chat'
	},
    message : String,
    classify: {
        type: Number,
        default: config.chat.messageType.text
    },
    meta : {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        delivered : {
            type: Boolean,
            default: false
        },
        read : {
        	type: Boolean,
        	default: false
        }
    },
	created: {
		type: Date,
		default: Date.now
	}
});

var Message = module.exports = mongoose.model('Message', messageSchema);

module.exports.createMessage = function(message){
    return new Promise(function(resolve, reject){
        Message.create(message, function(err, message){
            if (err){
                reject(err);
            } else {
                resolve(message);
            }
        });     
    });
};

module.exports.getMessages = function(query, fields, limit, skip, sort){
    var query = query;
    var fields = fields || {};
    var sort = sort || null;
    var limit = limit || null;
    var skip = skip || null;
    return new Promise(function(resolve, reject){
        Message.find(query, fields).sort(sort).limit(limit).skip(skip).exec(function(err, messages){
            if (err){
                reject(err);
            } else {
                resolve(messages);
            }
        }); 
    });
};