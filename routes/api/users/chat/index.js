var express = require('express');
var router = express.Router({ mergeParams: true });

var authController = require('../../../../controllers/auth');
var chatController = require('../../../../controllers/chat');

router.get('/', authController.protected, chatController.openChat);
router.post('/', authController.protected, chatController.sendMessage);
router.get('/messages', authController.protected, chatController.loadMessages);

module.exports = router;
