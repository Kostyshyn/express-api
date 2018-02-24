const EventEmitter = require('events').EventEmitter;
var Events = new EventEmitter();

module.exports = Events;

// Events.on('notification', function(notification){
// 	console.log(notification);
// });

// setInterval(function(){
// 	Events.emit('notification', {
// 		to: '5a7982863107221894e671e2',
// 		message: 'Hello kos'
// 	});
// }, 3000)



