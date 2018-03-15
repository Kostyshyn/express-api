var multer = require('multer');
var config = require('../../config');
var fs = require('fs');
// var sharp = require('sharp');

var storage = multer.diskStorage({
	destination:function(req, file, cb){
		var dir = './storage/' + req.decoded.id;
		checkDir(dir);
		var files = fs.readdirSync(dir);
		if (files.length > 0){
			fs.unlinkSync(dir + '/' + files[0]);
		}
		cb(null, dir);
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); 
	}
});

var fileFilter = function(req, file, cb){
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true);
	} else {
		// cb(new Error('incorrect file extension'), false);
		cb(null, false);
	}
};

module.exports.upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * config.upload.maxFileSizeMb
	}
});

function checkDir(directory) {  
	try {
    	fs.statSync(directory);
  	} catch(e) {
    	fs.mkdirSync(directory);
  	}	
}

