const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');


fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

/*
fetchCoordsByIP('154.20.189.160', (error, data) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned coordinates:', data);
});
*/

const coords =  { latitude: 49.2827291, longitude: -123.1207375 };

fetchISSFlyOverTimes(coords, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned flyover times:', passTimes);
});