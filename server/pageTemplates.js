const { resHeaders } = require('./const.js');
const mainView = require('./views/main');

/*
 * Page template
 */
function renderPage(res, o) {
  res.writeHead(o.code || 200, resHeaders);
  res.end(mainView(o));
}

function renderNotFound(res, msg) {
  return renderPage(res, {
    code: 404,
    section: 'Not found',
    content: msg
  });
}

function renderError(res, msg) {
  return renderPage(res, {
    code: 500,
    section: 'Error',
    content: '<p>' + msg + '</p>'
  });
}

module.exports = {
	renderPage,
	renderNotFound,
	renderError
}