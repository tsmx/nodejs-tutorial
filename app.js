const express = require('express');
const logger = require('./utils/logging').logger;
const routes = require('./routes/routes');

var app = express();
routes(app);

module.exports = app;