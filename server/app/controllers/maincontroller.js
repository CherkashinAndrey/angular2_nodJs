module.exports = (app, socketio) => {

    const   config = require('../config/auth.js'),
            utils = require('../utils/utils.js'),
            pageTemplates = require('../../pageTemplates'),
            path = require('path'),
            recordsList = require('../../views/recordslist'),
            fs = require('fs'),
            child_process = require('child_process'),
            winston = require('../config/logger.js'),
            execFile = child_process.execFile,
            exec = child_process.exec;
			
    const { 
    	redirect, 
        domen, 
        domenname, 
        domen_port, 
        resHeaders, 
        maxBuffer 
    } = require('../../const.js');


    const models = require("../../models");
    const Items = models.item;
    const Recording = models.recording;
    const User = models.user;


    let main = {};


    main.ping = (req, res) => res.send('ok');
    

    main.getPlayScript = (req, res) => 
        res.sendFile(path.join(appRoot, 'play.js'));


    main.getPart = (req, res) => {
        let { folderName, fileName } = req.params;
        if (!fs.existsSync(path.join(appRoot, 'recordings', folderName, fileName))) {
            pageTemplates.renderNotFound(res, '<h3>Recording not found</h3>');
            return;
        }
        res.header( resHeaders );
        res.sendFile(path.join(appRoot, 'recordings', folderName, fileName));
    }


    main.getMedia = (req, res) => {
	    let { folderName, fileName } = req.params;
	    let pathToFile = path.join( appRoot, 'recordings', folderName, fileName );
     	fs.stat(pathToFile, (err, stat) => {
          	if (err) {
              	res.writeHead(404);
              	res.end('error: ' + pathToFile + ' not found');
              	return;
          	}
          	let total = stat.size;

          	res.sendFile(pathToFile);
          	return;
      	});
    }


    main.playPart = (req, res) => {
        let { name } = req.params;
        if (~name.indexOf('?')) {
          	name = name.substr(0, name.indexOf('?'));
        }
        
        if (!fs.existsSync(path.join('recordings', name))) {
          	pageTemplates.renderNotFound(res, '<h3>Recording not found</h3>');
          	return;
        }

        utils.readDir( path.join( 'recordings', name ) )
	        .then( files => {
	            res.header( resHeaders );
	            res.send(`
	                <script record-id="0" src="http://${domenname}/play.js"></script>
	                <script record-id="0">
		                var captureObj = ${JSON.stringify({
		                    files,
		                    folderName: name
		                })};
		                var captureHost = '${domen}';
		                var capturePort = '${domen_port}';
	                </script>
	                <script record-id="0" src="http://${domen}:${domen_port}/parseJSON.js"></script>`);
	        })
	        .catch( err => winston.error( err ) )
    }

    main.getItems = (req, res) => {
        console.log('GET ITEMS-->>>');
        // Items.findAll({where: {name: '333'}})
        Items.findAll()
            .then(user => {
                res.send(user);
            });      
    }

    main.items = (req, res) => {
      let data = '';
      let dataObj;
      req.on('data', chunk => { console.log('898989898989898988',data); data += chunk});
      req.on('end', err => {

          	try {
	            dataObj = JSON.parse(data);
                console.log('!!!!!!!!!dataObj!!!!!!!!!!!!!',dataObj);
          	} catch(e) {
	            res.end('Error' + e);
            	return;
          	}
            let newRecording = {
                status:"active",
                price: dataObj.price,
                sale: dataObj.sale,
                name: dataObj.name,
                }
            //  console.log('DATACREATE--->>>>', socketio );
            Items.create(newRecording)
            .then( data => {
                console.log('DATACREATE--->>>>', socketio );
            //    socketio.broadcast('updated', data)
                  socketio.emit('updatedThumbmail', data);
                  socketio.emit('testMessage', "TESTY!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            })
                 .catch(res.end);
              return res.end('ok');

//           	let { 	timeline, 
//                 	initialState, 
//                 	_initialStateIndex, 
//                 	_timelineIndex, 
//                 	_flag, 
//                 	_id, 
//                 	_pdfParse,
//                     _recordName,
//                     _recordDuration,
//                     _screenWidth,
//                     _screenHeight,
//                     _recordingMicAudio,
//                     _recordingWebcamVideo,
//                     _recordingTabAudio } = dataObj;
          

//           	switch (_flag) {

//             	case 'timeline':
//             	case 'initialState': {
// 	              	utils.getNextFolderName(dataObj)
// 	              		.then( utils.createRecordingFolder )
// 	              		.then( folderName => {
	                
// 	                		let fileName = `recordings/${folderName}/${folderName}-${_initialStateIndex}${_timelineIndex !== undefined ? '-' + _timelineIndex : ''}.json`;
	                
// 	                		fs.writeFile(fileName, JSON.stringify(dataObj), err => {
// 		                  		if (err) {
// 		                    		return rej(err);
// 		                  		}
// 		                  		return res.end('ok');
// 	                		});
// 		              	})
// 	              		.catch(err => winston.error(err));
// 	              	break;
// 	            }

//             	case 'eof': {
//                     utils.getNextFolderName(dataObj)
//                         .then( utils.createRecordingFolder )
//                         .then ( folderName => {
//                             let fileName = `recordings/${folderName}/${folderName}.json`;
                
//                             delete dataObj._flag;

//                             fs.writeFile(fileName, JSON.stringify(dataObj), err => {
//                                 if (err) {
//                                     return rej(err);
//                                 }

//                                 //save info about recording to db
//                                 let user = req.session.user || req.user;
//                                 let newRecording = {
//                                     user_id: user && user.id || 1, //todo del
//                                     title: _recordName,
//                                     link: folderName,
//                                     duration: _recordDuration,
//                                     screenWidth: _screenWidth,
//                                     screenHeight: _screenHeight,
//                                     recordingWeb: _recordingWebcamVideo,
//                                     recordingTab: _recordingMicAudio,
//                                     recordingMic: _recordingTabAudio,
//                                     description: '',
//                                     category: '',
//                                     //pdf: false,
//                                     public: false
//                                 }
//                                 Recording.create(newRecording)
//                                     .catch(res.end);

//                   				winston.info('Record was saved');

// /*                  				if (_pdfParse !== false) {
//                     				let childArgs = [
//                       					'../json2pdf/index.js',
//                       					path.join(folderName)
//                     				];
//                     				console.log('Starting PDF parser with params:', childArgs);
//                     				execFile( 'node', childArgs, { cwd: '../json2pdf', maxBuffer }, ( err, stdout, stderr ) => {
//                       					if ( err ) {
//                         					console.log( 'Error: PDF parser finished with error, params:', childArgs, 'Error:', err );
//                         					return;
//                       					}
//                       					console.log('PDF parser was finished successful');
//                     				})
//                   				}*/

//                   				return res.end('ok');
//                 			});
//               			});
//               		break;
//             	}

//           	}

        });

    }
    main.savePart = (req, res) => {
        let data = '';
        let dataObj;
        req.setEncoding('utf-8');
        req.on('data', chunk => data += chunk);
        req.on('end', err => {

          	try {
	            dataObj = JSON.parse(data);
          	} catch(e) {
	            res.end('Error' + e);
            	return;
          	}

          	let { 	timeline, 
                	initialState, 
                	_initialStateIndex, 
                	_timelineIndex, 
                	_flag, 
                	_id, 
                	_pdfParse,
                    _recordName,
                    _recordDuration,
                    _screenWidth,
                    _screenHeight,
                    _recordingMicAudio,
                    _recordingWebcamVideo,
                    _recordingTabAudio } = dataObj;
          

          	switch (_flag) {

            	case 'timeline':
            	case 'initialState': {
	              	utils.getNextFolderName(dataObj)
	              		.then( utils.createRecordingFolder )
	              		.then( folderName => {
	                
	                		let fileName = `recordings/${folderName}/${folderName}-${_initialStateIndex}${_timelineIndex !== undefined ? '-' + _timelineIndex : ''}.json`;
	                
	                		fs.writeFile(fileName, JSON.stringify(dataObj), err => {
		                  		if (err) {
		                    		return rej(err);
		                  		}
		                  		return res.end('ok');
	                		});
		              	})
	              		.catch(err => winston.error(err));
	              	break;
	            }

            	case 'eof': {
                    utils.getNextFolderName(dataObj)
                        .then( utils.createRecordingFolder )
                        .then ( folderName => {
                            let fileName = `recordings/${folderName}/${folderName}.json`;
                
                            delete dataObj._flag;

                            fs.writeFile(fileName, JSON.stringify(dataObj), err => {
                                if (err) {
                                    return rej(err);
                                }

                                //save info about recording to db
                                let user = req.session.user || req.user;
                                let newRecording = {
                                    user_id: user && user.id || 1, //todo del
                                    title: _recordName,
                                    link: folderName,
                                    duration: _recordDuration,
                                    screenWidth: _screenWidth,
                                    screenHeight: _screenHeight,
                                    recordingWeb: _recordingWebcamVideo,
                                    recordingTab: _recordingMicAudio,
                                    recordingMic: _recordingTabAudio,
                                    description: '',
                                    category: '',
                                    //pdf: false,
                                    public: false
                                }
                                Recording.create(newRecording)
                                    .catch(res.end);

                  				winston.info('Record was saved');

/*                  				if (_pdfParse !== false) {
                    				let childArgs = [
                      					'../json2pdf/index.js',
                      					path.join(folderName)
                    				];
                    				console.log('Starting PDF parser with params:', childArgs);
                    				execFile( 'node', childArgs, { cwd: '../json2pdf', maxBuffer }, ( err, stdout, stderr ) => {
                      					if ( err ) {
                        					console.log( 'Error: PDF parser finished with error, params:', childArgs, 'Error:', err );
                        					return;
                      					}
                      					console.log('PDF parser was finished successful');
                    				})
                  				}*/

                  				return res.end('ok');
                			});
              			});
              		break;
            	}

          	}

        });
    }


    return main;
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