const { Router } = require('express');
const indexController = require('../controllers/indexController.js');
const auhtController = require('../controllers/authController.js');
const newsController = require('../controllers/newsController.js');
const commentController = require('../controllers/commentController.js');
const auth = require('../middleware/auth.js');

const indexRouter = Router();
indexRouter.get('/getLocationOpts', indexController.getLocationOpts);
indexRouter.get('/getRandomLocations', indexController.getRandomLocations);
indexRouter.get('/search/:locationCode', indexController.searchLocation);
indexRouter.post('/reversegeo', indexController.reverseGeo);
indexRouter.post('/nearbyLocations', indexController.nearbyLocations);
indexRouter.get('/getLocations', indexController.getLocations);
indexRouter.get('/news', newsController.getNews);
indexRouter.get('/news/:id', newsController.getNewsById);
indexRouter.post('/comment', auth, commentController.postComment);

indexRouter.post('/register', auhtController.register);
indexRouter.post('/login', auhtController.login);
indexRouter.post('/logout', auhtController.logout);
indexRouter.get('/getUser', auhtController.getUser);

module.exports = indexRouter;
