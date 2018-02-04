var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var User = require('../../models/User');
var config = require('../../config');
var { check, validationResult } = require('express-validator/check');
var { sanitize } = require('express-validator/filter');

module.exports.signup = function(req, res, next){

};

module.exports.login = function(req, res, next){};

module.exports.logout = function(){};

function isValidPassword(user, password){
	return bcrypt.compareSync(password, user.password);
};
