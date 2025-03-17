const { Router } = require('express');
const indexController = require('../controllers/indexController.js');
const auhtController = require('../controllers/authController.js');
const newsController = require('../controllers/newsController.js');
const commentController = require('../controllers/commentController.js');
const auth = require('../middleware/auth.js');
const userController = require('../controllers/userController.js');

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
indexRouter.get('/my-news', auth, newsController.userGetNews);
indexRouter.post('/my-news', auth, newsController.userCreateNews);
indexRouter.put('/my-news/:id', auth, newsController.userUpdateNews);
indexRouter.delete('/my-news/:id', auth, newsController.userDeleteNews);

indexRouter.post('/register', auhtController.register);
indexRouter.post('/login', auhtController.login);
indexRouter.post('/logout', auhtController.logout);
indexRouter.post('/auth/google', auhtController.authGoogle);
indexRouter.get('/getUser', auhtController.getUser);
indexRouter.put('/update-profile', auth, userController.updateProfile);

module.exports = indexRouter;
