const logger = require('../utils/logging').logger;
var mongoose = require('mongoose');

const dbURI = 'mongodb://mongoservice:27017/nodejstutorial';

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Create the database connection 
function connect(cb) {
    logger.info('Trying to connect to ' + dbURI);
    mongoose.connect(dbURI, dbOptions);
    var db = mongoose.connection;
    db.on('error', function (err) {
        logger.error('Mongoose default connection error: ' + err);
        process.exit(1);
    });
    db.on('disconnected', function () {
        logger.info('Mongoose default connection disconnected');
    });
    db.once('open', function () {
        logger.info('Mongoose default connection open to ' + dbURI);
        cb();
    });
}

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    mongoose.connection.close()
        .then(() => {
            logger.info('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
});

module.exports.connect = function (cb) { connect(cb); };
module.exports.mongoose = mongoose;