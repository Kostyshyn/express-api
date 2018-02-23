var express = require('express');
var router = express.Router();

var apiRouter = require('./api')
var adminRouter =  require('./admin');

router.use('/api', apiRouter);
router.use('/', adminRouter);

module.exports = router;
