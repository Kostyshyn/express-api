var express = require('express');
var router = express.Router({ mergeParams: true });

var authController = require('../../../../controllers/auth');
var chatController = require('../../../../controllers/chat');

router.get('/', authController.protected, chatController.getChats);
router.get('/:href', authController.protected, chatController.openChat);
router.post('/:href', authController.protected, chatController.sendMessage);
router.get('/:href/messages', authController.protected, chatController.loadMessages);

module.exports = router;
