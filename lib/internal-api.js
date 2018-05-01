import fetch from 'isomorphic-fetch';

let hostUrl = '';

if (process.env.CLIENT_RENDER) {
  hostUrl = window.location.origin;
}

function apiRequest(endpoint = '', method = 'GET', body) {
  if (!hostUrl) throw new Error('Do not use internal API on the server. Use getOptions to pass the internal promise to the client');
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (method === 'POST') options.body = JSON.stringify(body);

  console.log(endpoint); // eslint-disable-line no-console

  return fetch(hostUrl + endpoint, options)
    .then((res) => {
      if (res.status >= 400) throw new Error(`Status code not expected. Expected 200, got ${res.status}`);
      return res.text();
    })
    .then((responseBody) => {
      let jsonRes;

      try {
        jsonRes = JSON.parse(responseBody);
      } catch (e) {
        jsonRes = responseBody;
      }

      return jsonRes;
    });
}

export function getStandings(leagueID) {
  return apiRequest(`/api/new-classic-league-standings/${leagueID}`);
}

export function postColumnCookie(body) {
  return apiRequest('/cookie/columns', 'POST', body);
}

export function getLeagueList() {
  return apiRequest('/cookie/leagues-list');
}

export function executeGraphqlQuery(query, variables) {
  return apiRequest('/graphql', 'POST', {
    query,
    variables,
  });
}
