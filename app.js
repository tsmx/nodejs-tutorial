var express = require('express');
var logger = require('./utils/logging').logger;
var app = express();

var routes = require('./routes/routes'); //importing route
routes(app); //register the route

app.listen(3000, function () {
  logger.info('nodejs-tutorial app listening on port 3000...');
});
