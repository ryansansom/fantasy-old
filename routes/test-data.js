import getLeagues from '../lib/get-leagues';
import { Router } from 'express';
const router = Router();

router.get('/leagues', function(req, res) {
  const leagues = getLeagues('616549', 'h2h');

  return res.send(leagues);
});

export default router;
