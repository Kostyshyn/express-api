var User = require('../../models/User');
var config = require('../../config');
var moment = require('moment');
// var Events = require('../../events');
var Service = require('../../services');

module.exports.getUsers = function(req, res, next){
	var online = req.query.online ? true : false;
	var sort = req.query.options ? { [req.query.options]: -1 } : null;
	var username = req.query.username ? req.query.username.trim() : false;
	var search;
	if (username && online){
		search = {
			query: {
				online: online,
				username: new RegExp(username, "i")
			},
			sort: sort
		};
	} else if (username) {
		search = {
			query: {
				username: new RegExp(username, "i")
			},
			sort: sort
		};
	} else if (online){
		search = {
			query: {
				online: online
			},
			sort: sort
		};
	} else {
		search = {
			query: null,
			sort: sort
		};
	}

	// console.log(search)

	User.allUsers(search.query, '-password', {}, search.sort).then(function(users){
		res.render('partials/user/user-table', {
			title: 'Users',
			users: users,
			errors: null,
			moment: moment
		});
	}).catch(function(err){
		next(err);
	})
};