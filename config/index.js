var fs = require('fs');

var config = fs.readFileSync('../config.json').toString();

module.exports = JSON.parse(config);
