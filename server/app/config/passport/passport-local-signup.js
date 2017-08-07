module.exports = (app, passport, user) => {
    const   User = user,
    		LocalStrategy = require('passport-local').Strategy,
    		authUtils = require('../../utils/authUtils.js')(app);


	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
            passReqToCallback: true 
        }, (req, email, userPassword, done) => {
        	User.findOne({
        		where: {
        			email
        		}
        	})
        	.then( user => {
        		if (user) {
        			return done(null, false, {
        				message: 'That email is already taken'
        			});
        		} else {
        			let password = authUtils.generateHash(userPassword);
        			let {
        				firstname, 
        				lastname
        			} = req.body;
        			let data = {
        				email,
        				password,
        				firstname,
        				lastname
        			};

        			User.create(data).then((newUser, created) => {
        				if (!newUser) {
        					return done(null, false);
        				}
        				if (newUser) {
        					return done(null, {
        						user: newUser,
        						token: authUtils.generateToken(newUser.get())
        					});
        				}
        			});

        		}

        	});

        }
    ));
}