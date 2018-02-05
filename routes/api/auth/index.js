var express = require('express');
var router = express.Router();
var expressJoi = require('express-joi-validator');
var validator = require('../../../controllers/validators');

// 
var authController = require('../../../controllers/auth');
// 

// var User =  require('../../../models/User');

router.post('/register', expressJoi(validator.register), authController.register);
router.post('/login', expressJoi(validator.login), authController.login);

module.exports = router;