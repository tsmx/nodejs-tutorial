module.exports = function(app) {
  var testData = require('../controllers/testDataController');
  var masterData = require('../controllers/masterDataController');

  // some test routes
  app.get('/test', testData.listAll);
  app.get('/test/:id', testData.getObjectById);
  app.get('/test/:id/children', testData.getObjectChildrenById);
  
  // master data routes
  app.get('/masterdata', masterData.listAll);
  app.get('/masterdata/:id', masterData.getObjectById);
  app.get('/masterdata/:id/children', masterData.getChildrenById);

};
