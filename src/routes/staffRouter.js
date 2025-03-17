const { Router } = require('express');
const managerController = require('../controllers/managerController.js');
const locationController = require('../controllers/locationController.js');
const authMiddleware = require('../middleware/auth.js');
const hasRole = require('../middleware/hasRole.js');
const newsController = require('../controllers/newsController.js');

const staffRouter = Router();
staffRouter.use([authMiddleware, hasRole(['admin', 'staff'])]);
staffRouter.get('/overview', managerController.getOverview);
staffRouter.get('/locations', locationController.getLocations);
staffRouter.post('/locations', locationController.createLocation);
staffRouter.put('/locations/:id', locationController.updateLocation);
staffRouter.delete('/locations/:id', locationController.deleteLocation);
staffRouter.get("/news", newsController.getNews);
staffRouter.post("/news", newsController.createNews);
staffRouter.put("/news/:id", newsController.updateNews);
staffRouter.delete("/news/:id", newsController.deleteNews);

module.exports = staffRouter;
