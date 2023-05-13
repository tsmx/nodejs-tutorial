var logger = require('../utils/logging').logger;
var requestinfostring = require('../utils/logging').requestinfostring;

exports.listAll = function (req, res) {
	logger.info('testData.listAll called ' + requestinfostring(req));
	res.json({ request: 'list all' });
};

exports.getObjectById = function (req, res) {
	logger.info('testData.getObjectById called ' + requestinfostring(req));
	var id = req.params.id;
	res.json({ request: 'get by ID ' + id });
};

exports.getObjectChildrenById = function (req, res) {
	logger.info('testData.getObjectChildrenById called ' + requestinfostring(req));
	var id = req.params.id;
	res.json({ request: 'getChildren by ID ' + id });
};