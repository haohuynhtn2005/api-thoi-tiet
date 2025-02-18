const { Router } = require('express');
const reverseGeocode = require('../common/reverseGeocode.js');
const updateWeatherInfo = require('../common/updateWeatherInfo.js');
const LocationModel = require('../models/LocationModel.js');

const indexRouter = Router();

indexRouter.get('/getLocationOpts', async (req, res) => {
  const locations = await LocationModel.find();
  res.json(
    locations.map((loc) => {
      return {
        value: loc.code,
        label: loc.name,
      };
    })
  );
});

indexRouter.get('/search/:locationCode', async (req, res) => {
  const locationCode = req.params.locationCode;
  await updateWeatherInfo(locationCode);
  const location = await LocationModel.findOne({ code: locationCode });
  if (!location) {
    return res.status(404).json({ message: 'Không tìm thấy khu vực' });
  }
  // setTimeout(() => {
    res.json(location.weatherInfo);
  // }, 1000);
});

indexRouter.post('/reversegeo', async (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ message: "Missing 'lat' or 'lon' query parameter" });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Invalid latitude or longitude' });
  }

  const locationCode = await reverseGeocode(latitude, longitude);

  if (!locationCode) {
    return res
      .status(404)
      .json({ message: 'No address found for the given coordinates' });
  }

  await updateWeatherInfo(locationCode);
  const location = await LocationModel.findOne({ code: locationCode });

  return res.json(location.weatherInfo);
});

module.exports = indexRouter;
