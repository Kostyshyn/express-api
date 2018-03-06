var User = require('../../models/User');
var Chat = require('../../models/Chat/chat.js');
var Message = require('../../models/Chat/message.js');

var config = require('../../config');
var Events = require('../../events');

// module.exports.getAllUsers = function(req, res, next){
// 	User.allUsers(null, '-password').then(function(users){
// 		if (users.length == 0){
// 			res.status(204).json({
// 				status: 204,
// 				message: 'No data',
// 				users: users
// 			});	
// 		} else {
// 			res.status(200).json({
// 				status: 200,
// 				users: users
// 			});
// 		}
// 	}).catch(function(err){
// 		next(err);
// 	})
// };