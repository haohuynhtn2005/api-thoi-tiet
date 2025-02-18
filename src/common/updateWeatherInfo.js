const LangModel = require('../models/LangModel.js');
const LocationModel = require('../models/LocationModel.js');

// Update weather info
async function updateWeatherInfo(locationCode) {
  const location = await LocationModel.findOne({ code: locationCode });
  if (
    !location ||
    (location.weatherInfo &&
      Date.now() - location.updatedAt?.getTime() < 7200000)
  ) {
    return;
  }
  const lat = location.coordinates.lat;
  const lon = location.coordinates.lon;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?lang=id&unitGroup=metric&key=W53D3PBB5PC5A9AWEADBJQ8VJ&contentType=json`;
  try {
    const weatherInfoText = await fetch(url);
    const weatherInfo = await weatherInfoText.json();
    weatherInfo.resolvedAddress = location.name;
    const conditionsCodes =
      weatherInfo.currentConditions.conditions.split(', ');
    const conditionDescs = [];
    for (const code of conditionsCodes) {
      const cond = await LangModel.findOne({ code });
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
    await location.updateOne(
      {
        weatherInfo,
        updatedAt: new Date(),
      },
      {
        runValidators: true,
      }
    );
  } catch (e) {
    console.error(e);
  }
}

module.exports = updateWeatherInfo;
