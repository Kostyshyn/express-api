const EventEmitter = require('events').EventEmitter;
var Events = new EventEmitter();

module.exports = Events;

Events.on('s', function(r){
	console.log(r)
})



