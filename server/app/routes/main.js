module.exports = (app, passport, socketio) => {
    
    const   authUtils = require('../utils/authUtils.js')(app),
            jwt = require('jsonwebtoken'),
            authController = require('../controllers/authcontroller.js')(app, passport, jwt),
            mainController = require('../controllers/maincontroller.js')(app, socketio),
            recordingsController = require('../controllers/recordingscontroller.js')(app),
            pdfController = require('../controllers/pdfcontroller.js')(app);


    app.get('/', 
        //authUtils.isLoggedIn, 
        recordingsController.root);


    app.get('/recordings', 
        authController.jwt,
        authUtils.isLoggedIn,
        recordingsController.getRecordings);


    app.get('/recordings/:name', 
        recordingsController.getRecording);


    app.get('/delete/:id', 
        recordingsController.deleteRecording);


    app.get('/ping/:id',
        mainController.ping);


    app.get('/pdf', 
        pdfController.getPdfsList);


    app.get('/pdf/json', 
        pdfController.getPdfsJSON);


    app.get('/pdf/:id', 
        pdfController.getPdf);

    app.post('/parsepdf', 
        pdfController.parsePdf);


    app.get('/play.js', 
        mainController.getPlayScript);


    app.get('/recordings/getpart/:folderName/:fileName', 
        mainController.getPart);


    app.get('/recordings/getmedia/:folderName/:fileName', 
        mainController.getMedia);


    app.get('/recordingsparts/:name', 
        mainController.playPart);


    app.post('/recordings/savepart', 
        mainController.savePart);

    app.post('/items/add', 
        mainController.items);
    
    app.get('/getitems', 
        mainController.getItems);


}
