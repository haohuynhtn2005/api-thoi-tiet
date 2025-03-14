const Lang = require('../models/Lang.js');

// Update weather info
async function updateWeatherInfo(location) {
  if (
    !location ||
    (location.weatherInfo &&
      Date.now() - location.updatedAt?.getTime() < 7200000)
  ) {
    return;
  }
  const lat = location.coordinates.lat;
  const lon = location.coordinates.lon;
  const VISUALCROSSING_KEY = process.env.VISUALCROSSING_KEY;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?lang=id&unitGroup=metric&key=${VISUALCROSSING_KEY}&contentType=json`;
  try {
    const weatherInfoText = await fetch(url);
    const weatherInfo = await weatherInfoText.json();
    weatherInfo.resolvedAddress = location.name;
    const conditionsCodes =
      weatherInfo.currentConditions.conditions.split(', ');
    const conditionDescs = [];
    for (const code of conditionsCodes) {
      const cond = await Lang.findOne({ code });
      if (cond) {
        conditionDescs.push(cond.desc.toLowerCase());
      }
    }
    if (conditionDescs.length > 0) {
      const joinedString = conditionDescs.join(', ');
      const firstLetter = joinedString[0].toUpperCase();
      const descriptionResult = firstLetter + joinedString.slice(1);
      weatherInfo.currentConditions.conditions = descriptionResult;
    }
    location.set({
      updatedAt: new Date(),
      weatherInfo,
    });
    await location.save();
  } catch (e) {
    console.error(e);
  }
}

module.exports = updateWeatherInfo;
