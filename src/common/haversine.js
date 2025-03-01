// Haversine formula to calculate distance between two lat-lon points (in meter)
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of Earth in meters
  const phi1 = (Math.PI / 180) * lat1;
  const phi2 = (Math.PI / 180) * lat2;
  const delta_phi = (Math.PI / 180) * (lat2 - lat1);
  const delta_lambda = (Math.PI / 180) * (lon2 - lon1);

  const a =
    Math.sin(delta_phi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(delta_lambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

module.exports = haversine;
