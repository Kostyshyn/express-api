var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var User = require('../User');
var Chat = require('./chat.js');

var messageSchema = mongoose.Schema({
	chat: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
	},
    message : String,
    meta : [{
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        // delivered : Boolean,
        read : {
        	type: Boolean,
        	default: false
        }
    }],
	created: {
		type: Date,
		default: Date.now
	}
});

var Message = module.exports = mongoose.model('Message', messageSchema);