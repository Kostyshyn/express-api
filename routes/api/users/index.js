var express = require('express');
var router = express.Router();
var userController = require('../../../controllers/user')

router.get('/', userController.getAllUsers);
router.get('/:href', userController.getUser);
router.post('/:href/follow', userController.followUser);

module.exports = router;
