const utils = require('./app/utils/utils.js'),
      fs = require('fs'),
      child_process = require('child_process');

const { domen, 
        domenname, 
        domen_port, 
        host, 
        port, 
        maxBuffer, 
        resHeaders } = require('./const.js');
        
const execFile = child_process.execFile;

module.exports = (socketio) => {


socketio.on( 'connection', socket => {
    let client;
    let id = socket.id;
    console.log( 'новое соединение ' + id );

   // socket.broadcast( 'ItemsUpdated', { id: 3} );
    //socket.on( 'blob', socketBlob );
    //socket.on( 'close', socketClose );
    //socket.on( 'startCapture', socketStartCapture );
    //socket.on( 'stopCapture', socketStopCapture );
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
}