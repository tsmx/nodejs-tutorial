var mongoose = require('../utils/db.js').mongoose;

// schema for master data objects
var masterDataSchema = mongoose.Schema({
	name: String,
	description: String,
	parent: {type: mongoose.Schema.ObjectId, ref: 'masterdata'},
	children: [{type: mongoose.Schema.ObjectId, ref: 'masterdata'}]
});

// compile & export the master data model
module.exports = mongoose.model('masterdata', masterDataSchema, 'masterdata');