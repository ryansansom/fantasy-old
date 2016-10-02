import getLeagues from '../lib/get-leagues';
import getPlayers from '../lib/get-players';
import getPlayerPoints from '../lib/get-player-points';
import getStandings from '../lib/get-standings';
import getTeamPoints from '../lib/get-team-points';
import getTotalPoints from '../lib/get-total-points';
import getWeek from '../lib/get-week';
import { Router } from 'express';
const router = Router();

router.get('/leagues/:type', function(req, res) {
  const leagues = getLeagues('616549', req.params.type);

  return res.send(leagues);
});

router.get('/week', function(req, res) {
  const week = getWeek();

  return res.send(week);
});

router.get('/league-standings/:leagueType/:leagueID', function(req, res) {
  const standings = getStandings(req.params.leagueType, req.params.leagueID);

  return res.send(standings);
});

router.get('/players/:userID/:week', function(req, res) {
  const players = getPlayers(req.params.userID, req.params.week);

  return res.send(players);
});

router.get('/player-points/:playerID', function(req, res) {
  const playerPoints = getPlayerPoints(req.params.playerID);

  return res.send(playerPoints);
});

router.get('/total-points/:userID/:week', function(req, res) {
  const totalPoints = getTotalPoints(req.params.userID, req.params.week);

  return res.send(totalPoints);
});

export default router;
