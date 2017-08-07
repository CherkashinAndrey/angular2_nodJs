const domen = 'localhost';
const domen_port = '9128';
const domenname = domen + ':' + domen_port;
const host = '0.0.0.0';
const port = '9128';
const pathToFront = 'http://localhost:4200';
const redirect = pathToFront + '/#/list';
const maxBuffer = 10240000;
const resHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'text/html; charset=utf-8; ',
  'Content-Type': 'application/json; charset=utf-8; '
  
}
module.exports = {
	host,
	port,
	domen,
	domen_port,
	maxBuffer,
	resHeaders,
	domenname,
	pathToFront,
	redirect
}