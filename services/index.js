var Events = require('../events');

module.exports.notify = function(type, payload){
	console.log({
		type: type,
		payload: payload
	});
	// Events.emit('notification', {
	// 	type: 'following',
	// 	from: follower.id,
	// 	to: follows.id,
	// 	payload: null
	// });
};

// module.exports.online = function(user){

// };

// module.exports.offline = function(user){

// };