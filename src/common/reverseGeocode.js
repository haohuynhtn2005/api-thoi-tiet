const Location = require('../models/Location.js');
const haversine = require('./haversine.js');

// Reverse geocoding function to match the nearest location based on lat/lon
async function reverseGeocode(lat, lon) {
  let location = null;
  let minDistance = Infinity;

  const locations = await Location.find().limit(1000);

  for (const loc of locations) {
    const distance = haversine(
      lat,
      lon,
      loc.coordinates.lat,
      loc.coordinates.lon
    );

    if (distance < minDistance) {
      location = loc;
      minDistance = distance;
    }
  }

  return location;
}

module.exports = reverseGeocode;
