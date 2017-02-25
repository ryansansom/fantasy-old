import fetch from 'isomorphic-fetch';
import { authHeader, clientKey } from './helpers/test-creds';
const hostUrl = 'https://api.fantasy.premierleague.com';

function apiRequest(endpoint = '') {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + authHeader,
      'X-Client-Key': clientKey
    }
  };

  return fetch(hostUrl + endpoint, options)
    .then(res => {
      if (res.status !== 200) throw new Error('Status code not expected. Expected 200, got '+ res.status);
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
    });
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
