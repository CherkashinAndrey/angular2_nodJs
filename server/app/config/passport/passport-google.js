module.exports = (app, passport, user) => {

	const   User = user,
			GoogleStrategy = require('passport-google-oauth20').Strategy,
			config = require('../auth.js');

    passport.use('google', new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            passReqToCallback   : true
        }, (req, accessToken, refreshToken, profile, done) => {
            req.session.accessToken = accessToken;
            req.session.refreshToken = refreshToken;
            let {
                emails, 
                name,
                displayName
            } = profile;
            let email = emails && emails.length && emails[0].value;
            if (!email) {
                return done('Something went wrong');
            }
            User.findOrCreate({ 
                where: { 
                    googleId: profile.id
                },
                defaults: {
                    //firstname: name.givenName,
                    //lastname: name.familyName,
                    //username: displayName,
                    googleAccessToken: accessToken,
                    email
                }
            })
            .spread((user, created) => {
                req.session.user = user.get();
                return done(null, req.session.user);
            })
            .catch(err => done(err));
        } 
    ));
}