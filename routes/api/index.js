var express = require('express');
var router = express.Router();

var userRouter = require('./users');
var authRouter = require('./auth');

var authController = require('../../controllers/auth');

router.use('/', authRouter);
router.use('/users', authController.protected, userRouter);

module.exports = router;
