var logger = require('../utils/logging').logger;

var mongoose = require( 'mongoose' );  
var dbURI = 'mongodb://mongoservice:27017/tsmtest'; 

// Create the database connection 
mongoose.connect(dbURI, { useNewUrlParser: true }); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  logger.info('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  logger.error('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  logger.info('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    logger.info('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

module.exports = mongoose;