const express = require('express');
const routes = require('./routes/routes');

var app = express();
routes(app);

module.exports = app;