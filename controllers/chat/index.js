var User = require('../../models/User');
var Chat = require('../../models/Chat/chat.js');
var Message = require('../../models/Chat/message.js');

var config = require('../../config');
var Events = require('../../events');

module.exports.openChat = function(req, res, next){
	var participant1 = req.decoded.id;
	var participant2 = req.params.href;
	var participant1Query = { _id: participant1 };
	var participant2Query = { href: participant2 };

	User.readUser(participant1Query, '-password').then(function(participant1){
		if (!participant1){
			var errors = [];
			errors.push({
				status: 404,
				message: 'User not found'
			});
			res.status(404).json({
				errors: errors
			});	
		} else {
			User.readUser(participant2Query, '-password').then(function(participant2){
				if (!participant2){
					var errors = [];
					errors.push({
						status: 404,
						message: 'User not found'
					});
					res.status(404).json({
						errors: errors
					});	
				} else {
					if (participant1.id == participant2.id){
						var errors = [];
						errors.push({
							status: 404,
							message: 'You can\'t send message to  yourself'
						});
						res.status(404).json({
							errors: errors
						});
					} else {
						var skip = config.chat.loadMessagesSkip;
						Chat.readChat({
							$or: [
								{
									participant1: participant1._id,
									participant2: participant2._id
								},
								{
									participant1: participant2._id,
									participant2: participant1._id
								}
							]
						}, {
							messages: { $slice: -skip }
						}, 'participant1 participant2 messages'
						).then(function(chat){
							if (chat){
								res.status(200).json({
									status: 200,
									chat: chat
								});
							} else {
								Chat.createChat({
									participant1: participant1,
									participant2: participant2
								}).then(function(chat){
									res.status(200).json({
										status: 200,
										chat: chat
									});
								}).catch(function(err){
									next(err);
								});
							}
						}).catch(function(err){
							next(err);
						});
					}
				}
			}).catch(function(err){
				next(err);
			});

		}
	}).catch(function(err){
		next(err);
	});

};

module.exports.sendMessage = function(req, res, next){
	var participant1 = req.decoded.id;
	var messageText = req.body.message;
	var created = req.body.created;
	var chatId = req.body.chat;

	Chat.readChat({ _id: chatId }, '', 'participant1 participant2 messages').then(function(chat){
		if (chat){
			User.readUser({
				_id: participant1
			}, '-password').then(function(user){
				if (user){
					Message.createMessage({
						chat: chat,
						message: messageText,
						meta: {
							user: user,
							delivered: true
						},
						created: created
					}).then(function(message){
						Chat.addMessage({ 
							_id: chatId 
						}, message ).then(function(chat_to_add){
							res.status(200).json({
								status: 200,
								message: message
							});
							var to;
							if (chat.participant1._id == participant1){
								to = chat.participant2._id;
							} else {
								to = chat.participant1._id;
							}
							Events.emit('notification', {
								to: to,
								type: 'message',
								payload: {
									message: message.message,
									meta: {
										delivered: message.meta.delivered,
										read: message.meta.read,
										user: message.meta.user._id
									},
									created: message.created,
									_id: message._id
								}
							});
						}).catch(function(err){
							next(err);
						});
					}).catch(function(err){
						next(err);
					});
				} else {
					var errors = [];
					errors.push({
						status: 404,
						message: 'User not found'
					});
					res.status(404).json({
						errors: errors
					});					
				}
			}).catch(function(err){
				next(err);
			});
		} else {
			var errors = [];
			errors.push({
				status: 404,
				message: 'Chat not found'
			});
			res.status(404).json({
				errors: errors
			});
		}
	}).catch(function(err){
		next(err);
	});
};

module.exports.loadMessages = function(req, res, next){
	var chatId = req.query.chat;
	var page = req.query.page ? parseInt(req.query.page) + 1 : req.query.page;
	var limit = config.chat.loadMessagesSkip;

	Message.getMessages({
		chat: { _id: chatId }
	}, '', limit, (limit * page + 1), { created: -1 }).then(function(messages){
		if (messages.length > 0){
			res.status(200).json({
				status: 200,
				messages: messages.reverse(),
				page: page
			});
		} else {
			res.status(200).json({
				status: 200,
				messages: null,
				page: null 
			});
		}

	}).catch(function(err){
		next(err);
	});

};