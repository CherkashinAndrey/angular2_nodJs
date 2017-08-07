module.exports = (app) => {

    const   utils = require('../utils/utils.js'),
            pageTemplates = require('../../pageTemplates'),
            path = require('path'),
            recordsList = require('../../views/recordslist'),
            fse = require('fs-extra'),
            winston = require('winston');
			
    const { 
    	redirect, 
        domenname, 
        resHeaders, 
    } = require('../../const.js');


    const models = require("../../models");
    const Recording = models.recording;
    const User = models.user;


	let obj = {};


    obj.root = ( req, res ) => 
        utils.readRecordingsList()
	        .then( recordings => {
	            pageTemplates.renderPage(res, {
	                section: 'Playback',
	                content: recordsList({
		                recordings, 
		                domenname
	                })
	          });
	        })
	        .catch( err => pageTemplates.renderError(res, err));


	obj.getRecordings = (req, res) => {
        let { user } = req.session;
        let criterion = {}
        if (req.session.user.role !== 'admin') {
            criterion = {
                where: {
                    user_id: req.session.user.id,
                    //todo add public recordings
                    /*$or: { 
                        public: true 
                    }*/
                }}
        }
        Recording.all(criterion)
        .then(recordings => {
            if (recordings) {
                res.json(recordings);
            }
        });
    }


    obj.getRecording = (req, res) => {
        let {name} = req.params;
        //res.header(resHeaders);
        res.sendFile(path.join(appRoot, 'recordings', name, name + '.json'));
    }


    obj.deleteRecording = (req, res) => {
        //remove recording from bd
        Recording.findById(req.params.id)
        .then((recording) => {
            if (recording) {
                let {link} = recording;

                recording.destroy();

                fse.remove(path.join(appRoot, 'recordings', link))
                .then(() => {
                    winston.info('deleting success!')
                })
                .catch(err => {
                    winston.error('error deleting recordings', err)
                })

                res.writeHead(302, {
                    'Location': redirect
                });
                res.send();
                //res.status(201).send();
            } else {
                res.status(404).send('Recording with id ' + req.params.id + ' not found');
            }
        });

    }


	return obj;
}