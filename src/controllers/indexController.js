const haversine = require('../common/haversine');
const reverseGeocode = require('../common/reverseGeocode');
const updateWeatherInfo = require('../common/updateWeatherInfo');
const LocationModel = require('../models/LocationModel');

async function getLocationOpts(req, res) {
  const locations = await LocationModel.find().limit(1000);
  res.json(
    locations.map((loc) => {
      return {
        value: loc.code,
        label: loc.name,
      };
    })
  );
}

async function getRandomLocations(req, res) {
  const locations = await LocationModel.find().limit(1000);
  const locationIndexes = [];
  for (let i = 0; i < locations.length; i += 1) {
    locationIndexes.push(i);
  }
  const targetIndexs = [];
  for (let i = 0; i < 12; i += 1) {
    const idx = Math.floor(Math.random() * locationIndexes.length);
    targetIndexs.push(locationIndexes[idx]);
    locationIndexes.splice(idx, 1);
  }
  targetIndexs.sort((a, b) => a - b);
  const resLocations = [];
  for (let i = 0; i < targetIndexs.length; i += 1) {
    const location = locations[targetIndexs[i]];
    // await
    updateWeatherInfo(location);
    resLocations.push(location);
  }
  res.json(resLocations);
}

async function searchLocation(req, res) {
  const locationCode = req.params.locationCode;
  const location = await LocationModel.findOne({ code: locationCode });
  if (!location) {
    return res.status(404).json({ message: 'Không tìm thấy khu vực' });
  }
  await updateWeatherInfo(location);
  res.json(location.weatherInfo);
}

async function reverseGeo(req, res) {
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

  const location = await reverseGeocode(latitude, longitude);

  if (!location) {
    return res
      .status(404)
      .json({ message: 'No address found for the given coordinates' });
  }

  await updateWeatherInfo(location);

  return res.json(location.weatherInfo);
}

async function nearbyLocations(req, res) {
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
  const locations = await LocationModel.find();
  locations.sort((a, b) => {
    const distanceA = haversine(lat, lon, a.coordinates.lat, a.coordinates.lon);
    const distanceB = haversine(lat, lon, b.coordinates.lat, b.coordinates.lon);
    return distanceA - distanceB;
  });
  const locationsToReturn = [];
  for (let i = 1; i < 9; i += 1) {
    const loc = locations[i];
    locationsToReturn.push(loc);
    updateWeatherInfo(loc);
  }
  return res.json(locationsToReturn);
}

const indexController = {
  getLocationOpts,
  getRandomLocations,
  searchLocation,
  reverseGeo,
  nearbyLocations,
};

module.exports = indexController;
