const { Router } = require('express');
const indexController = require('../controllers/indexController.js');

const indexRouter = Router();
indexRouter.get('/getLocationOpts', indexController.getLocationOpts);
indexRouter.get('/getRandomLocations', indexController.getRandomLocations);
indexRouter.get('/search/:locationCode', indexController.searchLocation);
indexRouter.post('/reversegeo', indexController.reverseGeo);
indexRouter.post('/nearbyLocations', indexController.nearbyLocations);

indexRouter.post("/register", indexController.register);
indexRouter.post("/login", indexController.login);
indexRouter.post("/logout", indexController.logout);
indexRouter.get('/getUser', indexController.getUser)

module.exports = indexRouter;
