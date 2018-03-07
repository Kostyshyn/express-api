var express = require('express');
var router = express.Router();
var userController = require('../../../controllers/user');
var authController = require('../../../controllers/auth');

var chatRouter = require('./chat');

router.get('/', userController.getAllUsers);
router.get('/:href', userController.getUser);
router.use('/:href/chat', chatRouter);
router.post('/:href/follow', authController.protected, userController.followUser);

module.exports = router;
