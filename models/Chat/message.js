var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var User = require('../User');

var messageSchema = mongoose.Schema({});

var Message = module.exports = mongoose.model('Message', messageSchema);