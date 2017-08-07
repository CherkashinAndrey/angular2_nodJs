module.exports = (app, passport, user) => {

    const User = user;

    require('./passport-google.js')(app, passport, user);
    require('./passport-jwt.js')(app, passport, user);
    require('./passport-local-signin.js')(app, passport, user);
    require('./passport-local-signup.js')(app, passport, user);


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });


    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });

    });

}