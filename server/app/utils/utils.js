const 	path = require('path'),
		fs = require('fs');

module.exports = {
	getFolderName,
	createRecordingFolder,
	readDir,
	getNextFolderName,
	getExt,
	getName,
	readRecordingsList,
	createFolder,
	readPdfsList,
	getHost
}

function readDir( dir ) {
  	return new Promise( (res, rej) => {
    	fs.readdir(dir, (err, recordings) => {
      		if (err) rej(err);
      		res(recordings);
    	});
  	});
}

function getFolderName( recordName, id ) {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let formatedDate = date.getFullYear() + '-' + (month <= 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    let fileName = recordName + '-' + formatedDate;
    return path.join( appRoot, 'recordings', fileName + '-' + id );//`${appRoot}/recordings/${fileName}-${id}`;
}

function createRecordingFolder( folderName ) {
	return new Promise( (res, rej) => {
	    if (!fs.existsSync('recordings' + folderName)) {
	      	fs.mkdir( 'recordings/' + folderName, () => res(folderName) );
	    } else {
	      	res(folderName);
	    }
	});
}

function getNextFolderName ( { _recordName, _id } ) {
	return new Promise( (res, rej) => {
	   	let host = _recordName;
	   	let date = new Date();
	   	let day = date.getDate();
	   	let month = date.getMonth() + 1;
	   	let folderName = host + '-' + date.getFullYear() + '-' + (month <= 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + '-' + _id;
	   	res(folderName);
	});
}

function getExt( name ) {
	if (!name) return;
	let dot = name.lastIndexOf('.');
	if (~dot) return name.substr( dot );
}

function getName( name ) {
	if (!name) return;
	let dot = name.lastIndexOf('.');
	if (~dot) return name.substr( 0, dot );
	return name;
}

function readRecordingsList() {
	return readDir('recordings')
	   	.then( recordings => 
			Promise.all(recordings.map( (recording) =>
		   		new Promise( (resolve, reject) => {
		   			if (/.zip$/.test(recording)) {
		   				resolve(recording);
		   			}
		   			fs.stat(path.join('recordings', recording, recording + '.json'), (err, stats) => {
		   				if (err) 
		   					resolve();
		   				else 
		   					resolve(recording);
		   			})
		   		})
		   		.catch(e=>console.log(e))
		   	))
	   	)
		.then( recordings => 
			recordings.filter( rec => rec)
		)
	   	.then( recordings => 
	   		Promise.all(recordings.map( (recording) => 
	      		new Promise( (resolve, reject) => {
	       			fs.stat(path.join('recordings', recording), (err, stats) => {
	          			if (err)
	           				reject(err);
	           			else
	           				resolve({
	              				recording: recording,
	               				mtime: stats.mtime.getTime(),
	               				size: stats.size
	           				});
	       			});
	       		})
	       		.catch(e=>console.log(e))
	   		))
	   	)
	   	.then( recordings => 
	   		recordings.sort( (a, b) => 
	       		a.mtime > b.mtime ? 1 : -1
	   		)
	   	);
}

function createFolder( folderName ) {
	if ( !fs.existsSync( folderName ) ) {
  		fs.mkdirSync( folderName );
	}
}

function readPdfsList() {
  	let pdfs = fs.readdirSync('recordings');
  	return Promise.all(	pdfs
    	.filter( pdf => getExt( pdf ) === '.zip' )
    	.map( pdf => 
      		new Promise( ( resolve, reject ) => {
        		fs.stat(path.join('recordings', pdf), (err, stats) => {
          			if (err)
            			reject(err);
          			else
            			resolve({
              				pdf: pdf,
              				mtime: stats.mtime.getTime()
            			});
        		});
      		})
	    ))
}

function getHost( domenname ) {
	//todo check if 'http://' already exist
  	return 'http://' + domenname;
}
