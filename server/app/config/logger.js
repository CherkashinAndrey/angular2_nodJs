const winston = require('winston');

winston.level = 'debug';

winston.add(winston.transports.File, {
  	name: 'file.debug',
  	level: 'debug',
  	maxsize: 5242880, // 5Mb
  	colorize: true,
  	prettyPrint: true,
  	filename: './logs/debug.log'
});

winston.remove(winston.transports.Console);

winston.add(winston.transports.Console, {
  	name: 'console.debug',
  	level: 'debug',
  	colorize: true
});

module.exports = winston;
