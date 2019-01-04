// declare and export a logger with local timestamp

var winston = require('winston');

var logger = new (winston.Logger)({
	transports : [ new (winston.transports.Console)({
		timestamp : function() {
			var d = new Date();
			return d.toLocaleDateString().concat(' ').concat(
					d.toLocaleTimeString());
		}
	}) ]
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
