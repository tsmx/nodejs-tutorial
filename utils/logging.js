// declare and export a logger with local timestamp

var winston = require('winston');
var format = winston.format;

const myFormat = format.printf((info) => {
	return `${info.timestamp} ${info.level.toUpperCase()} ${info.message}`;
});

var transporters = [new winston.transports.Console()];
if (process.env.NODE_ENV == 'test') {
    transporters[0].silent = true;
}

var logger = winston.createLogger({
	format: format.combine(format.timestamp(), myFormat),
	transports: transporters
});

// export a basic logger object
module.exports.logger = logger;
// export a helper-function for creating a info-string for a http request
module.exports.requestinfostring = function(req) {
	var result = '(' + req.ip + ' ' + req.originalUrl;
	if (req.params.id) {
		result = result + ' ID: ' + req.params.id;
	}
	result = result + ')';
	return result;
};
