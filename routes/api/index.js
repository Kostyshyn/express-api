var express = require('express');
var router = express.Router();

var userRouter = require('./users');
var authRouter = require('./auth');

// authController.protected - use for protected routes (need token)

var authController = require('../../controllers/auth');

router.use('/', authRouter);
router.use('/users', userRouter);

module.exports = router;
