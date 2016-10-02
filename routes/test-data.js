import getLeagues from '../lib/get-leagues';
import getStandings from '../lib/get-standings';
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

export default router;
