const morgan = require('morgan');

module.exports = () => morgan('combined', {
  skip: (req, res) => req.url.slice(0, 5) == '/ping'
});
