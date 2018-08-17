import fetch from 'isomorphic-fetch';
import { performance } from 'perf_hooks';
import { getAuthHeader } from './helpers/credentials';

const hostUrl = 'https://api.fantasy.premierleague.com';
const clientKey = '43f0c9a3e162417c9e6744032276c8d2';

const isProduction = process.env.NODE_ENV === 'production';

function logRequestInfo(startTime, endpoint, res) {
  if (!isProduction) {
    const endTime = performance.now() - startTime;
    const contentLength = (parseInt(res.headers.get('content-length'), 10) || 0) / 1000;

    console.log(`${endpoint} - ${res.status} - ${Math.round(endTime)}ms - ${contentLength || '??'}kB`); // eslint-disable-line no-console
  }
}

function apiRequest(endpoint = '') {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthHeader()}`,
      'X-Client-Key': clientKey,
    },
  };

  const startTime = performance.now();

  return fetch(hostUrl + endpoint, options)
    .then((res) => {
      logRequestInfo(startTime, endpoint, res);

      if (res.status !== 200) throw res;

      return res.json();
    });
}

export function getElements() {
  return apiRequest('/elements');
}

export function getElementDetail(player = 0, type = 'summary') {
  if (typeof player !== 'number' || !player || player > 1000) throw new Error('Invalid player ID format');
  if (!['summary', 'fixturehistory'].some(reqType => reqType === type)) throw new Error('Invalid request type');
  return apiRequest(`/elements/${player}/${type}`);
}

export function getEntry(teamID) {
  if (typeof teamID !== 'number' || !teamID) throw new Error('Invalid team ID format');
  return apiRequest(`/entry/${teamID}`);
}

export function getEntryPicks(teamID, week) {
  if (typeof teamID !== 'number' || !teamID) throw new Error('Invalid team ID format');
  if (typeof week !== 'number' || week < 0 || week > 38) throw new Error('Invalid week format');
  if (week === 0) {
    return Promise.resolve({
      entry_history: {
        total_points: 0,
      },
    });
  }
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
  const endpoint = `/drf/entry/${teamID}/history`;

  const startTime = performance.now();
  return fetch(`https://fantasy.premierleague.com${endpoint}`)
    .then((res) => {
      logRequestInfo(startTime, endpoint, res);
      return res;
    })
    .then(res => res.json())
    .then(data => data.history)
    .then(history => history.find(weekEntry => weekEntry.event === week) || { total_points: 0 })
    .then(data => data.total_points);
}

export function getDraftLeague(leagueID = '') {
  const endpoint = `/api/league/${leagueID}/details`;

  const startTime = performance.now();
  return fetch(`https://draft.premierleague.com${endpoint}`)
    .then((res) => {
      logRequestInfo(startTime, endpoint, res);
      return res;
    })
    .then(res => res.json());
}

export function getDraftPicks(teamID, week) {
  if (week === 0) {
    return Promise.resolve({
      entry_history: {
        total_points: 0,
      },
    });
  }

  const endpoint = `/api/entry/${teamID}/event/${week}`;
  const startTime = performance.now();

  return fetch(`https://draft.premierleague.com${endpoint}`)
    .then((res) => {
      logRequestInfo(startTime, endpoint, res);
      return res;
    })
    .then(res => res.json());
}

export function getEventLive(week) {
  if (typeof week !== 'number' || week < 1 || week > 38) throw new Error('Invalid week format');
  return apiRequest(`/event/${week}/live`);
}

export function getEvents() {
  return apiRequest('/events');
}

export function getLeaguesClassic(leagueID = '') {
  return apiRequest(`/leagues-classic-standings/${leagueID}`);
}

export function getLeaguesH2H(leagueID = '', type = 'standings') {
  if (!['standings', 'matches'].some(reqType => reqType === type)) throw new Error('Invalid request type');
  return apiRequest(`/leagues-h2h-${type}/${leagueID}`);
}

export function getMe() {
  return apiRequest('/me');
}

export function getMyTeam(teamID) {
  if (typeof teamID !== 'number' || !teamID) throw new Error('Invalid team ID format');
  return apiRequest(`/my-team/${teamID}`);
}

export function getTransfers() {
  return apiRequest('/transfers');
}
