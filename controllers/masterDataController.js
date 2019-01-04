var logger = require('../utils/logging').logger; 
var requestinfostring = require('../utils/logging').requestinfostring;
var masterDataModel = require('../models/masterDataModel.js');

exports.listAll = function(req, res) {
	logger.info('masterData.listAll called ' + requestinfostring(req));
	masterDataModel.find({}, function(err, data) {
		if (err) {
			res.send(err);
		}
		res.json(data);
	});
};

exports.getObjectById = function(req, res) {
	logger.info('masterData.getObjectById called ' + requestinfostring(req));
	masterDataModel.findById(req.params.id, function(err, data) {
		if (err) {
			logger.error(err);
			res.send(err);
		}
		res.json(data);
	});
};

exports.getChildrenById = function(req, res) {
	logger.info('masterData.getChildrenById called ' + requestinfostring(req));
	masterDataModel.findById(req.params.id, 'children', function(err, data) {
		if (err) {
			res.send(err);
		}
		res.json(data);
	});
};