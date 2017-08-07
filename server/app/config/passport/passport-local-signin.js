module.exports = (app, passport, user) => {
    const   User = user,
            LocalStrategy = require('passport-local').Strategy,
    		authUtils = require('../../utils/authUtils.js')(app);


    passport.use('local-signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true 
        }, (req, email, password, done) => {
            User.findOne({
                where: {
                    email: email
                }
            })
            .then((user) => {
                if (!user || !authUtils.isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Invalid credentials'
                    });
                }
                req.session.user = user.get();
                return done(null, req.session.user);
     
            })
            .catch((err) => done(null, false, {
                    message: 'Something went wrong with your Signin',
                    err
            }));
        }
     
    ));

}