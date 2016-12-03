import request from 'request';
let hostUrl = '';

if (process.env.CLIENT_RENDER) {
  hostUrl = document.documentElement.getAttribute('api-url');
} else {
  hostUrl = process.env.NODE_ENV === 'production' ? 'https://ryan-fantasy.herokuapp.com' : 'http://localhost:5000';
}

function apiRequest(endpoint = '', method = 'GET', body) {
  const options = {
    method,
    url: hostUrl + endpoint,
    headers: {
      Accept: 'application/json',
    }
  };

  if (method === 'POST') options.json = body;

  return new Promise((result, reject) => {
    request(options, (err, res, body) => {
      console.log(endpoint);  // eslint-disable-line no-console
      if (err) reject(err);
      if (res.statusCode !== 200) {
        return reject('Status code not expected. Expected 200, got '+ res.statusCode)
      }

      let jsonRes;

      try {
        jsonRes = JSON.parse(body);
      } catch(e) {
        jsonRes = body;
      }

      return result(jsonRes);
    })
  })
}

export function getStandings(leagueID) {
  return apiRequest('/api/new-classic-league-standings/' + leagueID);
}

export function postColumnCookie(body) {
  return apiRequest('/cookie/columns', 'POST', body);
}
