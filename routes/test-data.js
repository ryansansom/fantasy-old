import getLeagues from '../lib/get-leagues';
import getWeek from '../lib/get-week';
import { Router } from 'express';
const router = Router();

router.get('/leagues', function(req, res) {
  const leagues = getLeagues('616549', 'h2h');

  return res.send(leagues);
});

router.get('/week', function(req, res) {
  const week = getWeek();

  return res.send(week);
});

export default router;
