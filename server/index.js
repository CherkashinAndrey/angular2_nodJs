const { domen, 
        domenname, 
        domen_port, 
        host, 
        port,
        pathToFront
    } = require('./const.js');


const   express = require('express'),
        http = require('http'),
        https = require('https'),
        cors = require('cors'),
        fs = require('fs'),
        io = require('socket.io'),
        utils = require('./app/utils/utils.js'),
        passport = require('passport'),
        session = require('express-session'),
        RedisStore = require( 'connect-redis' )( session )
        bodyParser = require('body-parser'),
        env = require('dotenv').load(),
        morgan = require('./app/config/morgan.js'),
        exphbs = require('express-handlebars'),
        config = require('./app/config/auth.js'),
        winston = require('./app/config/logger.js'),
        path = require('path');

global.appRoot = path.resolve(__dirname);

const app = express();

// ensure the 'recordings' folder exists
utils.createFolder( 'recordings' );


app.use(morgan());
app.use(cors({
    origin: pathToFront,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('secret', config.secret);
app.use(session({ 
    secret: app.get('secret'), 
    resave: true, 
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//app.use( forwardVariables );

const models = require("./models");

//load passport strategies
require('./app/config/passport/passport.js')(app, passport, models.user);


//Sync Database
models.sequelize.sync().then(function() {
    winston.info('Nice! Database looks fine')
}).catch((err) => {
    winston.error(err, "Something went wrong with the Database Update!")
});

/*function forwardVariables(req, res, next) {
    res.locals.clientList = clientList;
    next();
}*/

const httpServer = http.createServer(app).listen( port, host, () => winston.info('Server running on port ' + port ) );
const socketio = io.listen(httpServer);
require('./socket.js')(socketio);
socketio.on( 'connection', socket => {
    let client;
    let id = socket.id;
    console.log( 'новое соединение ' + id );

    socket.on( 'message', socketMessage );
});

const authRoute = require('./app/routes/auth.js')(app, passport, models.user);
const mainRoute = require('./app/routes/main.js')(app, passport, socketio);

function socketMessage( msg ) {
    console.log('Message received');
}

/*socketio.on( 'connection', socket => {
    let client;
    let id = socket.id;
    console.log( 'новое соединение ' + id );

    socket.on( 'message', socketMessage );
    socket.on( 'blob', socketBlob );
    socket.on( 'close', socketClose );
    socket.on( 'startCapture', socketStartCapture );
    socket.on( 'stopCapture', socketStopCapture );
});

function socketMessage( msg ) {
    console.log('Message received');
}

function socketBlob( data ) {
    console.log( 'Blob received' );
    
    let folderName = utils.getFolderName( data._recordName, data._id );
    let fileName = `${folderName}/${data.name}.webm`;
    
    fs.appendFile( fileName, data.blob, err => {
      if(err) {
        console.log('err', err);
      } else {
        console.log('saved');
      }
    })     
}

function socketClose() {
    console.log('disconnected');
    if (client) {
      client.end();
    }
}

function socketStartCapture( data ) {
    let folderName = utils.getFolderName(data._recordName, data._id);

    utils.createFolder( folderName );
    
    console.log('start capturing', data);
    console.log('recordID', data.recordID);
    userID = data.userID;
}

function socketStopCapture( data ) {
  console.log('stopCapture');
  convertMedia( data );
}

function forwardVariables(req, res, next) {
    res.locals.clientList = clientList;
    next();
}



function convertMedia( data ) {
  console.log('*** convertMedia', data);
  
  let folderName = utils.getFolderName( data._recordName, data._id );
  let fileNameWEBM = `${folderName}/${data.name}.webm`;
  let fileNameMP4 = `${folderName}/${data.name}.mp4`;

  let childArgs = [
    '-i',
    fileNameWEBM,
    '-s',
    'qvga',
    '-b',
    '384k',
    '-vcodec',
    'libx264',
    '-r',
    '23.976',
    '-ac',
    '2',
    '-ar',
    '44100',
    '-ab',
    '64k',
    '-crf',
    '22',
    '-deinterlace',
    '-strict',
    '-2',
    fileNameMP4
  ];
  execFile( 'ffmpeg', childArgs, { cwd: './', maxBuffer }, ( err, stdout, stderr ) => {
    if ( err ) {
      console.log( 'Error converting ', childArgs, 'Error:', err );
      return;
    }
    console.log('media convert success');
  })


}
*/