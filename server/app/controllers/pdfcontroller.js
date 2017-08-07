module.exports = (app) => {

	const 	pageTemplates = require('../../pageTemplates'),
			utils = require('../utils/utils.js'),
			path = require('path'),
			winston = require('../config/logger.js'),
			child_process = require('child_process'),
            execFile = child_process.execFile;

    const { maxBuffer } = require('../../const.js');

	const models = require("../../models");
    const Recording = models.recording;
    const User = models.user;

    const pdf_status = require('../consts/pdf_status.js');

	let obj = {};

	obj.getPdfsList = (req, res) => {
        utils.readPdfsList()
	        .then( pdfs => {
	            pageTemplates.renderPage(res, {
	                section: 'Archives of pdfs',
	                content: `
	                <h3>Archives of pdfs</h3>
	                <ul>
	                    ${pdfs.reverse()
	                    .map( ({pdf, mtime}) => {
	                        return `
	                            <li>
	                            <a href="./pdf/${pdf}">${new Date(mtime).toLocaleDateString()} ${pdf}</a>
	                            </li>`
	                    }).join('\n')}
	                </ul>`          
	            });
	        });
    }


    obj.getPdfsJSON = (req, res) => 
        utils.readPdfsList()
	        .then(pdfs => res.json(pdfs));
    

    obj.getPdf = (req, res) => 
        res.sendFile(path.join( appRoot, 'recordings', req.params.id ));


    obj.parsePdf = (req, res, next) => {
    	//todo
    	let id = req.body.id;
    	if (!id) {
    		return next('error');
    	}
    	Recording.findById(id)
    	.then(rec => {
    		rec.pdf = pdf_status.IN_PROGRESS;
    		rec.save();
    		res.status(201).send('ok');
    		let childArgs = [
				path.join(appRoot, '../json2pdf/index.js'),
				path.join(rec.link)
			];
			winston.info('Starting PDF parser with params:', childArgs);
			winston.info(path.join(appRoot, '../json2pdf'));
			execFile( 'node', childArgs, { cwd: path.join(appRoot), maxBuffer }, ( err, stdout, stderr ) => {
					if ( err ) {
						rec.pdf = pdf_status.ERROR;
						rec.save();
						winston.error( 'PDF parser finished with error, params:', childArgs);
						winston.error( err );
						return;
					}
					//todo check zip exists
					rec.pdf = pdf_status.COMPLETE;
					rec.save();
					winston.info('PDF parser was finished successful');
			})
    	});
    }

    return obj;
}