// var socketioJwt = require('socketio-jwt');
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');

module.exports = function(io, handler){
	// io.use(socketioJwt.authorize({
	// 	secret: config.private.secretAuthKey,
	//   	handshake: true
	// }));

	var authenticatedUsers = {};

	io.sockets.on('connection', function (socket) {
	    // console.log(socket.decoded_token.id, 'connected');

	    console.log('connected', socket.id);

	    //socket.on('event');
	    socket.on('logout', function(user){
	    	console.log(user, 'is logged out');
	    });

	    socket.on('authenticate', function(token){
	    	// console.log('token', token)
	    	if (token) {

		    	jwt.verify(token, config.private.secretAuthKey, function(err, decoded){      
		      		if (err) {
			        	// return res.json({ success: false, message: 'Failed to authenticate token.' }); 
			        	socket.emit('err', 'this is error')
			      	} else {
			       		// if everything is good, save to request for use in other routes
			       		authenticatedUsers[socket.id] = decoded.id;
			       		User.findOne({ _id: decoded.id }, function(err, user){
			       			if(err){
			       				console.log(err)
			       			} else if (user){
			       				user.online = true;
			       				user.save(function(err, user){
			       					if (err){
			       						console.log(err);
			       					}
			       				});
			       			} else {
			       				console.log('user not found')
			       			}
			       		});
			        	console.log(authenticatedUsers);    
			      	}
		    	});
		    }
	    });

	    socket.on('disconnect', function(){
	    	console.log('disconnect', socket.id)
	    	User.findOne({ _id: authenticatedUsers[socket.id] }, function(err, user){
	    		if(err){
	    			console.log(err)
	    		} else if (user){
	    			user.online = false;
	    			user.save(function(err, user){
	    				if (err){
	    					console.log(err);
	    				} else {
	    					delete authenticatedUsers[socket.id];
		    				console.log(authenticatedUsers)
	    				}
	    			});
	    		} else {
	    			console.log('user not found')
	    		}
	    	});

	    });
	});

};