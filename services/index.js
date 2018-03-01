var Events = require('../events');
var User = require('../models/User');

module.exports.notify = function(type, payload){
	// console.log({
	// 	type: type,
	// 	payload: payload
	// });
	
	// Events.emit('notification', {
	// 	type: 'following',
	// 	from: follower.id,
	// 	to: follows.id,
	// 	payload: null
	// });
};

module.exports.setOnlineStatus = function(client, status, callback){
	User.findOne({ _id: client }, function(err, user){
		if(err){
			callback(err, null);
		} else if (user){
			user.online = status;
			user.save(function(err, user){
				if (err){
					callback(err, null);
				} else {
					callback(null, user.id);
				}
			});
		}
	});
};
