const app = require('./app');
const logger = require('./utils/logging').logger;
const connectDB = require('./utils/db').connect;

const httpPort = process.env.PORT || 3000;
connectDB(() => {
    app.listen(httpPort, () => {
        logger.info('nodejs-tutorial app listening on port ' + httpPort + '...');
    });
});