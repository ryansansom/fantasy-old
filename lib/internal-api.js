import fetch from 'isomorphic-fetch';
let hostUrl = '';

if (process.env.CLIENT_RENDER) {
  hostUrl = document.documentElement.getAttribute('api-url');
} else {
  hostUrl = process.env.NODE_ENV === 'production' ? 'https://ryan-fantasy.herokuapp.com' : 'http://localhost:5000';
}

function apiRequest(endpoint = '', method = 'GET', body) {
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  };

  if (method === 'POST') options.body = JSON.stringify(body);

  console.log(endpoint);  // eslint-disable-line no-console

  return fetch(hostUrl + endpoint, options)
    .then(res => {
      if (res.status >= 400) throw new Error('Status code not expected. Expected 200, got '+ res.status);
      return res.text();
    })
    .then(body => {
      let jsonRes;

      try {
        jsonRes = JSON.parse(body);
      } catch(e) {
        jsonRes = body;
      }

      return jsonRes;
    })
    .catch(err => err);
}

export function getStandings(leagueID) {
  return apiRequest('/api/new-classic-league-standings/' + leagueID);
}

export function postColumnCookie(body) {
  return apiRequest('/cookie/columns', 'POST', body);
}

export function getLeagueList() {
  return apiRequest('/cookie/leagues-list');
}
