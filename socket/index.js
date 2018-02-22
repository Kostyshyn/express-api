var socketioJwt = require('socketio-jwt');
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');

var Events = require('../events');

module.exports = function(io, handler){

	var authenticatedUsers = {};

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

};