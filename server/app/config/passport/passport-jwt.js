module.exports = (app, passport, user) => {
	
	const User = user,
			//jwt = require('jsonwebtoken'),
            //socketioJwt = require('socketio-jwt'),
          JwtStrategy = require('passport-jwt').Strategy,
          ExtractJwt = require('passport-jwt').ExtractJwt,
          authUtils = require('../../utils/authUtils.js')(app, passport);

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromExtractors([authUtils.jwtExtractor]),
        secretOrKey: app.get('secret'),
        passReqToCallback   : true
    };


    passport.use(new JwtStrategy(jwtOptions, (req, payload, done) => {
        User.findById(payload.id)
            .then((user) => {
                if (user) {
                    req.session.user = user;
                    done(null, user)
                } else {
                    done(new Error("User not found"), null);
                }
            })
        })
    );

}