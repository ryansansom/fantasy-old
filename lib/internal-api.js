import request from 'request';
const hostUrl = process.env.NODE_ENV === 'production' ? 'https://ryan-fantasy.herokuapp.com' : 'http://localhost:5000'; // Dont leave like this - move to config

function apiRequest(endpoint = '') {
  const options = {
    url: hostUrl + endpoint,
    headers: {
      Accept: 'application/json',
    }
  };
  return new Promise((result, reject) => {
    request(options, (err, res, body) => {
      console.log(endpoint);  // eslint-disable-line no-console
      if (err) reject(err);
      if (res.statusCode !== 200) reject('Status code not expected. Expected 200, got '+ res.statusCode);

      return result(JSON.parse(body));
    })
  })
}

export function getStandings(leagueID) {
  return apiRequest('/api/new-classic-league-standings/' + leagueID);
}
