var logger = require('../utils/logging').logger;
var requestinfostring = require('../utils/logging').requestinfostring;
var masterDataModel = require('../models/masterDataModel.js');

exports.listAll = function (req, res) {
	logger.info('masterData.listAll called ' + requestinfostring(req));
	masterDataModel.find({})
		.then(data => { res.json(data); })
		.catch(err => { res.send(err); });
};

exports.getObjectById = function (req, res) {
	logger.info('masterData.getObjectById called ' + requestinfostring(req));
	masterDataModel.findById(req.params.id)
		.then(data => { res.json(data); })
		.catch(err => { res.send(err); });
};

exports.getChildrenById = function (req, res) {
	logger.info('masterData.getChildrenById called ' + requestinfostring(req));
	masterDataModel.findById(req.params.id, 'children')
		.populate('children')
		.exec()
		.then(data => { res.json(data); })
		.catch(err => { res.send(err); });
};