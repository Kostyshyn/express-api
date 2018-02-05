var Joi = require('joi');

module.exports = {
	register: {
	    body: {
	        credentials: {
	        	username: Joi.string().min(2).regex(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/).required(),
	        	password: Joi.string().min(3).required(),
	        	email: Joi.string().email().required()
	        }
	    }
	}
}