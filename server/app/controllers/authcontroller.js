module.exports = (app, passport, jwt) => {

    const   config = require('../config/auth.js'),
            winston = require('../config/logger.js'),
            authUtils = require('../utils/authUtils.js')(app, passport);

    let auth = {};


    auth.logout = (req, res) => {
        return req.session.destroy((err) => {
            res.redirect('/');
        });
    }

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    }

    auth.signup = (req, res, next) => {
        passport.authenticate('local-signup', (err, user, info) => {
            if (err) { 
                return next(err); 
            }
            if (!user) { 
                return res
                    .status(400)
                    .send({
                        success: false,
                        info
                    }) 
            }
            res.set(Object.assign({}, config.headers, {
                    'authorization': authUtils.generateToken(user) //(req.session.user)
                }
            ));
            
            res
                .status(200)
                .send({
                    success: true,
                    data: user
                });

        })(req, res, next)
    }


    auth.signin = (req, res, next) => {
        passport.authenticate('local-signin', (err, user, info) => {
            if (err) { 
                return next(err); 
            }
            if (!user) { 
                return res
                    .status(400)
                    .send({
                        success: false,
                        info
                    }) 
            }

            req
                .logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                        console.log(req.session);
                    return res
                        .set(Object.assign({}, 
                            config.headers, {
                                'authorization': authUtils.generateToken(req.session.user)
                            }
                        ))
                        .send();
            });

        })(req, res, next)
    }


    auth.googleSignin = passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })


    auth.googleCallback = passport.authenticate('google', { 
        failureRedirect: '/signin' 
    })


    auth.jwt = (req, res, next) => {
        passport.authenticate('jwt', {
            session: false
        }, (err, user, info) => {
            if (err) {
                next(err);
            }
            req.user = user;
            next();
        })(req, res, next);
    }


    auth.fetchUser = (req, res, next) => {
        res
            .set(config.headers);
        res
            .send({
                status:"success",
                data: req.user
            });
    }


    auth.refresh = (req, res, next) => {
        //todo check for user exists, refresh token
        let {authorization} = req.headers;
        let token = authorization && authorization.split(' ')[1];
        if (!token) {
            return next('Token not present');
        }
        jwt.verify(token, app.get('secret'), (err, decoded) => {
            if (err) {
                winston.info('****verification token error', err);
                return next(err);
            }
            winston.info('****verification token success');
            winston.info('****get user from token');
            winston.info(decoded.id);
            res
                .send();
        })
    }


    auth.sendToken = (req, res, next) => {
        res
            .set(Object.assign({}, 
                config.headers, {
                    'authorization': authUtils.generateToken(req.session.user)
                }
            ));
        res
            .send({
                status: 'success', 
                msg: 'Successfully logged in via google'
            });
    }


    return auth;
}