const LocationModel = require('../models/LocationModel.js');

// Haversine formula to calculate distance between two lat-lon points (in km)
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const phi1 = (Math.PI / 180) * lat1;
  const phi2 = (Math.PI / 180) * lat2;
  const delta_phi = (Math.PI / 180) * (lat2 - lat1);
  const delta_lambda = (Math.PI / 180) * (lon2 - lon1);

  const a =
    Math.sin(delta_phi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(delta_lambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}

// Reverse geocoding function to match the nearest location based on lat/lon
async function reverseGeocode(lat, lon) {
  let nearestLocationCode = null;
  let minDistance = Infinity;

  const locations = await LocationModel.find();

  for (const loc of locations) {
    const distance = haversine(
      lat,
      lon,
      loc.coordinates.lat,
      loc.coordinates.lon
    );

    if (distance < minDistance) {
      nearestLocationCode = loc.code;
      minDistance = distance;
    }
  }

  return nearestLocationCode;
}

module.exports = reverseGeocode;
