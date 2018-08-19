import { precisionRound } from './precision-round';
import { applyPoints } from './get-team-points';
import teams from '../../constants/teams';

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

export default function classicStyleStandingsBackwardsCompatibility(standings) {
  return {
    leagueId: standings.data.classicStyleLeague.leagueInfo.id,
    leagueName: standings.data.classicStyleLeague.leagueInfo.name,
    lastUpdated: standings.data.classicStyleLeague.leagueInfo.lastUpdated,
    gwEnded: standings.data.classicStyleLeague.leagueInfo.gameweekEnded,
    players: standings.data.classicStyleLeague.entries.map((entry) => {
      const players = getPlayers(entry, standings.data.classicStyleLeague.players);

      const teamInfo = {
        event_transfers_cost: entry.transferCost,
        players,
      };

      const switchCaptain = entry.projections.playerPointsMultiplied !== entry.playerPointsMultiplied
        ? {
          from: entry.playerPointsMultiplied,
          to: entry.projections.playerPointsMultiplied,
          multiplier: entry.multiplier,
        }
        : null;

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
        projectedPoints: applyPoints(teamInfo, 0, true, true, 'points', switchCaptain),
      };
    }),
  };
}
