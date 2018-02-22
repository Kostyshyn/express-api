var socketioJwt = require('socketio-jwt');
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');

var Events = require('../events');

module.exports = function(io, handler){

	var authenticatedUsers = {};

	Events.on('notification', function(note){
	    console.log(note.message);
	    console.log('======')
	    authenticatedUsers[note.to].forEach(function(soc){
	    	soc.emit('notification', note.message);
	    });
	});

	io.sockets.on('connection', socketioJwt.authorize({
	    secret: config.private.secretAuthKey,
	    timeout: 15000 // 15 seconds to send the authentication message 
	})).on('authenticated', function(socket) {
	    //this socket is authenticated, we are good to handle more events from it. 
	    // console.log('hello! ' + socket.decoded_token.id);

	    var client = socket.decoded_token.id; // user id for database

	    if (authenticatedUsers[client]){
	    	authenticatedUsers[client].push(socket);
	    } else {
	    	authenticatedUsers[client] = [];
	    	authenticatedUsers[client].push(socket);
	    }

	   	for (key in authenticatedUsers){
	    	if (authenticatedUsers[key].length == 0){
	    		delete authenticatedUsers[key];
	    	}
	    }

<<<<<<< HEAD
	   	for (key in authenticatedUsers){
	    	console.log(key, authenticatedUsers[key].length);
	    }
	    console.log('--------------------');
=======

	    // for (key in authenticatedUsers){
	    // 	if (authenticatedUsers[key].length == 0){
	    // 		delete authenticatedUsers[key];
	    // 	}
	    // }
>>>>>>> remotes/origin/remote-dev

	    socket.on('send.message', function(msg){
	    	console.log(msg);

	    	authenticatedUsers[client].forEach(function(soc){
	    		soc.emit('message', msg); // for all user sockets

	    	});

	    });
	    socket.on('disconnect', function(){  // trouble in disconnect
	    	authenticatedUsers[client].some(function(item, i){
	    		if (authenticatedUsers[client][i].id == socket.id){
	    			authenticatedUsers[client].splice(i, 1);
	    		}
	    	});
	    });

	});

	// io.emit('custon', 'hello from server');



	// io.sockets.on('connection', function (socket) {
	//     // console.log(socket.decoded_token.id, 'connected');

	//     console.log('connected', socket.id);

	//     //socket.on('event');
	//     socket.on('logout', function(user){
	//     	console.log(user, 'is logged out');
	//     });

	//     socket.on('authenticate', function(token){
	//     	// console.log('token', token)
	//     	if (token) {

	// 	    	jwt.verify(token, config.private.secretAuthKey, function(err, decoded){      
	// 	      		if (err) {
	// 		        	// return res.json({ success: false, message: 'Failed to authenticate token.' }); 
	// 		        	socket.emit('err', 'this is error')
	// 		      	} else {
	// 		       		// if everything is good, save to request for use in other routes
	// 		       		authenticatedUsers[socket.id] = decoded.id;
	// 		       		User.findOne({ _id: decoded.id }, function(err, user){
	// 		       			if(err){
	// 		       				console.log(err)
	// 		       			} else if (user){
	// 		       				user.online = true;
	// 		       				user.save(function(err, user){
	// 		       					if (err){
	// 		       						console.log(err);
	// 		       					}
	// 		       				});
	// 		       			} else {
	// 		       				console.log('1 user not found')
	// 		       			}
	// 		       		});
	// 		        	console.log(authenticatedUsers);    
	// 		      	}
	// 	    	});
	// 	    }
	//     });

	//     socket.on('disconnect', function(){
	//     	console.log('disconnect', socket.id)
	//     	User.findOne({ _id: authenticatedUsers[socket.id] }, function(err, user){
	//     		if(err){
	//     			console.log(err)
	//     		} else if (user){
	//     			console.log('set ofline')
	//     			user.online = false;
	//     			user.save(function(err, user){
	//     				if (err){
	//     					console.log(err);
	//     				} else {
	//     					delete authenticatedUsers[socket.id];
	// 	    				console.log(authenticatedUsers)
	//     				}
	//     			});
	//     		} else {
	//     			console.log('2 user not found')
	//     		}
	//     	});

	//     });
	// });

};