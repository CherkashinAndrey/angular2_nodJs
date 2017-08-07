 
module.exports = (app, passport, user) => {

    const   jwt = require('jsonwebtoken');
            authController = require('../controllers/authcontroller.js')(app, passport, jwt),
            authUtils = require('../utils/authUtils.js');
 

    app.get('/auth/logout',
        authController.logout);
 
    app.post('/auth/signup', 
        authController.signup);

    app.post('/auth/signin', 
        authController.signin,
        authController.sendToken);

    app.get('/auth/google', 
        authController.googleSignin);

    app.post('/auth/google', 
        authController.googleCallback,
        authController.sendToken);

    app.get('/auth/user', 
        authController.jwt, 
        authController.fetchUser);

    app.get('/auth/refresh', 
        authController.jwt,
        authController.refresh);

}
