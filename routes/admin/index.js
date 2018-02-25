var express = require('express');
var router = express.Router();
var adminController = require('../../controllers/admin');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', adminController.getUsers);
router.post('/users', adminController.getUsers);

module.exports = router;