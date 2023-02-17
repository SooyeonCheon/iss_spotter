// Fetch the next ISS flyovers for our geo coordinates
const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json', (err, response, body) => {

    if (err) return callback(err, null);
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (err, response, body) => {

    if (err) return callback(err, null);

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const msg = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(msg), null);
      return;
    }

    const { latitude, longitude } = parsedBody;
    callback(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
    console.log(ip);
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
      

    });
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
