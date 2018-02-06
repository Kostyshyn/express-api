var socketioJwt = require('socketio-jwt');
var config = require('../config');

module.exports = function(io){
	// io.set('authorization', socketioJwt.authorize({
	// 	secret: config.private.secretAuthKey,
	//   	handshake: true
	// }));

	io.sockets.on('connection', function (socket) {
	     // console.log(socket.handshake.decoded_token.email, 'connected');

	     //socket.on('event');
	     socket.on('logout', function(user){
	     	console.log(user, 'is logged out');
	     });
	});
};