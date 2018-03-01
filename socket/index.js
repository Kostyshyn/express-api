var socketioJwt = require('socketio-jwt');
var jwt = require('jsonwebtoken');
var config = require('../config');
var service = require('../services');

var mongoose = require('mongoose');
var User = require('../models/User');

var Events = require('../events');

module.exports = function(io, handler){

	var authenticatedUsers = {};

	Events.on('notification', function(notification){
	    // console.log(notification);
	    if (authenticatedUsers[notification.to]){
		    authenticatedUsers[notification.to].forEach(function(soc){
		    	soc.emit('notification', notification);
		    });
	    }
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

	    	service.setOnlineStatus(client, true, function(err, user){
	    		if (err){
	    			console.log(err);
	    		}
	    	});
	    }

	   	for (key in authenticatedUsers){
	    	if (authenticatedUsers[key].length == 0){
	    		delete authenticatedUsers[key];
	    	}
	    }

	    socket.on('send.message', function(msg){
	    	console.log(msg);

	    	authenticatedUsers[client].forEach(function(soc){
	    		soc.emit('message', msg); // for all user sockets

	    	});

	    });

	    // socket.on('get.online.users', function(){
	    // 	console.log('get users');
	    // 	var usersId = [];
	    // 	for (key in authenticatedUsers){
	    // 		usersId.push(mongoose.Types.ObjectId(key));
		   //  }
		   // 	User.find({ _id: {
	    // 			$in: usersId
	    // 		} }, function(err, users){
			  //      	if(err){
			  //      		console.log(err)
			  //      	} else if (users){
			  //      		socket.emit('online.users', users);
			  //      	} else {
			  //      		console.log('users not found')
			  //      	}	    			
	    // 		});

	    // });

	    socket.on('disconnect', function(){  // trouble in disconnect
	    	authenticatedUsers[client].some(function(item, i){
	    		if (authenticatedUsers[client][i].id == socket.id){
	    			authenticatedUsers[client].splice(i, 1);
	    			if (authenticatedUsers[client].length == 0){
				    	service.setOnlineStatus(client, false, function(err, user){
				    		if (err){
				    			console.log(err);
				    		}
				    	});	    				
	    				delete authenticatedUsers[client];
	    			}
	    		}
	    	});
	    });

	});
};