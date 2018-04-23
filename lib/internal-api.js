import fetch from 'isomorphic-fetch';
import { precisionRound } from './helpers/precision-round';
import { applyPoints } from './helpers/get-team-points';
import teams from '../constants/teams';

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

const positionMap = ['GK', 'DEF', 'MID', 'FWD'];

const getPlayer = (player, entry, position, sub) => ({
  element: player.id,
  position,
  is_captain: entry.captain === player.id,
  is_vice_captain: entry.viceCaptain === player.id,
  multiplier: entry.playerPointsMultiplied === player.id ? entry.multiplier : 1,
  team: teams.findIndex(pos => player.team === pos) + 1,
  name: player.name,
  element_type: positionMap.findIndex(pos => player.position === pos) + 1,
  points: player.points,
  minutes_played: player.minutesPlayed,
  actual_bonus: player.actualBonus,
  provisional_bonus: player.provisionalBonus,
  game_started: player.gamesStarted,
  game_finished: player.gamesFinished,
  game_points_finalised: player.pointsFinalised,
  ep_this: player.expectedPoints,
  ep_next: player.expectedPointsNext,
  autoSub_in: sub && entry.projections.autoSubsIn.includes(player.id),
  autoSub_out: !sub ? entry.projections.autoSubsOut.includes(player.id) : null,
});

const getPlayers = (entry, players) => {
  const picks = entry.picks.map((playerId, i) => {
    const player = players.find(pick => pick.id === playerId);

    return getPlayer(player, entry, i + 1);
  });

  const subs = entry.subs.map((playerId, i) => {
    const player = players.find(pick => pick.id === playerId);

    return getPlayer(player, entry, i + 1, true);
  });

  return {
    picks,
    subs,
  };
};

function classicStandingsBackwardsCompatibility(standings) {
  return {
    leagueId: standings.data.classicLeague.leagueInfo.id,
    leagueName: standings.data.classicLeague.leagueInfo.name,
    lastUpdated: standings.data.classicLeague.leagueInfo.lastUpdated,
    gwEnded: standings.data.classicLeague.leagueInfo.gameweekEnded,
    players: standings.data.classicLeague.entries.map((entry) => {
      const players = getPlayers(entry, standings.data.classicLeague.players);

      const teamInfo = {
        event_transfers_cost: entry.transferCost,
        players,
      };

      return {
        entry: entry.id,
        team_name: entry.teamName,
        player_name: entry.name,
        active_chip: entry.activeChip,
        event_transfers_cost: entry.transferCost,
        players,
        prevTotal: entry.previousTotal,
        currentPoints: applyPoints(teamInfo),
        ep_this: precisionRound(applyPoints(teamInfo, 0, false, false, 'ep_this'), 1),
        ep_next: precisionRound(applyPoints(teamInfo, 0, false, false, 'ep_next'), 1),
        projectedPoints: applyPoints(teamInfo, 0, true, true),
      };
    }),
  };
}

export const getStandingsNew = leagueId => fetch('http://localhost:5000/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `query { classicLeague(leagueId: ${leagueId}) { leagueInfo { id name gameweekEnded lastUpdated } entries { id name teamName activeChip transferCost previousTotal picks subs captain viceCaptain playerPointsMultiplied multiplier currentPoints projections { autoSubsOut autoSubsIn playerPointsMultiplied } } players { id points team position name expectedPoints expectedPointsNext actualBonus provisionalBonus gamesStarted gamesFinished pointsFinalised minutesPlayed } } }`,
    variables: null,
  }),
  method: 'POST',
})
  .then(res => res.json())
  .then(classicStandingsBackwardsCompatibility);
