module.exports = (app, passport) => {
	
	const 	jwt = require('jsonwebtoken'),
			bCrypt = require('bcrypt-nodejs'),
			config = require('../config/auth.js');

	return {
		

		generateToken(user) {
	        return jwt.sign(user, app.get('secret'), {
	            expiresIn: config.tokenExpiresIn
	        });
	    },


	    generateHash(password) {
	    	return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);	
	    },


	    isValidPassword(userpass, password) {
	    	return bCrypt.compareSync(password, userpass);
	    },


	    jwtExtractor(req) {
	    	let {authorization} = req.headers;
        	return authorization && authorization.split(' ')[1];
    	},


    	isLoggedIn(req, res, next) {
	        if (req.isAuthenticated()) {
            	return next();
        	}
        	//return next('Error: Authorization failed');
        	res.status(401).send();
	    }


	}

}