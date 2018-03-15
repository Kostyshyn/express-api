var express = require('express');
var router = express.Router();
var userController = require('../../../controllers/user');
var authController = require('../../../controllers/auth');
var uploadController = require('../../../controllers/upload');

var chatRouter = require('./chat');

router.get('/', userController.getAllUsers);

router.use('/chat', chatRouter); // chat

router.get('/:href', userController.getUser);
router.post('/:href/follow', authController.protected, userController.followUser);

router.put('/:href', authController.protected, uploadController.upload.single('profile-image'), userController.updateUser); // edit

module.exports = router;
