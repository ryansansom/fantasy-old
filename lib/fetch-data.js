import request from 'request';
import { authHeader, clientKey } from '../data/auth';
const hostUrl = 'https://api.fantasy.premierleague.com';

function apiRequest(endpoint = '') {
  const options = {
    url: hostUrl + endpoint,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + authHeader,
      'X-Client-Key': clientKey
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

export function getElements() {
  return apiRequest('/elements');
}

export function getElementDetail(player = 0, type = 'summary') {
  if (typeof player !== 'number' || !player || player > 1000) Promise.reject({"error": "Invalid player ID format"});
  if (!['summary', 'fixturehistory'].some(reqType => reqType === type)) Promise.reject({"error": "Invalid request type"});
  return apiRequest('/elements/' + player + '/' + type);
}

export function getEntry(teamID) {
  if (typeof teamID !== 'number' || !teamID) Promise.reject({"error": "Invalid team ID format"});
  return apiRequest('/entry/' + teamID);
}

export function getEntryPicks(teamID, week) {
  if (typeof teamID !== 'number' || !teamID) Promise.reject({"error": "Invalid team ID format"});
  if (typeof week !== 'number' || week < 1 || week > 38) Promise.reject({"error": "Invalid week format"});
  return apiRequest('/entry/' + teamID + '/event/' + week + '/picks');
}

export function getEventLive(week) {
  if (typeof week !== 'number' || week < 1 || week > 38) Promise.reject({"error": "Invalid week format"});
  return apiRequest('/event/' + week + '/live');
}

export function getEvents() {
  return apiRequest('/events');
}

export function getLeaguesClassic(leagueID = '') {
  return apiRequest('/leagues-classic-standings/' + leagueID);
}

export function getLeaguesH2H(leagueID = '', type = 'standings') {
  if (!['standings', 'matches'].some(reqType => reqType === type)) Promise.reject({"error": "Invalid request type"});
  return apiRequest('/leagues-h2h-' + type + '/' + leagueID);
}

export function getMe() {
  return apiRequest('/me');
}

export function getMyTeam(teamID) {
  if (typeof teamID !== 'number' || !teamID) Promise.reject({"error": "Invalid team ID format"});
  return apiRequest('/my-team/' + teamID);
}

export function getTransfers() {
  return apiRequest('/transfers');
}
