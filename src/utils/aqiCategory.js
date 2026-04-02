// Converts PM2.5 value to standard AQI (0-500)
const pm25ToAQI = (pm25) => {
  if (pm25 <= 12.0)  return Math.round((50 / 12.0) * pm25);
  if (pm25 <= 35.4)  return Math.round(51 + ((99 / 23.3) * (pm25 - 12.1)));
  if (pm25 <= 55.4)  return Math.round(101 + ((49 / 19.9) * (pm25 - 35.5)));
  if (pm25 <= 150.4) return Math.round(151 + ((49 / 94.9) * (pm25 - 55.5)));
  if (pm25 <= 250.4) return Math.round(201 + ((99 / 99.9) * (pm25 - 150.5)));
  return Math.round(301 + ((199 / 249.9) * (pm25 - 250.5)));
};

const getAQICategory = (aqi) => {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Hazardous';
};

const getAQIColor = (aqi) => {
  if (aqi <= 50)  return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 200) return '#ff7e00';
  if (aqi <= 300) return '#ff0000';
  if (aqi <= 400) return '#8f3f97';
  return '#7e0023';
};

module.exports = { pm25ToAQI, getAQICategory, getAQIColor };