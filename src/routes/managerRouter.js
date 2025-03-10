const { Router } = require('express');
const managerController = require('../controllers/managerController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const hasRole = require('../middleware/hasRole.js');

const managerRouter = Router();
managerRouter.use([authMiddleware, hasRole(['admin', 'staff'])]);
managerRouter.get('/locations', managerController.getLocations);
managerRouter.post('/locations', managerController.createLocation);
managerRouter.put('/locations/:id', managerController.updateLocation);
managerRouter.delete('/locations/:id', managerController.deleteLocation);

module.exports = managerRouter;
