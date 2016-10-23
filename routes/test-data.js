import errHandler from './async-route-handler';
import getLeagues from '../lib/get-leagues';
import getPlayers from '../lib/get-players';
import getPlayerPoints from '../lib/get-player-points';
import getStandings from '../lib/get-standings';
import getTeamPoints from '../lib/get-team-points';
import getTotalPoints from '../lib/get-total-points';
import getWeek from '../lib/get-week';
import { Router } from 'express';
const router = Router();

router.get('/leagues', errHandler(async(req, res, next) => { // eslint-disable-line no-unused-vars
  const leagues = await getLeagues(req.query.teamID);
  return res.send(leagues);
}));

router.get('/week', errHandler(async(req, res, next) =>  { // eslint-disable-line no-unused-vars
  const week = await getWeek();
  return res.send(week);
}));

router.get('/classic-league-standings/:leagueID', errHandler(async(req, res, next) => { // eslint-disable-line no-unused-vars
  const standings = await getStandings(req.params.leagueID);
  return res.send(standings);
}));

router.get('/players/:teamID/:week', errHandler(async(req, res, next) => { // eslint-disable-line no-unused-vars
  const players = await getPlayers([req.params.teamID], req.params.week);
  return res.send(players);
}));

router.get('/player-points/:playerID', errHandler(async(req, res, next) => { // eslint-disable-line no-unused-vars
  const playerPoints = await getPlayerPoints([{element: req.params.playerID, multiplier: 1}, {element: 174, multiplier: 1}]);
  return res.send(playerPoints);
}));

router.get('/team-points/:teamID/:week', errHandler(async(req, res, next) => { // eslint-disable-line no-unused-vars
  const teamPoints = await getTeamPoints(req.params.teamID, req.params.week);
  return res.send(teamPoints);
}));

router.get('/total-points/:teamID/:week', errHandler(async(req, res, next) => { // eslint-disable-line no-unused-vars
  const totalPoints = await getTotalPoints(req.params.teamID, req.params.week);
  return res.send(totalPoints);
}));

export default router;
