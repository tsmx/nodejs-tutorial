var mongoose = require('../utils/db.js').mongoose;

// schema for master data objects
var masterDataSchema = mongoose.Schema({
    _id: String,
	name: String,
	description: String,
	parent: {type: String, ref: 'masterdata'},
	children: [{type: String, ref: 'masterdata'}]
});

// compile & export the master data model
module.exports = mongoose.model('masterdata', masterDataSchema, 'masterdata');