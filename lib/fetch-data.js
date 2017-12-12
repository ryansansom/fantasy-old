import fetch from 'isomorphic-fetch';
import { getAuthHeader } from './helpers/credentials';

const hostUrl = 'https://api.fantasy.premierleague.com';
const clientKey = '43f0c9a3e162417c9e6744032276c8d2';

function apiRequest(endpoint = '') {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthHeader()}`,
      'X-Client-Key': clientKey,
    },
  };

  return fetch(hostUrl + endpoint, options)
    .then((res) => {
      if (res.status !== 200) throw res;
      return res.text();
    })
    .then((body) => {
      let jsonRes;

      try {
        jsonRes = JSON.parse(body);
      } catch (e) {
        jsonRes = body;
      }

      return jsonRes;
    });
}

export function getElements() {
  return apiRequest('/elements');
}

export function getElementDetail(player = 0, type = 'summary') {
  if (typeof player !== 'number' || !player || player > 1000) Promise.reject(new Error({ error: 'Invalid player ID format' }));
  if (!['summary', 'fixturehistory'].some(reqType => reqType === type)) Promise.reject(new Error({ error: 'Invalid request type' }));
  return apiRequest(`/elements/${player}/${type}`);
}

export function getEntry(teamID) {
  if (typeof teamID !== 'number' || !teamID) Promise.reject(new Error({ error: 'Invalid team ID format' }));
  return apiRequest(`/entry/${teamID}`);
}

export function getEntryPicks(teamID, week) {
  if (typeof teamID !== 'number' || !teamID) Promise.reject(new Error({ error: 'Invalid team ID format' }));
  if (typeof week !== 'number' || week < 1 || week > 38) Promise.reject(new Error({ error: 'Invalid week format' }));
  return apiRequest(`/entry/${teamID}/event/${week}/picks`)
    .catch((err) => {
      if (err.status === 404) {
        // This allows for new player to be added mid season - need to work on this...
        return {
          entry_history: {
            total_points: 0,
          },
        };
      }

      throw err;
    });
}

export function getHistory(teamID, week) {
  return fetch(`https://fantasy.premierleague.com/drf/entry/${teamID}/history`)
    .then(res => res.json())
    .then(data => data.history)
    .then(history => history.find(weekEntry => weekEntry.event === week) || { total_points: 0 })
    .then(data => data.total_points);
}

export function getEventLive(week) {
  if (typeof week !== 'number' || week < 1 || week > 38) Promise.reject(new Error({ error: 'Invalid week format' }));
  return apiRequest(`/event/${week}/live`);
}

export function getEvents() {
  return apiRequest('/events');
}

export function getLeaguesClassic(leagueID = '') {
  return apiRequest(`/leagues-classic-standings/${leagueID}`);
}

export function getLeaguesH2H(leagueID = '', type = 'standings') {
  if (!['standings', 'matches'].some(reqType => reqType === type)) Promise.reject(new Error({ error: 'Invalid request type' }));
  return apiRequest(`/leagues-h2h-${type}/${leagueID}`);
}

export function getMe() {
  return apiRequest('/me');
}

export function getMyTeam(teamID) {
  if (typeof teamID !== 'number' || !teamID) Promise.reject(new Error({ error: 'Invalid team ID format' }));
  return apiRequest(`/my-team/${teamID}`);
}

export function getTransfers() {
  return apiRequest('/transfers');
}
