import { getEventLive } from '../lib/fetch-data';
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
  return getLeagues('616549', req.params.type)
    .then(leagues => res.send(leagues))
    .catch(err => next(err));
});

router.get('/week', function(req, res, next) {
  return getWeek()
    .then(week => res.send(week))
    .catch(err => next(err));
});

router.get('/league-standings/:leagueType/:leagueID', function(req, res, next) {
  return getStandings(req.params.leagueType, req.params.leagueID)
    .then(standings => res.send(standings))
    .catch(err => next(err));
});

router.get('/players/:userID/:week', function(req, res) {
  return getPlayers(req.params.userID, req.params.week)
    .then(players => res.send(players))
    .catch(err => next(err));
});

router.get('/player-points/:playerID', function(req, res) {
  return getPlayerPoints([{element: req.params.playerID, multiplier: 1}, {element: 174, multiplier: 1}])
    .then(playerPoints => res.send(playerPoints))
    .catch(err => next(err));
});

router.get('/team-points/:userID/:week', function(req, res) {
  return getTeamPoints(req.params.userID, req.params.week)
    .then(totalPoints => res.send(totalPoints))
    .catch(err => next(err));
});

router.get('/total-points/:userID/:week', function(req, res) {
  return getTotalPoints(req.params.userID, req.params.week)
    .then(totalPoints => res.send(totalPoints))
    .catch(err => next(err));
});

export default router;
