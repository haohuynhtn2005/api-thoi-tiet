const { Router } = require('express');
const auth = require('../middleware/auth.js');
const hasRole = require('../middleware/hasRole.js');
const userController = require('../controllers/userController.js');

const adminRouter = Router();
adminRouter.use([auth, hasRole(['admin'])]);
adminRouter.get('/users', userController.getUsers(['user']));
adminRouter.get('/staffs', userController.getUsers(['staff']));


module.exports = adminRouter;
